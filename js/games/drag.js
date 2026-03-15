// 拖拽配对游戏
const DragGame = {
  container: null,
  items: [],
  slots: [],
  score: 0,
  completed: 0,

  init(container) {
    this.container = container;
    this.render();
    this.startGame();
  },

  render() {
    this.container.innerHTML = `
      <div class="drag-game">
        <div class="drag-header">
          <h2>拖拽配对 🎯</h2>
          <p>把汉字拖到正确的图片上</p>
          <div class="score-display">得分: <span id="dragScore">0</span></div>
        </div>
        <div class="drag-board" id="dragBoard">
          <div class="drag-items" id="dragItems"></div>
          <div class="drag-slots" id="dragSlots"></div>
        </div>
        <div class="drag-controls">
          <button class="btn btn-primary" id="restartDrag">重新开始</button>
        </div>
      </div>
    `;
    document.getElementById('restartDrag').addEventListener('click', () => this.startGame());
  },

  startGame() {
    const chars = AppData.getRandomChars(4);
    this.items = chars.map(c => ({
      char: c.char,
      image: c.image,
      id: c.id,
      matched: false
    }));
    this.score = 0;
    this.completed = 0;

    this.renderItems();
    document.getElementById('dragScore').textContent = '0';
  },

  renderItems() {
    const itemsContainer = document.getElementById('dragItems');
    const slotsContainer = document.getElementById('dragSlots');

    itemsContainer.innerHTML = '';
    slotsContainer.innerHTML = '';

    // 创建可拖拽的汉字（打乱顺序）
    const shuffledItems = this.shuffle([...this.items]);
    shuffledItems.forEach(item => {
      const el = document.createElement('div');
      el.className = 'drag-item';
      el.draggable = true;
      el.dataset.id = item.id;
      el.dataset.char = item.char;
      el.textContent = item.char;

      el.addEventListener('dragstart', (e) => this.onDragStart(e, item));
      el.addEventListener('dragend', (e) => this.onDragEnd(e));

      // 触控支持
      el.addEventListener('touchstart', (e) => this.onTouchStart(e, item));
      el.addEventListener('touchmove', (e) => this.onTouchMove(e));
      el.addEventListener('touchend', (e) => this.onTouchEnd(e));

      itemsContainer.appendChild(el);
    });

    // 创建放置槽（图片，打乱顺序）
    const shuffledSlots = this.shuffle([...this.items]);
    shuffledSlots.forEach(item => {
      const el = document.createElement('div');
      el.className = 'drag-slot';
      el.dataset.id = item.id;
      el.textContent = item.image;

      el.addEventListener('dragover', (e) => this.onDragOver(e));
      el.addEventListener('dragleave', (e) => this.onDragLeave(e));
      el.addEventListener('drop', (e) => this.onDrop(e, item));

      slotsContainer.appendChild(el);
    });
  },

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  // 拖拽事件处理
  onDragStart(e, item) {
    e.dataTransfer.setData('text/plain', item.id);
    e.target.classList.add('dragging');
    Speech.speakChar(item.char);
  },

  onDragEnd(e) {
    e.target.classList.remove('dragging');
  },

  onDragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
  },

  onDragLeave(e) {
    e.target.classList.remove('drag-over');
  },

  onDrop(e, slotItem) {
    e.preventDefault();
    e.target.classList.remove('drag-over');

    const draggedId = e.dataTransfer.getData('text/plain');
    const isMatch = draggedId === String(slotItem.id);

    if (isMatch) {
      this.handleMatch(draggedId, e.target);
    } else {
      this.handleMismatch(e.target);
    }
  },

  // 触控支持
  currentDragEl: null,
  currentDragItem: null,

  onTouchStart(e, item) {
    this.currentDragEl = e.target;
    this.currentDragItem = item;
    e.target.classList.add('dragging');
    Speech.speakChar(item.char);
  },

  onTouchMove(e) {
    e.preventDefault();
    if (!this.currentDragEl) return;

    const touch = e.touches[0];
    this.currentDragEl.style.position = 'fixed';
    this.currentDragEl.style.left = touch.clientX - 30 + 'px';
    this.currentDragEl.style.top = touch.clientY - 30 + 'px';
    this.currentDragEl.style.zIndex = '1000';
  },

  onTouchEnd(e) {
    if (!this.currentDragEl) return;

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    this.currentDragEl.style.position = '';
    this.currentDragEl.style.left = '';
    this.currentDragEl.style.top = '';
    this.currentDragEl.style.zIndex = '';
    this.currentDragEl.classList.remove('dragging');

    if (dropTarget && dropTarget.classList.contains('drag-slot')) {
      const slotId = dropTarget.dataset.id;
      if (this.currentDragItem.id === parseInt(slotId)) {
        this.handleMatch(this.currentDragItem.id, dropTarget);
      } else {
        this.handleMismatch(dropTarget);
      }
    }

    this.currentDragEl = null;
    this.currentDragItem = null;
  },

  handleMatch(itemId, slotEl) {
    const itemEl = document.querySelector(`.drag-item[data-id="${itemId}"]`);
    const slotId = slotEl.dataset.id;

    itemEl.classList.add('matched');
    itemEl.draggable = false;
    slotEl.classList.add('matched');

    // 显示汉字在槽中
    slotEl.innerHTML = `<span class="matched-char">${itemEl.textContent}</span>`;

    this.completed++;
    this.score += 15;
    document.getElementById('dragScore').textContent = this.score;

    Speech.playCorrect();

    if (this.completed === this.items.length) {
      setTimeout(() => this.gameComplete(), 500);
    }
  },

  handleMismatch(slotEl) {
    slotEl.classList.add('wrong');
    Speech.playWrong();
    setTimeout(() => slotEl.classList.remove('wrong'), 500);
  },

  gameComplete() {
    Storage.addStars(this.score);
    const newBadges = Rewards.checkAndAward('game_completed');
    newBadges.forEach(b => Rewards.showBadgeNotification(b));

    const overlay = document.createElement('div');
    overlay.className = 'result-overlay success';
    overlay.innerHTML = `
      <div class="result-content">
        <div class="big-emoji">🏆</div>
        <div class="result-text">太棒了！</div>
        <div class="result-score">得分: ${this.score}</div>
      </div>
    `;
    this.container.appendChild(overlay);

    this.createConfetti();
    Speech.playCorrect();

    setTimeout(() => overlay.remove(), 3000);
  },

  createConfetti() {
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.textContent = ['⭐', '🌟', '✨', '🎉'][Math.floor(Math.random() * 4)];
      this.container.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2000);
    }
  },

  destroy() {
    this.container.innerHTML = '';
  }
};

window.DragGame = DragGame;