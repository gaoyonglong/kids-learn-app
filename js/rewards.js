// 奖励系统
const Rewards = {
  // 勋章定义
  badges: [
    { id: 'first_char', name: '识字启蒙', desc: '学会第一个汉字', icon: '🌱' },
    { id: 'char_10', name: '小小识字家', desc: '学会10个汉字', icon: '📖' },
    { id: 'char_50', name: '识字小能手', desc: '学会50个汉字', icon: '✨' },
    { id: 'char_100', name: '识字大师', desc: '学会100个汉字', icon: '🏆' },
    { id: 'first_number', name: '数字启蒙', desc: '学会第一个数字', icon: '🔢' },
    { id: 'number_10', name: '数数达人', desc: '学会10个数字', icon: '🎯' },
    { id: 'number_20', name: '数学小天才', desc: '学会20个数字', icon: '🌟' },
    { id: 'first_game', name: '游戏新手', desc: '完成第一个游戏', icon: '🎮' },
    { id: 'game_10', name: '游戏达人', desc: '完成10次游戏', icon: '🎲' },
    { id: 'star_50', name: '星星收集者', desc: '获得50颗星星', icon: '⭐' },
    { id: 'star_100', name: '星星大师', desc: '获得100颗星星', icon: '🌟' },
    { id: 'star_500', name: '闪耀之星', desc: '获得500颗星星', icon: '💫' },
    { id: 'perfect_trace', name: '描红小能手', desc: '描红游戏满分通关', icon: '✏️' },
    { id: 'perfect_match', name: '配对高手', desc: '连连看游戏满分通关', icon: '🔗' },
    { id: 'streak_3', name: '三连胜', desc: '连续答对3题', icon: '🔥' },
    { id: 'streak_5', name: '五连绝世', desc: '连续答对5题', icon: '💥' },
    { id: 'streak_10', name: '十全十美', desc: '连续答对10题', icon: '👑' }
  ],

  // 检查并授予勋章
  checkAndAward(event, data = {}) {
    const stats = Storage.getStats();
    const newBadges = [];

    // 根据事件类型检查勋章
    switch (event) {
      case 'char_learned':
        if (stats.learnedChars >= 1) newBadges.push('first_char');
        if (stats.learnedChars >= 10) newBadges.push('char_10');
        if (stats.learnedChars >= 50) newBadges.push('char_50');
        if (stats.learnedChars >= 100) newBadges.push('char_100');
        break;

      case 'number_learned':
        if (stats.learnedNumbers >= 1) newBadges.push('first_number');
        if (stats.learnedNumbers >= 10) newBadges.push('number_10');
        if (stats.learnedNumbers >= 20) newBadges.push('number_20');
        break;

      case 'game_completed':
        newBadges.push('first_game');
        break;

      case 'stars_earned':
        if (stats.stars >= 50) newBadges.push('star_50');
        if (stats.stars >= 100) newBadges.push('star_100');
        if (stats.stars >= 500) newBadges.push('star_500');
        break;

      case 'perfect_score':
        if (data.game === 'trace') newBadges.push('perfect_trace');
        if (data.game === 'match') newBadges.push('perfect_match');
        break;

      case 'streak':
        if (data.count >= 3) newBadges.push('streak_3');
        if (data.count >= 5) newBadges.push('streak_5');
        if (data.count >= 10) newBadges.push('streak_10');
        break;
    }

    // 授予新勋章
    const currentBadges = Storage.getBadges();
    const awarded = newBadges.filter(b => !currentBadges.includes(b));

    awarded.forEach(badgeId => Storage.addBadge(badgeId));

    return awarded.map(id => this.badges.find(b => b.id === id));
  },

  // 获取所有勋章
  getAllBadges() {
    const earned = Storage.getBadges();
    return this.badges.map(badge => ({
      ...badge,
      earned: earned.includes(badge.id)
    }));
  },

  // 显示勋章获得动画
  showBadgeNotification(badge) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
      <div class="badge-content">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-info">
          <div class="badge-title">获得新勋章！</div>
          <div class="badge-name">${badge.name}</div>
          <div class="badge-desc">${badge.desc}</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    // 播放动画
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

window.Rewards = Rewards;