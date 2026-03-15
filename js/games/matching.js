// 连连看游戏（增强版）
const MatchingGame = {
  container: null,
  pairs: [],
  selected: null,
  matched: 0,
  total: 0,
  score: 0,
  lines: [],
  combo: 0,

  init(container) {
    this.container = container;
    this.combo = 0;
    this.render();
    this.startGame();
  },

  render() {
    this.container.innerHTML = `
      <div class="matching-game">
        <div class="matching-header">
          <h2>连连看 🔗</h2>
          <p>把汉字和图片连起来</p>
          <div class="score-display">得分: <span id="matchScore">0</span></div>
        </div>
        <div class="matching-board" id="matchingBoard"></div>
        <div class="matching-controls">
          <button class="btn btn-primary" id="restartMatch">🔄 重新开始</button>
        </div>
      </div>
    `;
    document.getElementById('restartMatch').addEventListener('click', () => this.startGame());
  },

  startGame() {
    const chars = AppData.getRandomChars(6);
    this.pairs = chars.map(c => ({
      char: c.char,
      image: c.image,
      id: c.id,
      matched: false
    }));
    this.matched = 0;
    this.total = this.pairs.length;
    this.score = 0;
    this.selected = null;
    this.lines = [];
    this.combo = 0;

    this.renderBoard();
    document.getElementById('matchScore').textContent = '0';
  },

  renderBoard() {
    const board = document.getElementById('matchingBoard');
    board.innerHTML = '';

    const leftColumn = document.createElement('div');
    leftColumn.className = 'match-column';
    const shuffledChars = this.shuffle([...this.pairs]);
    shuffledChars.forEach((pair) => {
      const item = document.createElement('div');
      item.className = 'match-item char-item';
      item.dataset.id = pair.id;
      item.dataset.side = 'left';
      item.textContent = pair.char;
      item.addEventListener('click', () => this.selectItem(item, pair));
      leftColumn.appendChild(item);
    });

    const rightColumn = document.createElement('div');
    rightColumn.className = 'match-column';
    const shuffledImages = this.shuffle([...this.pairs]);
    shuffledImages.forEach((pair) => {
      const item = document.createElement('div');
      item.className = 'match-item image-item';
      item.dataset.id = pair.id;
      item.dataset.side = 'right';
      item.textContent = pair.image;
      item.addEventListener('click', () => this.selectItem(item, pair));
      rightColumn.appendChild(item);
    });

    board.appendChild(leftColumn);
    board.appendChild(rightColumn);
  },

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  selectItem(element, pair) {
    if (pair.matched) return;

    if (!this.selected) {
      this.selected = { element, pair };
      element.classList.add('selected');
      Speech.speakChar(pair.char);
    } else if (this.selected.element === element) {
      element.classList.remove('selected');
      this.selected = null;
    } else {
      const first = this.selected;
      const second = { element, pair };

      const isMatch = first.pair.id === second.pair.id &&
                      first.element.dataset.side !== second.element.dataset.side;

      if (isMatch) {
        this.handleMatch(first, second);
      } else {
        this.handleMismatch(first, second);
      }

      first.element.classList.remove('selected');
      this.selected = null;
    }
  },

  handleMatch(first, second) {
    first.pair.matched = true;
    second.pair.matched = true;
    first.element.classList.add('matched');
    second.element.classList.add('matched');

    this.drawLine(first.element, second.element);

    this.matched++;
    this.combo++;

    // 连击奖励
    let bonus = 10;
    if (this.combo >= 5) bonus = 20;
    else if (this.combo >= 3) bonus = 15;

    this.score += bonus;
    document.getElementById('matchScore').textContent = this.score;

    Speech.playCorrect(this.combo);

    if (window.Pet) Pet.celebrate();

    if (this.matched === this.total) {
      setTimeout(() => this.gameComplete(), 500);
    }
  },

  handleMismatch(first, second) {
    first.element.classList.add('wrong');
    second.element.classList.add('wrong');
    this.combo = 0;

    Speech.playWrong();

    setTimeout(() => {
      first.element.classList.remove('wrong');
      second.element.classList.remove('wrong');
    }, 500);
  },

  drawLine(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    const boardRect = document.getElementById('matchingBoard').getBoundingClientRect();

    const line = document.createElement('div');
    line.className = 'match-line';
    const x1 = rect1.right - boardRect.left;
    const y1 = rect1.top + rect1.height / 2 - boardRect.top;
    const x2 = rect2.left - boardRect.left;
    const y2 = rect2.top + rect2.height / 2 - boardRect.top;

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = length + 'px';
    line.style.left = x1 + 'px';
    line.style.top = y1 + 'px';
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 50%';

    document.getElementById('matchingBoard').appendChild(line);
  },

  gameComplete() {
    Storage.addStars(this.score);
    const newBadges = Rewards.checkAndAward('game_completed');
    newBadges.forEach(b => Rewards.showBadgeNotification(b));

    const overlay = document.createElement('div');
    overlay.className = 'result-overlay success';
    overlay.innerHTML = `
      <div class="result-content animate-bounce-in">
        <div class="big-emoji">🎉</div>
        <div class="result-text">恭喜通关！</div>
        <div class="result-score">得分: ${this.score}</div>
        ${this.combo >= 3 ? `<div style="color: var(--danger); margin-top: 10px;">🔥 最高连击: ${this.combo}</div>` : ''}
      </div>
    `;
    this.container.appendChild(overlay);

    this.createConfetti();
    Speech.playCorrect();

    if (window.Pet) Pet.celebrate();

    setTimeout(() => overlay.remove(), 3000);
  },

  createConfetti() {
    const emojis = ['⭐', '🌟', '✨', '🎉', '🎊', '💫', '🏆'];
    for (let i = 0; i < 35; i++) {
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

window.MatchingGame = MatchingGame;