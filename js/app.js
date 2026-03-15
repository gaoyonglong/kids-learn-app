// 主应用逻辑 - 增强版
const App = {
  currentPage: 'home',
  currentView: null,
  currentCharIndex: 0,
  combo: 0,           // 连击计数
  maxCombo: 0,        // 最大连击

  init() {
    this.render();
    this.setupEvents();
    this.updateStats();
    // 初始化宠物
    setTimeout(() => Pet.init(), 500);
  },

  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-container">
        ${this.renderHeader()}
        ${this.renderNav()}
        <main class="main-content" id="mainContent">
          ${this.renderHome()}
        </main>
      </div>
    `;
  },

  renderHeader() {
    const stats = Storage.getStats();
    return `
      <header class="header">
        <div class="logo" onclick="Pet.showPetPanel()" style="cursor: pointer;">
          <span class="logo-icon">🎓</span>
          <span class="logo-text">快乐识字</span>
        </div>
        <div class="stats-bar">
          <div class="stat-item" onclick="App.showComboInfo()" style="cursor: pointer;">
            <span class="stat-icon">🔥</span>
            <span class="stat-value">${this.maxCombo}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⭐</span>
            <span class="stat-value">${stats.stars}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🏆</span>
            <span class="stat-value">${stats.badges}</span>
          </div>
        </div>
      </header>
    `;
  },

  renderNav() {
    return `
      <nav class="nav">
        <button class="nav-btn active" data-page="home">
          <span class="nav-btn-icon">🏠</span>
          <span>首页</span>
        </button>
        <button class="nav-btn" data-page="characters">
          <span class="nav-btn-icon">📖</span>
          <span>学汉字</span>
        </button>
        <button class="nav-btn" data-page="numbers">
          <span class="nav-btn-icon">🔢</span>
          <span>学数字</span>
        </button>
        <button class="nav-btn" data-page="games">
          <span class="nav-btn-icon">🎮</span>
          <span>游戏</span>
        </button>
        <button class="nav-btn" data-page="badges">
          <span class="nav-btn-icon">🏆</span>
          <span>勋章</span>
        </button>
      </nav>
    `;
  },

  setupEvents() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        this.navigateTo(page);
      });
    });
  },

  navigateTo(page) {
    this.currentPage = page;
    this.currentView = null;

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === page);
    });

    const content = document.getElementById('mainContent');
    switch (page) {
      case 'home':
        content.innerHTML = this.renderHome();
        break;
      case 'characters':
        content.innerHTML = this.renderCharacters();
        this.setupCharacterEvents();
        break;
      case 'numbers':
        content.innerHTML = this.renderNumbers();
        this.setupNumberEvents();
        break;
      case 'games':
        content.innerHTML = this.renderGames();
        this.setupGameEvents();
        break;
      case 'badges':
        content.innerHTML = this.renderBadges();
        break;
    }
  },

  renderHome() {
    const stats = Storage.getStats();
    const charProgress = Levels.getCharProgress();
    const numProgress = Levels.getNumProgress();

    return `
      <div class="home-page animate-fade-in">
        <h1 style="text-align: center; font-size: 36px; margin-bottom: 30px;">
          欢迎来到快乐识字！ 🎉
        </h1>

        <!-- 关卡进度 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
          <div class="progress-card" style="background: linear-gradient(135deg, #fff9e6, #fff5cc); padding: 25px; border-radius: 20px; cursor: pointer;" onclick="App.navigateTo('characters')">
            <h3 style="font-size: 24px; margin-bottom: 15px;">📖 汉字关卡 ${charProgress.currentStage}/${charProgress.totalStages}</h3>
            <div class="progress-bar" style="height: 15px;">
              <div class="progress-fill" style="width: ${charProgress.progress}%"></div>
            </div>
            <p style="font-size: 16px; color: var(--text-light); margin-top: 10px;">
              ${charProgress.nextStage ? `下一关: ${charProgress.nextStage.name}` : '已通关！🎉'}
            </p>
            <p style="font-size: 18px; color: var(--primary); margin-top: 5px;">
              已学会 <strong>${stats.learnedChars}</strong> / ${stats.totalChars} 个汉字
            </p>
          </div>

          <div class="progress-card" style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 25px; border-radius: 20px; cursor: pointer;" onclick="App.navigateTo('numbers')">
            <h3 style="font-size: 24px; margin-bottom: 15px;">🔢 数字关卡 ${numProgress.currentStage}/${numProgress.totalStages}</h3>
            <div class="progress-bar" style="height: 15px;">
              <div class="progress-fill" style="width: ${numProgress.progress}%"></div>
            </div>
            <p style="font-size: 16px; color: var(--text-light); margin-top: 10px;">
              ${numProgress.nextStage ? `下一关: ${numProgress.nextStage.name}` : '已通关！🎉'}
            </p>
            <p style="font-size: 18px; color: var(--secondary); margin-top: 5px;">
              已学会 <strong>${stats.learnedNumbers}</strong> / ${stats.totalNumbers} 个数字
            </p>
          </div>
        </div>

        <!-- 快速开始 -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 28px; margin-bottom: 20px;">🚀 快速开始</h2>
          <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="App.startQuickLearn('char')" style="font-size: 20px; padding: 20px 40px;">
              开始学汉字
            </button>
            <button class="btn btn-accent" onclick="App.startQuickLearn('number')" style="font-size: 20px; padding: 20px 40px;">
              开始学数字
            </button>
          </div>
        </div>

        <!-- 今日推荐 -->
        <div>
          <h2 style="font-size: 28px; margin-bottom: 20px;">✨ 今日推荐</h2>
          <div class="card-grid" id="recommendCards"></div>
        </div>
      </div>
    `;
  },

  renderCharacters() {
    const categories = AppData.getCategories();
    return `
      <div class="characters-page animate-fade-in">
        <h2 style="font-size: 32px; margin-bottom: 20px;">📖 学习汉字</h2>

        <!-- 关卡进度 -->
        ${Levels.renderStageSelect('char')}

        <!-- 学习模式选择 -->
        <div style="display: flex; gap: 15px; margin: 30px 0; flex-wrap: wrap;">
          <button class="btn btn-primary" id="learnMode">📚 认字模式</button>
          <button class="btn btn-secondary" id="traceMode">✏️ 描红模式</button>
          <button class="btn btn-accent" id="randomLearn">🎲 随机学习</button>
        </div>

        <!-- 分类选择 -->
        <div style="margin-bottom: 30px;">
          <h3 style="font-size: 24px; margin-bottom: 15px;">选择分类</h3>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;" id="categoryBtns">
            <button class="btn btn-secondary active" data-category="all">全部</button>
            ${Object.entries(categories).map(([key, name]) =>
              `<button class="btn btn-secondary" data-category="${key}">${name}</button>`
            ).join('')}
          </div>
        </div>

        <div class="card-grid" id="charGrid"></div>
      </div>
      <div id="learnModal" style="display: none;"></div>
    `;
  },

  renderNumbers() {
    return `
      <div class="numbers-page animate-fade-in">
        <h2 style="font-size: 32px; margin-bottom: 20px;">🔢 学习数字</h2>

        <!-- 关卡进度 -->
        ${Levels.renderStageSelect('num')}

        <!-- 学习模式选择 -->
        <div style="display: flex; gap: 15px; margin: 30px 0; flex-wrap: wrap;">
          <button class="btn btn-primary" id="numLearnMode">📚 认数字</button>
          <button class="btn btn-secondary" id="numGameMode">🎮 听音选数字</button>
        </div>

        <div class="card-grid" id="numGrid"></div>
      </div>
      <div id="numModal" style="display: none;"></div>
    `;
  },

  renderGames() {
    return `
      <div class="games-page animate-fade-in">
        <h2 style="font-size: 32px; margin-bottom: 30px;">🎮 游戏中心</h2>

        <!-- 连击显示 -->
        <div id="comboDisplay" style="display: none; text-align: center; margin-bottom: 20px;">
          <div style="font-size: 48px; animation: pulse 0.5s ease infinite;">🔥</div>
          <div style="font-size: 32px; font-weight: bold; color: var(--danger);">连击 x<span id="comboCount">0</span></div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px;">
          <div class="game-card" style="background: linear-gradient(135deg, #fff9e6, #fff5cc); padding: 30px; border-radius: 20px; cursor: pointer; transition: all 0.3s;" onclick="App.startGame('trace')">
            <div style="font-size: 60px; margin-bottom: 15px;">✏️</div>
            <h3 style="font-size: 24px; margin-bottom: 10px;">描红游戏</h3>
            <p style="color: var(--text-light);">跟着笔画写字</p>
          </div>

          <div class="game-card" style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 30px; border-radius: 20px; cursor: pointer; transition: all 0.3s;" onclick="App.startGame('match')">
            <div style="font-size: 60px; margin-bottom: 15px;">🔗</div>
            <h3 style="font-size: 24px; margin-bottom: 10px;">连连看</h3>
            <p style="color: var(--text-light);">把汉字和图片连起来</p>
          </div>

          <div class="game-card" style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 30px; border-radius: 20px; cursor: pointer; transition: all 0.3s;" onclick="App.startGame('drag')">
            <div style="font-size: 60px; margin-bottom: 15px;">🎯</div>
            <h3 style="font-size: 24px; margin-bottom: 10px;">拖拽配对</h3>
            <p style="color: var(--text-light);">把汉字拖到正确的图片</p>
          </div>

          <div class="game-card" style="background: linear-gradient(135deg, #fce4ec, #f8bbd9); padding: 30px; border-radius: 20px; cursor: pointer; transition: all 0.3s;" onclick="App.startGame('listen')">
            <div style="font-size: 60px; margin-bottom: 15px;">🔊</div>
            <h3 style="font-size: 24px; margin-bottom: 10px;">听音选字</h3>
            <p style="color: var(--text-light);">听声音选正确的字</p>
          </div>
        </div>

        <div id="gameArea" style="margin-top: 30px;"></div>
      </div>
    `;
  },

  renderBadges() {
    const badges = Rewards.getAllBadges();
    const earnedCount = badges.filter(b => b.earned).length;
    const pets = Pet.getUnlockedPets();

    return `
      <div class="badges-page animate-fade-in">
        <h2 style="font-size: 32px; margin-bottom: 10px;">🏆 我的成就</h2>
        <p style="font-size: 20px; color: var(--text-light); margin-bottom: 30px;">
          已获得 ${earnedCount} / ${badges.length} 个勋章
        </p>

        <!-- 宠物展示 -->
        <div style="background: linear-gradient(135deg, #fff9e6, #fff5cc); padding: 25px; border-radius: 20px; margin-bottom: 30px;">
          <h3 style="font-size: 24px; margin-bottom: 15px;">🐾 我的宠物伙伴</h3>
          <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            ${pets.map(pet => `
              <div style="text-align: center; padding: 15px; background: white; border-radius: 15px; ${pet.current ? 'border: 3px solid var(--warning);' : ''} ${!pet.unlocked ? 'opacity: 0.5;' : ''}">
                <div style="font-size: 40px;">${pet.emoji}</div>
                <div style="font-size: 14px; margin-top: 5px;">${pet.unlocked ? pet.name : '???'}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="badge-grid">
          ${badges.map(badge => `
            <div class="badge-item ${badge.earned ? 'earned' : 'locked'}">
              <div class="badge-icon">${badge.icon}</div>
              <div class="badge-name">${badge.earned ? badge.name : '???'}</div>
              <div style="font-size: 12px; color: var(--text-light); margin-top: 5px;">
                ${badge.earned ? badge.desc : '尚未解锁'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  setupCharacterEvents() {
    this.renderCharGrid('all');

    document.querySelectorAll('#categoryBtns .btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#categoryBtns .btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderCharGrid(btn.dataset.category);
      });
    });

    document.getElementById('learnMode').addEventListener('click', () => {
      this.currentView = 'learn';
    });

    document.getElementById('traceMode').addEventListener('click', () => {
      this.startGame('trace');
    });

    document.getElementById('randomLearn').addEventListener('click', () => {
      this.startRandomLearn();
    });
  },

  startRandomLearn() {
    const progress = Storage.getProgress();
    // 优先选择未学习的字
    let chars = AppData.characters.filter(c => !progress.learnedChars.includes(c.id));
    if (chars.length === 0) chars = AppData.characters;

    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    this.showCharDetail(randomChar.id);
  },

  renderCharGrid(category) {
    const grid = document.getElementById('charGrid');
    const progress = Storage.getProgress();
    const chars = category === 'all'
      ? AppData.characters
      : AppData.getByCategory(category);

    grid.innerHTML = chars.map(char => `
      <div class="card ${progress.learnedChars.includes(char.id) ? 'learned' : ''}"
           data-id="${char.id}"
           onclick="App.showCharDetail(${char.id})">
        <div class="card-char">${char.char}</div>
        <div class="card-pinyin">${char.pinyin}</div>
        <div class="card-image">${char.image}</div>
      </div>
    `).join('');
  },

  showCharDetail(charId) {
    const char = AppData.characters.find(c => c.id === charId);
    if (!char) return;

    const modal = document.getElementById('learnModal');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';

    modal.innerHTML = `
      <div class="learn-card animate-zoom-in" style="position: relative; max-width: 90%;">
        <button onclick="App.closeModal('learnModal')" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 24px; cursor: pointer;">✕</button>
        <div class="char-display" onclick="Speech.speakChar('${char.char}')">${char.char}</div>
        <div class="pinyin-display">${char.pinyin}</div>
        <div class="image-display">${char.image}</div>
        <div class="words-display">
          ${char.words.map(w => `<span class="word-tag" onclick="Speech.speakWord('${w}')">${w}</span>`).join('')}
        </div>
        <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="App.markCharLearned(${char.id})">我学会了 ⭐</button>
          <button class="btn btn-secondary" onclick="App.startTraceForChar(${char.id})">描红练习</button>
          <button class="btn btn-accent" onclick="App.showNextChar(${char.id})">下一个 ➡️</button>
        </div>
      </div>
    `;

    Speech.speakChar(char.char);
  },

  showNextChar(currentId) {
    const currentIndex = AppData.characters.findIndex(c => c.id === currentId);
    const nextIndex = (currentIndex + 1) % AppData.characters.length;
    this.closeModal('learnModal');
    setTimeout(() => this.showCharDetail(AppData.characters[nextIndex].id), 100);
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.innerHTML = '';
  },

  markCharLearned(charId) {
    const oldCount = Storage.getProgress().learnedChars.length;
    Storage.markCharLearned(charId);
    Storage.addStars(5);
    this.updateStats();

    const newCount = Storage.getProgress().learnedChars.length;

    // 检查关卡完成
    const completedLevels = Levels.checkLevelUp(oldCount, newCount, 'char');
    if (completedLevels.length > 0) {
      this.closeModal('learnModal');
      completedLevels.forEach(level => {
        setTimeout(() => Levels.showLevelComplete(level, 'char'), 500);
      });
    } else {
      // 正常鼓励
      this.combo++;
      this.updateCombo();
      Speech.playCorrect(this.combo);

      if (window.Pet) Pet.celebrate();
      this.showStarAnimation();

      const newBadges = Rewards.checkAndAward('char_learned');
      newBadges.forEach(b => Rewards.showBadgeNotification(b));
    }

    const card = document.querySelector(`.card[data-id="${charId}"]`);
    if (card) card.classList.add('learned');
  },

  showStarAnimation() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.innerHTML = '⭐';
        star.style.cssText = `
          position: fixed;
          left: ${50 + Math.random() * 20}%;
          top: 50%;
          font-size: 30px;
          pointer-events: none;
          z-index: 999;
          animation: starBurst 1s ease forwards;
        `;
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1000);
      }, i * 100);
    }
  },

  updateCombo() {
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
      localStorage.setItem('kidslearn_max_combo', this.maxCombo);
    }

    const display = document.getElementById('comboDisplay');
    const count = document.getElementById('comboCount');
    if (display && count && this.combo >= 2) {
      display.style.display = 'block';
      count.textContent = this.combo;
    }
  },

  resetCombo() {
    this.combo = 0;
    const display = document.getElementById('comboDisplay');
    if (display) display.style.display = 'none';
  },

  showComboInfo() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
    modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 20px; text-align: center; max-width: 90%;">
        <div style="font-size: 60px;">🔥</div>
        <h3 style="font-size: 24px; margin: 15px 0;">连击系统</h3>
        <p style="color: var(--text-light); margin-bottom: 15px;">连续答对可以获得额外奖励！</p>
        <div style="text-align: left; background: #f5f5f5; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
          <p>🔥 3连击: +2 星星</p>
          <p>🔥 5连击: +5 星星</p>
          <p>🔥 10连击: +10 星星</p>
        </div>
        <p style="font-size: 20px;">最高连击: <strong style="color: var(--danger);">${this.maxCombo}</strong></p>
        <button class="btn btn-primary" style="margin-top: 20px;" onclick="this.parentElement.parentElement.remove()">知道了</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  setupNumberEvents() {
    this.renderNumGrid();

    document.getElementById('numLearnMode').addEventListener('click', () => {
      this.currentView = 'learn';
    });

    document.getElementById('numGameMode').addEventListener('click', () => {
      this.startGame('listen-number');
    });
  },

  renderNumGrid() {
    const grid = document.getElementById('numGrid');
    const progress = Storage.getProgress();

    grid.innerHTML = AppData.numbers.map(num => `
      <div class="card ${progress.learnedNumbers.includes(num.id) ? 'learned' : ''}"
           data-id="${num.id}"
           onclick="App.showNumDetail(${num.id})">
        <div class="card-char">${num.chinese}</div>
        <div class="card-pinyin">${num.pinyin}</div>
        <div class="card-image">${num.image}</div>
        <div style="font-size: 24px; font-weight: 600; margin-top: 5px;">${num.number}</div>
      </div>
    `).join('');
  },

  showNumDetail(numId) {
    const num = AppData.numbers.find(n => n.id === numId);
    if (!num) return;

    const modal = document.getElementById('numModal');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';

    modal.innerHTML = `
      <div class="learn-card animate-zoom-in" style="position: relative; max-width: 90%;">
        <button onclick="App.closeModal('numModal')" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 24px; cursor: pointer;">✕</button>
        <div style="font-size: 80px; margin-bottom: 20px;">${num.image}</div>
        <div class="char-display" onclick="Speech.speak('${num.chinese}')">${num.chinese}</div>
        <div class="pinyin-display">${num.pinyin}</div>
        <div style="font-size: 48px; font-weight: 700; color: var(--secondary);">${num.number}</div>
        <div style="margin-top: 30px;">
          <button class="btn btn-primary" onclick="App.markNumLearned(${num.id})">我学会了 ⭐</button>
        </div>
      </div>
    `;

    Speech.speak(num.chinese);
  },

  markNumLearned(numId) {
    const oldCount = Storage.getProgress().learnedNumbers.length;
    Storage.markNumberLearned(numId);
    Storage.addStars(3);
    this.updateStats();

    const newCount = Storage.getProgress().learnedNumbers.length;

    const completedLevels = Levels.checkLevelUp(oldCount, newCount, 'num');
    if (completedLevels.length > 0) {
      this.closeModal('numModal');
      completedLevels.forEach(level => {
        setTimeout(() => Levels.showLevelComplete(level, 'num'), 500);
      });
    } else {
      this.combo++;
      this.updateCombo();
      Speech.playCorrect(this.combo);
      if (window.Pet) Pet.celebrate();
      this.showStarAnimation();

      const newBadges = Rewards.checkAndAward('number_learned');
      newBadges.forEach(b => Rewards.showBadgeNotification(b));
    }

    const card = document.querySelector(`.card[data-id="${numId}"]`);
    if (card) card.classList.add('learned');
  },

  setupGameEvents() {
    document.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = 'var(--shadow-lg)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  },

  startGame(gameType) {
    this.resetCombo();

    const area = document.getElementById('gameArea');
    if (!area) {
      this.navigateTo('games');
      setTimeout(() => this.startGame(gameType), 100);
      return;
    }

    area.innerHTML = '';

    switch (gameType) {
      case 'trace':
        TracingGame.init(area);
        break;
      case 'match':
        MatchingGame.init(area);
        break;
      case 'drag':
        DragGame.init(area);
        break;
      case 'listen':
        ListenGame.init(area, 'char');
        break;
      case 'listen-number':
        ListenGame.init(area, 'number');
        break;
    }

    area.scrollIntoView({ behavior: 'smooth' });
  },

  startTraceForChar(charId) {
    this.closeModal('learnModal');
    this.navigateTo('games');

    setTimeout(() => {
      const area = document.getElementById('gameArea');
      TracingGame.init(area);
      const char = AppData.characters.find(c => c.id === charId);
      if (char) {
        TracingGame.currentChar = char;
        document.getElementById('referenceChar').textContent = char.char;
      }
    }, 100);
  },

  startQuickLearn(type) {
    if (type === 'char') {
      this.navigateTo('characters');
      const progress = Storage.getProgress();
      const unlearned = AppData.characters.filter(c => !progress.learnedChars.includes(c.id));
      if (unlearned.length > 0) {
        const char = unlearned[Math.floor(Math.random() * unlearned.length)];
        setTimeout(() => this.showCharDetail(char.id), 100);
      }
    } else {
      this.navigateTo('numbers');
      const progress = Storage.getProgress();
      const unlearned = AppData.numbers.filter(n => !progress.learnedNumbers.includes(n.id));
      if (unlearned.length > 0) {
        const num = unlearned[Math.floor(Math.random() * unlearned.length)];
        setTimeout(() => this.showNumDetail(num.id), 100);
      }
    }
  },

  updateStats() {
    const stats = Storage.getStats();
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 3) {
      statValues[0].textContent = this.maxCombo;
      statValues[1].textContent = stats.stars;
      statValues[2].textContent = stats.badges;
    }
  }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载最大连击
  App.maxCombo = parseInt(localStorage.getItem('kidslearn_max_combo') || '0');
  App.init();
});