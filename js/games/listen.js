// 听音选字游戏（增强版）
const ListenGame = {
  container: null,
  currentItem: null,
  options: [],
  score: 0,
  streak: 0,
  total: 10,
  current: 0,
  mode: 'char',

  init(container, mode = 'char') {
    this.container = container;
    this.mode = mode;
    this.streak = 0;
    this.render();
    this.startGame();
  },

  render() {
    const title = this.mode === 'char' ? '听音选字 🔊' : '听音选数字 🔢';
    this.container.innerHTML = `
      <div class="listen-game">
        <div class="listen-header">
          <h2>${title}</h2>
          <p>听声音，选出正确的字</p>
          <div class="game-progress">
            第 <span id="listenCurrent">1</span> / <span id="listenTotal">${this.total}</span> 题
          </div>
          <div class="score-display">得分: <span id="listenScore">0</span></div>
        </div>
        <div class="listen-content">
          <button class="play-sound-btn" id="playSoundBtn">
            <span class="sound-icon">🔊</span>
            <span>播放声音</span>
          </button>
          <div class="options-grid" id="optionsGrid"></div>
        </div>
        <div class="listen-controls">
          <button class="btn btn-primary" id="restartListen">🔄 重新开始</button>
        </div>
      </div>
    `;
    document.getElementById('playSoundBtn').addEventListener('click', () => this.playSound());
    document.getElementById('restartListen').addEventListener('click', () => this.startGame());
  },

  startGame() {
    this.score = 0;
    this.streak = 0;
    this.current = 0;
    document.getElementById('listenScore').textContent = '0';
    this.nextQuestion();
  },

  nextQuestion() {
    this.current++;
    if (this.current > this.total) {
      this.gameComplete();
      return;
    }

    document.getElementById('listenCurrent').textContent = this.current;

    if (this.mode === 'char') {
      const chars = AppData.getRandomChars(1);
      this.currentItem = chars[0];

      const allOptions = AppData.getRandomChars(4);
      if (!allOptions.find(o => o.id === this.currentItem.id)) {
        allOptions[0] = this.currentItem;
      }
      this.options = this.shuffle(allOptions);
    } else {
      const nums = AppData.getRandomNumbers(1);
      this.currentItem = nums[0];

      const allOptions = AppData.getRandomNumbers(4);
      if (!allOptions.find(o => o.id === this.currentItem.id)) {
        allOptions[0] = this.currentItem;
      }
      this.options = this.shuffle(allOptions);
    }

    this.renderOptions();
    setTimeout(() => this.playSound(), 500);
  },

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  renderOptions() {
    const grid = document.getElementById('optionsGrid');
    grid.innerHTML = '';

    this.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';

      if (this.mode === 'char') {
        btn.textContent = opt.char;
        btn.dataset.id = opt.id;
      } else {
        btn.innerHTML = `<span class="option-number">${opt.number}</span><span class="option-chinese">${opt.chinese}</span>`;
        btn.dataset.id = opt.id;
      }

      btn.addEventListener('click', () => this.selectOption(btn, opt));
      grid.appendChild(btn);
    });
  },

  playSound() {
    const btn = document.getElementById('playSoundBtn');
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => btn.style.transform = '', 200);

    if (this.mode === 'char') {
      Speech.speakChar(this.currentItem.char);
    } else {
      Speech.speak(this.currentItem.chinese, 0.8, 1.1);
    }
  },

  selectOption(btn, opt) {
    const isCorrect = opt.id === this.currentItem.id;
    const allBtns = document.querySelectorAll('.option-btn');

    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.classList.add('correct');
      this.streak++;

      // 连击奖励
      let bonus = 10;
      if (this.streak >= 10) bonus = 30;
      else if (this.streak >= 5) bonus = 20;
      else if (this.streak >= 3) bonus = 15;

      this.score += bonus;
      document.getElementById('listenScore').textContent = this.score;

      Speech.playCorrect(this.streak);

      if (window.Pet) Pet.celebrate();

      // 显示连击提示
      if (this.streak >= 3) {
        this.showStreakNotification(this.streak);
      }

      const newBadges = Rewards.checkAndAward('streak', { count: this.streak });
      newBadges.forEach(b => Rewards.showBadgeNotification(b));
    } else {
      btn.classList.add('wrong');
      this.streak = 0;

      allBtns.forEach(b => {
        if (parseInt(b.dataset.id) === this.currentItem.id) {
          b.classList.add('correct');
        }
      });

      Speech.playWrong();
    }

    setTimeout(() => this.nextQuestion(), 1500);
  },

  showStreakNotification(streak) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
      color: white;
      padding: 20px 40px;
      border-radius: 20px;
      font-size: 28px;
      font-weight: bold;
      z-index: 100;
      animation: bounceIn 0.5s ease;
    `;
    notification.innerHTML = `🔥 ${streak}连击！`;
    this.container.appendChild(notification);
    setTimeout(() => notification.remove(), 1000);
  },

  gameComplete() {
    Storage.addStars(this.score);
    Storage.saveGameScore('listen_' + this.mode, this.score);

    const newBadges = Rewards.checkAndAward('game_completed');
    newBadges.forEach(b => Rewards.showBadgeNotification(b));

    const overlay = document.createElement('div');
    overlay.className = 'result-overlay success';
    overlay.innerHTML = `
      <div class="result-content animate-bounce-in">
        <div class="big-emoji">🎊</div>
        <div class="result-text">游戏结束！</div>
        <div class="result-score">得分: ${this.score}</div>
      </div>
    `;
    this.container.appendChild(overlay);

    this.createConfetti();
    Speech.playCorrect();

    if (window.Pet) Pet.celebrate();

    setTimeout(() => {
      overlay.remove();
      this.startGame();
    }, 3000);
  },

  createConfetti() {
    const emojis = ['⭐', '🌟', '✨', '🎉', '🎊', '💫', '🏆'];
    for (let i = 0; i < 30; i++) {
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

window.ListenGame = ListenGame;