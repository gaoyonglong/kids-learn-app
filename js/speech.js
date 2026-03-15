// 语音朗读模块 - 兼容移动端优化版
const Speech = {
  synth: window.speechSynthesis,
  voice: null,
  isSupported: 'speechSynthesis' in window,
  audioContext: null,
  isUnlocked: false,

  sounds: {},

  init() {
    // 初始化音频上下文
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext 不支持');
    }

    // 生成音效
    this.generateSounds();

    if (!this.isSupported) {
      console.warn('当前浏览器不支持语音合成');
      return;
    }

    // 设置中文语音
    const setChineseVoice = () => {
      const voices = this.synth.getVoices();
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

  // 解锁音频（移动端必须用户交互后调用）
  async unlock() {
    if (this.isUnlocked) return true;

    try {
      // 解锁 AudioContext
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // 播放一个静音音效来解锁
      if (this.audioContext) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0.01; // 几乎静音
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.001);
      }

      // 测试语音
      if (this.isSupported) {
        const test = new SpeechSynthesisUtterance('');
        test.volume = 0;
        this.synth.speak(test);
      }

      this.isUnlocked = true;
      console.log('音频已解锁');
      return true;
    } catch (e) {
      console.warn('音频解锁失败:', e);
      return false;
    }
  },

  generateSounds() {
    this.sounds.correct = () => this.playTone([523, 659, 784], 0.15);
    this.sounds.wrong = () => this.playTone([200, 180], 0.2);
    this.sounds.star = () => this.playTone([880, 1047, 1319], 0.1);
    this.sounds.levelUp = () => this.playTone([392, 494, 587, 784], 0.2);
    this.sounds.combo = () => this.playTone([440, 554, 659, 880], 0.08);
    this.sounds.click = () => this.playTone([600], 0.05);
  },

  playTone(frequencies, duration) {
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      frequencies.forEach((freq, i) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now + i * duration);

        gainNode.gain.setValueAtTime(0.3, now + i * duration);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * duration + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(now + i * duration);
        oscillator.stop(now + i * duration + duration);
      });
    } catch (e) {
      console.warn('播放音效失败:', e);
    }
  },

  playSound(name) {
    if (this.sounds[name]) {
      this.sounds[name]();
    }
  },

  async speak(text, rate = 0.85, pitch = 1.1) {
    // 先尝试解锁
    await this.unlock();

    if (!this.isSupported) {
      this.showSpeechTip();
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      try {
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = 1;

        if (this.voice) {
          utterance.voice = this.voice;
        }

        utterance.onend = resolve;
        utterance.onerror = () => {
          console.warn('语音播放失败');
          resolve();
        };

        this.synth.speak(utterance);
      } catch (e) {
        console.warn('语音合成错误:', e);
        resolve();
      }
    });
  },

  // 显示语音提示（当语音不可用时）
  showSpeechTip() {
    // 只显示一次
    if (sessionStorage.getItem('speech_tip_shown')) return;
    sessionStorage.setItem('speech_tip_shown', 'true');

    const tip = document.createElement('div');
    tip.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-size: 14px;
      z-index: 10000;
      animation: fadeInUp 0.3s ease;
    `;
    tip.innerHTML = '💡 当前浏览器可能不支持语音朗读';
    document.body.appendChild(tip);

    setTimeout(() => {
      tip.style.opacity = '0';
      setTimeout(() => tip.remove(), 300);
    }, 3000);
  },

  speakChar(char) {
    this.playSound('star');
    return this.speak(char, 0.8, 1.15);
  },

  speakWord(word) {
    return this.speak(word, 0.85, 1.0);
  },

  async playCorrect(combo = 0) {
    this.playSound(combo >= 3 ? 'combo' : 'correct');

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

  playWrong() {
    this.playSound('wrong');
    const encourages = ['再试试看', '加油哦', '没关系', '想一想'];
    const text = encourages[Math.floor(Math.random() * encourages.length)];
    return this.speak(text, 0.9, 1.0);
  },

  playStar() {
    this.playSound('star');
  },

  playLevelUp() {
    this.playSound('levelUp');
    return this.speak('升级啦！太棒了！', 1.0, 1.4);
  },

  stop() {
    if (this.isSupported) {
      this.synth.cancel();
    }
  }
};

// 初始化
Speech.init();
window.Speech = Speech;

// 全局点击解锁音频
document.addEventListener('click', () => Speech.unlock(), { once: true });
document.addEventListener('touchstart', () => Speech.unlock(), { once: true });