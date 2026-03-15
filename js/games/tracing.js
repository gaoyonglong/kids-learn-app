// 描红游戏 - Canvas触控绘制（增强版）
const TracingGame = {
  canvas: null,
  ctx: null,
  currentChar: null,
  strokes: [],
  currentStroke: [],
  isDrawing: false,

  init(container) {
    this.container = container;
    this.render();
    this.setupCanvas();
  },

  render() {
    this.container.innerHTML = `
      <div class="tracing-game">
        <div class="tracing-header">
          <h2>描红游戏 ✏️</h2>
          <p>跟着笔画写出汉字</p>
          <p style="color: var(--text-light); margin-top: 10px;">点击汉字可以听发音 🔊</p>
        </div>
        <div class="tracing-content">
          <div class="char-display">
            <div class="reference-char" id="referenceChar" style="cursor: pointer;"></div>
          </div>
          <div class="canvas-container">
            <canvas id="tracingCanvas" width="300" height="300"></canvas>
          </div>
          <div class="tracing-controls">
            <button class="btn btn-primary" id="checkTrace">✓ 检查</button>
            <button class="btn btn-secondary" id="clearTrace">↺ 重写</button>
            <button class="btn btn-accent" id="nextChar">→ 下一个</button>
          </div>
        </div>
      </div>
    `;
    this.setupEvents();
  },

  setupCanvas() {
    this.canvas = document.getElementById('tracingCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.strokeStyle = '#ff6b6b';
    this.ctx.lineWidth = 8;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // 触控事件
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.startDrawing(e.touches[0]);
    });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.draw(e.touches[0]);
    });
    this.canvas.addEventListener('touchend', () => this.endDrawing());

    // 鼠标事件
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.endDrawing());
    this.canvas.addEventListener('mouseleave', () => this.endDrawing());

    this.loadNextChar();
  },

  setupEvents() {
    document.getElementById('checkTrace').addEventListener('click', () => this.check());
    document.getElementById('clearTrace').addEventListener('click', () => this.clear());
    document.getElementById('nextChar').addEventListener('click', () => this.loadNextChar());
    document.getElementById('referenceChar').addEventListener('click', () => {
      if (this.currentChar) Speech.speakChar(this.currentChar.char);
    });
  },

  loadNextChar() {
    const chars = AppData.getRandomChars(1);
    this.currentChar = chars[0];
    this.strokes = [];
    this.currentStroke = [];
    this.clear();

    document.getElementById('referenceChar').textContent = this.currentChar.char;
    Speech.speakChar(this.currentChar.char);
  },

  startDrawing(e) {
    this.isDrawing = true;
    const pos = this.getPos(e);
    this.currentStroke = [pos];
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  },

  draw(e) {
    if (!this.isDrawing) return;
    const pos = this.getPos(e);
    this.currentStroke.push(pos);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  },

  endDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    if (this.currentStroke.length > 0) {
      this.strokes.push([...this.currentStroke]);
    }
    this.currentStroke = [];
  },

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  },

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.strokes = [];
    this.currentStroke = [];
    this.drawGrid();
  },

  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
    ctx.moveTo(w, 0);
    ctx.lineTo(0, h);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 8;
  },

  check() {
    const hasStrokes = this.strokes.length > 0;
    const totalLength = this.strokes.reduce((sum, s) => sum + s.length, 0);
    const isGood = hasStrokes && totalLength > 50;

    if (isGood) {
      this.showResult(true);
      Storage.addStars(5);
      Storage.markCharLearned(this.currentChar.id);

      // 连击
      if (window.App) {
        App.combo++;
        App.updateCombo();
      }

      Speech.playCorrect(window.App?.combo || 0);

      if (window.Pet) Pet.celebrate();

      const newBadges = Rewards.checkAndAward('char_learned');
      newBadges.forEach(b => Rewards.showBadgeNotification(b));
    } else {
      this.showResult(false);
      if (window.App) App.resetCombo();
    }
  },

  showResult(success) {
    const overlay = document.createElement('div');
    overlay.className = `result-overlay ${success ? 'success' : 'fail'}`;
    overlay.innerHTML = success
      ? '<div class="result-content animate-bounce-in"><div style="font-size: 60px;">🎉</div><div style="font-size: 28px; margin-top: 10px;">太棒了！</div></div>'
      : '<div class="result-content animate-shake"><div style="font-size: 60px;">💪</div><div style="font-size: 28px; margin-top: 10px;">再试一次！</div></div>';
    this.container.appendChild(overlay);

    if (success) {
      this.createConfetti();
    }

    setTimeout(() => overlay.remove(), 2000);
  },

  createConfetti() {
    const emojis = ['⭐', '🌟', '✨', '🎉', '🎊', '💫'];
    for (let i = 0; i < 25; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      this.container.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2000);
    }
  },

  destroy() {
    this.container.innerHTML = '';
  }
};

window.TracingGame = TracingGame;