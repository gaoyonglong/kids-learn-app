// 关卡系统
const Levels = {
  // 关卡定义
  stages: [
    { id: 1, name: '启蒙入门', charCount: 10, reward: 50, icon: '🌱' },
    { id: 2, name: '初识汉字', charCount: 20, reward: 80, icon: '🌿' },
    { id: 3, name: '识字小兵', charCount: 35, reward: 120, icon: '🌳' },
    { id: 4, name: '识字达人', charCount: 50, reward: 150, icon: '⭐' },
    { id: 5, name: '识字能手', charCount: 70, reward: 200, icon: '🌟' },
    { id: 6, name: '识字高手', charCount: 85, reward: 250, icon: '✨' },
    { id: 7, name: '识字大师', charCount: 100, reward: 500, icon: '🏆' }
  ],

  // 数字关卡
  numStages: [
    { id: 1, name: '数一数', numCount: 5, reward: 30, icon: '1️⃣' },
    { id: 2, name: '认数字', numCount: 10, reward: 50, icon: '🔢' },
    { id: 3, name: '数数达人', numCount: 15, reward: 80, icon: '🎯' },
    { id: 4, name: '数字大师', numCount: 20, reward: 100, icon: '🏅' }
  ],

  // 获取当前关卡进度
  getCharProgress() {
    const progress = Storage.getProgress();
    const learned = progress.learnedChars.length;

    let currentStage = 1;
    let nextStage = null;
    let completedStages = 0;

    for (let i = 0; i < this.stages.length; i++) {
      if (learned >= this.stages[i].charCount) {
        completedStages = i + 1;
        currentStage = Math.min(i + 2, this.stages.length);
      }
    }

    if (currentStage <= this.stages.length) {
      nextStage = this.stages[currentStage - 1];
    }

    return {
      learned,
      currentStage,
      nextStage,
      completedStages,
      totalStages: this.stages.length,
      progress: nextStage ? (learned / nextStage.charCount * 100) : 100
    };
  },

  getNumProgress() {
    const progress = Storage.getProgress();
    const learned = progress.learnedNumbers.length;

    let currentStage = 1;
    let nextStage = null;
    let completedStages = 0;

    for (let i = 0; i < this.numStages.length; i++) {
      if (learned >= this.numStages[i].numCount) {
        completedStages = i + 1;
        currentStage = Math.min(i + 2, this.numStages.length);
      }
    }

    if (currentStage <= this.numStages.length) {
      nextStage = this.numStages[currentStage - 1];
    }

    return {
      learned,
      currentStage,
      nextStage,
      completedStages,
      totalStages: this.numStages.length,
      progress: nextStage ? (learned / nextStage.numCount * 100) : 100
    };
  },

  // 检查是否完成新关卡
  checkLevelUp(oldCount, newCount, type = 'char') {
    const stages = type === 'char' ? this.stages : this.numStages;
    const countKey = type === 'char' ? 'charCount' : 'numCount';

    const completedLevels = [];

    for (const stage of stages) {
      if (oldCount < stage[countKey] && newCount >= stage[countKey]) {
        completedLevels.push(stage);
      }
    }

    return completedLevels;
  },

  // 显示关卡完成动画
  showLevelComplete(stage, type = 'char') {
    const overlay = document.createElement('div');
    overlay.className = 'level-complete-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    `;

    overlay.innerHTML = `
      <div style="background: linear-gradient(135deg, #fff9e6, #fff5cc); padding: 50px; border-radius: 30px; text-align: center; animation: zoomIn 0.5s ease;">
        <div style="font-size: 80px; margin-bottom: 20px;">${stage.icon}</div>
        <h2 style="font-size: 32px; color: var(--primary); margin-bottom: 10px;">🎉 关卡完成！</h2>
        <div style="font-size: 24px; margin-bottom: 20px;">${stage.name}</div>
        <div style="font-size: 20px; color: var(--success); margin-bottom: 30px;">
          获得 ${stage.reward} ⭐ 奖励！
        </div>
        <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">太棒了！</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // 发放奖励
    Storage.addStars(stage.reward);
    Speech.playLevelUp();

    // 宠物庆祝
    if (window.Pet) {
      Pet.celebrate();
    }

    // 烟花效果
    this.createFireworks();
  },

  // 烟花效果
  createFireworks() {
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff9f43'];

    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const firework = document.createElement('div');
        firework.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          pointer-events: none;
          z-index: 999;
          animation: explode 1s ease forwards;
        `;
        document.body.appendChild(firework);
        setTimeout(() => firework.remove(), 1000);
      }, i * 50);
    }
  },

  // 获取关卡选择页面HTML
  renderStageSelect(type = 'char') {
    const stages = type === 'char' ? this.stages : this.numStages;
    const progress = type === 'char' ? this.getCharProgress() : this.getNumProgress();
    const countKey = type === 'char' ? 'charCount' : 'numCount';

    return `
      <div class="stages-container">
        <h3 style="font-size: 24px; margin-bottom: 20px;">🗺️ 学习关卡</h3>
        <div style="display: flex; flex-direction: column; gap: 15px;">
          ${stages.map((stage, idx) => {
            const isCompleted = progress.completedStages >= stage.id;
            const isCurrent = progress.currentStage === stage.id;
            const isLocked = stage.id > progress.currentStage;

            return `
              <div class="stage-card ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}"
                   style="display: flex; align-items: center; gap: 20px; padding: 20px; border-radius: 15px;
                          background: ${isCompleted ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' :
                                      isCurrent ? 'linear-gradient(135deg, #fff9e6, #fff5cc)' : '#f5f5f5'};
                          border: 3px solid ${isCurrent ? 'var(--primary)' : 'transparent'};
                          opacity: ${isLocked ? 0.6 : 1};
                          cursor: ${isLocked ? 'not-allowed' : 'pointer'};">
                <div style="font-size: 48px;">${isLocked ? '🔒' : stage.icon}</div>
                <div style="flex: 1;">
                  <div style="font-size: 18px; font-weight: 600;">${stage.name}</div>
                  <div style="font-size: 14px; color: var(--text-light);">
                    ${isCompleted ? '已完成 ✓' :
                      isCurrent ? `学习中 (${progress.learned}/${stage[countKey]})` :
                      `需要学会 ${stage[countKey]} 个${type === 'char' ? '字' : '数字'}`}
                  </div>
                  ${isCurrent ? `
                    <div class="progress-bar" style="margin-top: 10px; height: 8px;">
                      <div class="progress-fill" style="width: ${progress.progress}%"></div>
                    </div>
                  ` : ''}
                </div>
                <div style="font-size: 20px; color: var(--warning);">${stage.reward} ⭐</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
};

window.Levels = Levels;