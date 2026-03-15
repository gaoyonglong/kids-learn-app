// 本地存储模块
const Storage = {
  keys: {
    progress: 'kidslearn_progress',
    stars: 'kidslearn_stars',
    badges: 'kidslearn_badges',
    settings: 'kidslearn_settings'
  },

  // 获取学习进度
  getProgress() {
    const data = localStorage.getItem(this.keys.progress);
    return data ? JSON.parse(data) : {
      learnedChars: [],
      learnedNumbers: [],
      gameScores: {}
    };
  },

  // 保存学习进度
  saveProgress(progress) {
    localStorage.setItem(this.keys.progress, JSON.stringify(progress));
  },

  // 标记汉字已学习
  markCharLearned(charId) {
    const progress = this.getProgress();
    if (!progress.learnedChars.includes(charId)) {
      progress.learnedChars.push(charId);
      this.saveProgress(progress);
    }
  },

  // 标记数字已学习
  markNumberLearned(numId) {
    const progress = this.getProgress();
    if (!progress.learnedNumbers.includes(numId)) {
      progress.learnedNumbers.push(numId);
      this.saveProgress(progress);
    }
  },

  // 获取星星数量
  getStars() {
    const data = localStorage.getItem(this.keys.stars);
    return data ? parseInt(data, 10) : 0;
  },

  // 添加星星
  addStars(count = 1) {
    const current = this.getStars();
    localStorage.setItem(this.keys.stars, current + count);
    return current + count;
  },

  // 消耗星星
  spendStars(count) {
    const current = this.getStars();
    if (current >= count) {
      localStorage.setItem(this.keys.stars, current - count);
      return current - count;
    }
    return current;
  },

  // 获取勋章列表
  getBadges() {
    const data = localStorage.getItem(this.keys.badges);
    return data ? JSON.parse(data) : [];
  },

  // 添加勋章
  addBadge(badgeId) {
    const badges = this.getBadges();
    if (!badges.includes(badgeId)) {
      badges.push(badgeId);
      localStorage.setItem(this.keys.badges, JSON.stringify(badges));
    }
  },

  // 获取游戏最高分
  getGameScore(gameId) {
    const progress = this.getProgress();
    return progress.gameScores[gameId] || 0;
  },

  // 保存游戏分数
  saveGameScore(gameId, score) {
    const progress = this.getProgress();
    if (!progress.gameScores[gameId] || score > progress.gameScores[gameId]) {
      progress.gameScores[gameId] = score;
      this.saveProgress(progress);
    }
  },

  // 获取设置
  getSettings() {
    const data = localStorage.getItem(this.keys.settings);
    return data ? JSON.parse(data) : {
      soundEnabled: true,
      autoSpeak: true,
      difficulty: 'normal'
    };
  },

  // 保存设置
  saveSettings(settings) {
    localStorage.setItem(this.keys.settings, JSON.stringify(settings));
  },

  // 清除所有数据
  clearAll() {
    Object.values(this.keys).forEach(key => localStorage.removeItem(key));
  },

  // 获取统计信息
  getStats() {
    const progress = this.getProgress();
    return {
      totalChars: AppData.characters.length,
      learnedChars: progress.learnedChars.length,
      totalNumbers: AppData.numbers.length,
      learnedNumbers: progress.learnedNumbers.length,
      stars: this.getStars(),
      badges: this.getBadges().length
    };
  }
};

window.Storage = Storage;