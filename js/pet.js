// 宠物伙伴系统
const Pet = {
  // 宠物列表
  pets: [
    { id: 1, name: '小猫咪', emoji: '🐱', unlockStars: 0, desc: '可爱的小猫咪，一直陪着你' },
    { id: 2, name: '小狗', emoji: '🐶', unlockStars: 30, desc: '忠诚的小狗，喜欢学习' },
    { id: 3, name: '小兔子', emoji: '🐰', unlockStars: 60, desc: '蹦蹦跳跳的小兔子' },
    { id: 4, name: '小熊猫', emoji: '🐼', unlockStars: 100, desc: '憨态可掬的熊猫' },
    { id: 5, name: '小狐狸', emoji: '🦊', unlockStars: 150, desc: '聪明的小狐狸' },
    { id: 6, name: '小企鹅', emoji: '🐧', unlockStars: 200, desc: '来自南极的小企鹅' },
    { id: 7, name: '小独角兽', emoji: '🦄', unlockStars: 300, desc: '神奇的独角兽' },
    { id: 8, name: '小恐龙', emoji: '🦖', unlockStars: 500, desc: '来自远古的小恐龙' }
  ],

  // 宠物表情状态
  expressions: {
    happy: ['😊', '😄', '🥰'],
    thinking: ['🤔', '😐'],
    celebrate: ['🎉', '✨', '🌟'],
    sleep: ['😴', '💤']
  },

  currentPet: null,
  petElement: null,

  init() {
    this.loadPet();
    this.createPetElement();
  },

  loadPet() {
    const saved = localStorage.getItem('kidslearn_current_pet');
    if (saved) {
      this.currentPet = JSON.parse(saved);
    } else {
      this.currentPet = this.pets[0]; // 默认小猫
      this.savePet();
    }
  },

  savePet() {
    localStorage.setItem('kidslearn_current_pet', JSON.stringify(this.currentPet));
  },

  createPetElement() {
    this.petElement = document.createElement('div');
    this.petElement.id = 'petBuddy';
    this.petElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 50px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      cursor: pointer;
      z-index: 100;
      transition: all 0.3s ease;
    `;
    this.petElement.innerHTML = this.currentPet.emoji;

    // 点击互动
    this.petElement.addEventListener('click', () => this.interact());

    // 添加动画
    this.petElement.style.animation = 'float 3s ease-in-out infinite';

    document.body.appendChild(this.petElement);
  },

  // 宠物互动
  interact() {
    const phrases = [
      '今天要学几个字呢？',
      '加油！你是最棒的！',
      '我看好你哦！',
      '我们一起学习吧！',
      '你今天进步很大！'
    ];

    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    // 显示对话气泡
    this.showBubble(phrase);

    // 播放语音
    Speech.speak(phrase, 1.0, 1.2);

    // 动画效果
    this.petElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
      this.petElement.style.transform = '';
    }, 300);
  },

  // 显示对话气泡
  showBubble(text) {
    const bubble = document.createElement('div');
    bubble.className = 'pet-bubble';
    bubble.style.cssText = `
      position: fixed;
      bottom: 110px;
      right: 20px;
      background: white;
      padding: 15px 20px;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      font-size: 16px;
      max-width: 200px;
      animation: fadeInUp 0.3s ease;
      z-index: 101;
    `;
    bubble.innerHTML = `<span style="font-size: 20px; margin-right: 8px;">${this.currentPet.emoji}</span>${text}`;

    document.body.appendChild(bubble);

    setTimeout(() => {
      bubble.style.opacity = '0';
      setTimeout(() => bubble.remove(), 300);
    }, 3000);
  },

  // 庆祝动画
  celebrate() {
    const celebEmojis = ['🎉', '✨', '🌟', '⭐', '🎊'];

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const emoji = document.createElement('div');
        emoji.style.cssText = `
          position: fixed;
          bottom: ${60 + Math.random() * 40}px;
          right: ${Math.random() * 100}px;
          font-size: ${20 + Math.random() * 20}px;
          pointer-events: none;
          z-index: 99;
          animation: floatUp 1s ease forwards;
        `;
        emoji.textContent = celebEmojis[Math.floor(Math.random() * celebEmojis.length)];
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 1000);
      }, i * 100);
    }
  },

  // 更换宠物
  changePet(petId) {
    const pet = this.pets.find(p => p.id === petId);
    if (pet && this.canUnlock(pet)) {
      this.currentPet = pet;
      this.savePet();
      if (this.petElement) {
        this.petElement.innerHTML = pet.emoji;
      }
      this.celebrate();
      Speech.playLevelUp();
      return true;
    }
    return false;
  },

  // 检查是否可以解锁
  canUnlock(pet) {
    const stars = Storage.getStars();
    return stars >= pet.unlockStars;
  },

  // 获取可解锁的宠物列表
  getUnlockedPets() {
    const stars = Storage.getStars();
    return this.pets.map(pet => ({
      ...pet,
      unlocked: stars >= pet.unlockStars,
      current: this.currentPet.id === pet.id
    }));
  },

  // 显示宠物选择面板
  showPetPanel() {
    const panel = document.createElement('div');
    panel.className = 'pet-panel-overlay';
    panel.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    const pets = this.getUnlockedPets();
    panel.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 20px; max-width: 90%; max-height: 80%; overflow-y: auto;">
        <h2 style="text-align: center; margin-bottom: 20px;">🐾 选择宠物伙伴</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px;">
          ${pets.map(pet => `
            <div class="pet-card ${pet.unlocked ? '' : 'locked'}" data-id="${pet.id}"
                 style="text-align: center; padding: 20px; border-radius: 15px; cursor: ${pet.unlocked ? 'pointer' : 'not-allowed'};
                        background: ${pet.current ? 'linear-gradient(135deg, #fff9e6, #fff5cc)' : '#f5f5f5'};
                        opacity: ${pet.unlocked ? 1 : 0.5};
                        border: 3px solid ${pet.current ? 'var(--warning)' : 'transparent'};">
              <div style="font-size: 48px;">${pet.emoji}</div>
              <div style="font-size: 14px; font-weight: 600; margin-top: 8px;">${pet.name}</div>
              ${!pet.unlocked ? `<div style="font-size: 12px; color: #999;">需要 ${pet.unlockStars} ⭐</div>` : ''}
              ${pet.current ? '<div style="font-size: 12px; color: var(--success);">使用中</div>' : ''}
            </div>
          `).join('')}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px; width: 100%;"
                class="btn btn-secondary">关闭</button>
      </div>
    `;

    // 绑定点击事件
    panel.querySelectorAll('.pet-card.unlocked, .pet-card:not(.locked)').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        if (this.changePet(id)) {
          panel.remove();
        }
      });
    });

    document.body.appendChild(panel);
  }
};

window.Pet = Pet;