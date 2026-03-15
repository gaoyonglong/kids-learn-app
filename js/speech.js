// 语音朗读模块 - 优化版
const Speech = {
  synth: window.speechSynthesis,
  voice: null,
  isSupported: 'speechSynthesis' in window,
  audioContext: null,

  // 音效缓存
  sounds: {
    correct: null,
    wrong: null,
    star: null,
    levelUp: null,
    combo: null
  },

  init() {
    if (!this.isSupported) {
      console.warn('当前浏览器不支持语音合成');
      return;
    }

    // 初始化音频上下文
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // 生成音效
    this.generateSounds();

    // 等待语音列表加载
    const setChineseVoice = () => {
      const voices = this.synth.getVoices();
      // 优先选择更自然的中文语音
      this.voice = voices.find(v => v.lang.includes('zh-CN') && v.name.includes('Google')) ||
                   voices.find(v => v.lang.includes('zh-CN') && v.name.includes('Microsoft')) ||
                   voices.find(v => v.lang.includes('zh-CN')) ||
                   voices.find(v => v.lang.includes('zh')) ||
                   voices[0];
    };

    if (this.synth.getVoices().length > 0) {
      setChineseVoice();
    } else {
      this.synth.onvoiceschanged = setChineseVoice;
    }
  },

  // 生成合成音效
  generateSounds() {
    // 正确音效 - 上升的愉悦音调
    this.sounds.correct = this.createTone([523, 659, 784], 0.15, 'sine');

    // 错误音效 - 低沉的提示音
    this.sounds.wrong = this.createTone([200, 180], 0.2, 'triangle');

    // 星星音效 - 闪烁效果
    this.sounds.star = this.createTone([880, 1047, 1319], 0.1, 'sine');

    // 升级音效 - 胜利号角
    this.sounds.levelUp = this.createTone([392, 494, 587, 784], 0.2, 'square');

    // 连击音效 - 快速上升
    this.sounds.combo = this.createTone([440, 554, 659, 880], 0.08, 'sine');
  },

  // 创建音调
  createTone(frequencies, duration, type = 'sine') {
    return () => {
      if (!this.audioContext) return;

      const now = this.audioContext.currentTime;
      frequencies.forEach((freq, i) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, now + i * duration);

        gainNode.gain.setValueAtTime(0.3, now + i * duration);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * duration + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(now + i * duration);
        oscillator.stop(now + i * duration + duration);
      });
    };
  },

  // 播放音效
  playSound(soundName) {
    if (this.sounds[soundName]) {
      // 恢复音频上下文（移动端需要用户交互后）
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      this.sounds[soundName]();
    }
  },

  speak(text, rate = 0.85, pitch = 1.1) {
    if (!this.isSupported) return Promise.resolve();

    return new Promise((resolve, reject) => {
      // 取消之前的语音
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate;      // 稍慢更清晰
      utterance.pitch = pitch;    // 略高音调更适合儿童
      utterance.volume = 1;

      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.onend = resolve;
      utterance.onerror = reject;

      this.synth.speak(utterance);
    });
  },

  // 朗读汉字 - 更有感情
  speakChar(char) {
    // 先播放轻快音效
    this.playSound('star');
    return this.speak(char, 0.8, 1.15);
  },

  // 朗读词语
  speakWord(word) {
    return this.speak(word, 0.85, 1.0);
  },

  // 朗读拼音
  speakPinyin(pinyin) {
    return this.speak(pinyin, 0.7, 1.2);
  },

  // 播放正确反馈 - 多样化鼓励
  playCorrect(combo = 0) {
    // 播放音效
    if (combo >= 3) {
      this.playSound('combo');
    } else {
      this.playSound('correct');
    }

    // 根据连击数选择不同的鼓励语
    const praises = {
      normal: ['真棒！', '太好了！', '很厉害！', '答对了！'],
      combo3: ['太厉害了！', '三连击！', '继续加油！'],
      combo5: ['超级棒！', '五连击！', '你是天才！'],
      combo10: ['无人能挡！', '十全十美！', '太神奇了！']
    };

    let text;
    if (combo >= 10) {
      text = praises.combo10[Math.floor(Math.random() * praises.combo10.length)];
    } else if (combo >= 5) {
      text = praises.combo5[Math.floor(Math.random() * praises.combo5.length)];
    } else if (combo >= 3) {
      text = praises.combo3[Math.floor(Math.random() * praises.combo3.length)];
    } else {
      text = praises.normal[Math.floor(Math.random() * praises.normal.length)];
    }

    return this.speak(text, 1.0, 1.3);
  },

  // 播放错误提示 - 温柔鼓励
  playWrong() {
    this.playSound('wrong');
    const encourages = ['再试试看', '加油哦', '没关系', '想一想'];
    const text = encourages[Math.floor(Math.random() * encourages.length)];
    return this.speak(text, 0.9, 1.0);
  },

  // 播放星星获得音效
  playStar() {
    this.playSound('star');
  },

  // 播放升级音效
  playLevelUp() {
    this.playSound('levelUp');
    return this.speak('升级啦！太棒了！', 1.0, 1.4);
  },

  // 停止朗读
  stop() {
    if (this.isSupported) {
      this.synth.cancel();
    }
  }
};

// 初始化
Speech.init();
window.Speech = Speech;