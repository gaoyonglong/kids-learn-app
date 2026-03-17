// 数学运算模块 - 20以内加减法
const MathGame = {
  currentProblem: null,
  score: 0,
  streak: 0,
  maxStreak: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  mode: 'mixed', // 'add', 'subtract', 'mixed'
  maxNumber: 20,

  init(container, mode = 'mixed', maxNumber = 20) {
    this.container = container;
    this.mode = mode;
    this.maxNumber = maxNumber;
    this.score = 0;
    this.streak = 0;
    this.totalQuestions = 0;
    this.correctAnswers = 0;
    this.render();
    this.generateProblem();
  },

  render() {
    this.container.innerHTML = `
      <div class="math-game" style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 30px; border-radius: 20px; margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; gap: 20px; align-items: center;">
            <span style="font-size: 20px;">⭐ 得分: <strong id="mathScore">0</strong></span>
            <span style="font-size: 20px;">🔥 连击: <strong id="mathStreak">0</strong></span>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm" onclick="MathGame.changeMode('add')">➕ 加法</button>
            <button class="btn btn-secondary btn-sm" onclick="MathGame.changeMode('subtract')">➖ 减法</button>
            <button class="btn btn-secondary btn-sm active" id="mixedBtn" onclick="MathGame.changeMode('mixed')">🎲 混合</button>
          </div>
        </div>

        <div id="problemArea" style="background: white; padding: 40px; border-radius: 20px; text-align: center; margin-bottom: 20px; min-height: 150px;">
          <!-- 题目显示区域 -->
        </div>

        <div id="optionsArea" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
          <!-- 选项按钮区域 -->
        </div>

        <div id="feedbackArea" style="text-align: center; margin-top: 20px; min-height: 30px;">
          <!-- 反馈区域 -->
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <button class="btn btn-primary" onclick="MathGame.showStats()">📊 查看统计</button>
        </div>
      </div>
    `;
    this.updateButtons();
  },

  changeMode(mode) {
    this.mode = mode;
    this.updateButtons();
    this.generateProblem();
  },

  updateButtons() {
    const buttons = this.container.querySelectorAll('.btn-secondary');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (this.mode === 'add') {
      this.container.querySelector('button[onclick*="\'add\'"]')?.classList.add('active');
    } else if (this.mode === 'subtract') {
      this.container.querySelector('button[onclick*="\'subtract\'"]')?.classList.add('active');
    } else {
      this.container.querySelector('button[onclick*="\'mixed\'"]')?.classList.add('active');
    }
  },

  generateProblem() {
    const problemArea = document.getElementById('problemArea');
    const optionsArea = document.getElementById('optionsArea');
    const feedbackArea = document.getElementById('feedbackArea');

    feedbackArea.innerHTML = '';

    // 根据模式生成题目
    let operation = this.mode;
    if (this.mode === 'mixed') {
      operation = Math.random() < 0.5 ? 'add' : 'subtract';
    }

    let num1, num2, answer;

    if (operation === 'add') {
      // 加法：结果不超过maxNumber
      num1 = Math.floor(Math.random() * (this.maxNumber - 1)) + 1;
      num2 = Math.floor(Math.random() * (this.maxNumber - num1)) + 1;
      answer = num1 + num2;
    } else {
      // 减法：被减数不超过maxNumber，结果不为负
      num1 = Math.floor(Math.random() * this.maxNumber) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      if (num2 > num1) num2 = num1;
      answer = num1 - num2;
    }

    this.currentProblem = {
      num1,
      num2,
      operation,
      answer
    };

    // 显示题目
    const symbol = operation === 'add' ? '+' : '-';
    problemArea.innerHTML = `
      <div style="font-size: 64px; font-weight: 700; color: var(--primary); font-family: 'Courier New', monospace;">
        ${num1} ${symbol} ${num2} = ?
      </div>
    `;

    // 生成选项（包含正确答案和3个干扰项）
    const options = this.generateOptions(answer);

    optionsArea.innerHTML = options.map(opt => `
      <button class="btn btn-lg" style="font-size: 32px; padding: 20px; min-height: 80px;"
              onclick="MathGame.checkAnswer(${opt})">
        ${opt}
      </button>
    `).join('');
  },

  generateOptions(correctAnswer) {
    const options = [correctAnswer];

    // 生成3个干扰项
    while (options.length < 4) {
      let wrong;
      // 干扰项策略：接近正确答案的数
      const strategy = Math.floor(Math.random() * 3);

      if (strategy === 0) {
        // 加减1-2
        wrong = correctAnswer + Math.floor(Math.random() * 5) - 2;
      } else if (strategy === 1) {
        // 随机在0-maxNumber之间
        wrong = Math.floor(Math.random() * (this.maxNumber + 1));
      } else {
        // 另一个接近的数
        wrong = Math.abs(correctAnswer - Math.floor(Math.random() * 5) + 2);
      }

      // 确保干扰项有效且不重复
      if (wrong >= 0 && wrong <= this.maxNumber && !options.includes(wrong)) {
        options.push(wrong);
      }
    }

    // 打乱顺序
    return options.sort(() => Math.random() - 0.5);
  },

  checkAnswer(selected) {
    const feedbackArea = document.getElementById('feedbackArea');
    this.totalQuestions++;

    if (selected === this.currentProblem.answer) {
      // 正确
      this.correctAnswers++;
      this.streak++;
      if (this.streak > this.maxStreak) {
        this.maxStreak = this.streak;
      }

      // 计算得分（连击加成）
      const baseScore = 10;
      const streakBonus = Math.min(this.streak - 1, 5) * 2;
      const earned = baseScore + streakBonus;
      this.score += earned;

      feedbackArea.innerHTML = `
        <div style="color: var(--success); font-size: 24px; animation: bounce 0.5s ease;">
          ✅ 正确！+${earned}分 ${this.streak >= 3 ? '🔥' + this.streak + '连击！' : ''}
        </div>
      `;

      // 播放正确音效
      if (window.Speech) {
        Speech.playCorrect(this.streak);
      }

      // 宠物庆祝
      if (window.Pet) {
        Pet.celebrate();
      }

      this.updateScore();

      // 延迟后生成下一题
      setTimeout(() => this.generateProblem(), 800);
    } else {
      // 错误
      this.streak = 0;
      feedbackArea.innerHTML = `
        <div style="color: var(--danger); font-size: 24px;">
          ❌ 再想想！正确答案是 <strong>${this.currentProblem.answer}</strong>
        </div>
      `;

      this.updateScore();

      // 高亮正确答案
      const buttons = document.querySelectorAll('#optionsArea .btn');
      buttons.forEach(btn => {
        if (btn.textContent.trim() == this.currentProblem.answer) {
          btn.style.background = 'var(--success)';
          btn.style.color = 'white';
        }
        btn.disabled = true;
      });

      // 延迟后生成下一题
      setTimeout(() => this.generateProblem(), 1500);
    }
  },

  updateScore() {
    const scoreEl = document.getElementById('mathScore');
    const streakEl = document.getElementById('mathStreak');
    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = this.streak;
  },

  showStats() {
    const accuracy = this.totalQuestions > 0
      ? Math.round(this.correctAnswers / this.totalQuestions * 100)
      : 0;

    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
    modal.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 90%; min-width: 300px;">
        <h2 style="font-size: 28px; margin-bottom: 20px;">📊 数学练习统计</h2>
        <div style="display: grid; gap: 15px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; padding: 15px; background: #f5f5f5; border-radius: 10px;">
            <span>总题数</span>
            <strong>${this.totalQuestions}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 15px; background: #e8f5e9; border-radius: 10px;">
            <span>正确数</span>
            <strong style="color: var(--success);">${this.correctAnswers}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 15px; background: #fff9e6; border-radius: 10px;">
            <span>正确率</span>
            <strong style="color: var(--warning);">${accuracy}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 15px; background: #fce4ec; border-radius: 10px;">
            <span>最高连击</span>
            <strong style="color: var(--danger);">🔥 ${this.maxStreak}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 15px; background: #e3f2fd; border-radius: 10px;">
            <span>当前得分</span>
            <strong style="color: var(--primary);">⭐ ${this.score}</strong>
          </div>
        </div>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">继续练习</button>
          <button class="btn btn-secondary" onclick="MathGame.resetGame(); this.parentElement.parentElement.parentElement.remove();">重新开始</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  resetGame() {
    this.score = 0;
    this.streak = 0;
    this.totalQuestions = 0;
    this.correctAnswers = 0;
    this.updateScore();
    this.generateProblem();
  },

  // 获取数学进度（用于关卡系统）
  getProgress() {
    return {
      score: this.score,
      streak: this.maxStreak,
      totalQuestions: this.totalQuestions,
      correctAnswers: this.correctAnswers,
      accuracy: this.totalQuestions > 0
        ? Math.round(this.correctAnswers / this.totalQuestions * 100)
        : 0
    };
  }
};

window.MathGame = MathGame;