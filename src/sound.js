export class SoundManager {
  constructor() {
    this.sounds = {
      eat: null,
      gameOver: null,
      levelUp: null,
      powerUp: null,
      start: null,
      background: null
    };
    
    this.muted = localStorage.getItem('snakeMuted') === 'true';
    
    // Create audio context when user interacts with the page
    this.audioContext = null;
    this.backgroundMusic = null;
    
    // Initialize audio on first user interaction
    document.addEventListener('click', () => {
      if (!this.audioContext) {
        this.initAudio();
      }
    }, { once: true });
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create simple oscillator-based sounds
      this.createSounds();
    } catch (e) {
      console.error('Web Audio API is not supported in this browser');
    }
  }

  createSounds() {
    // We'll use simple oscillator patterns for our sounds
    // since we can't load external audio files in this environment
  }

  playSound(type, options = {}) {
    if (this.muted || !this.audioContext) return;
    
    const ctx = this.audioContext;
    const currentTime = ctx.currentTime;
    
    // Create oscillator and gain nodes
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Set default values
    let duration = options.duration || 0.1;
    let frequency = options.frequency || 440;
    let type = options.type || 'sine';
    let volume = options.volume || 0.5;
    
    // Configure oscillator
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, currentTime);
    
    if (options.frequencyEnd) {
      oscillator.frequency.exponentialRampToValueAtTime(
        options.frequencyEnd,
        currentTime + duration
      );
    }
    
    // Configure gain (volume)
    gainNode.gain.setValueAtTime(volume, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);
    
    // Start and stop
    oscillator.start(currentTime);
    oscillator.stop(currentTime + duration);
    
    return oscillator;
  }

  playEatSound() {
    this.playSound('eat', {
      frequency: 800,
      frequencyEnd: 1200,
      duration: 0.1,
      type: 'sine',
      volume: 0.3
    });
  }

  playGameOverSound() {
    // Play a descending tone
    this.playSound('gameOver', {
      frequency: 400,
      frequencyEnd: 100,
      duration: 0.5,
      type: 'sawtooth',
      volume: 0.5
    });
  }

  playLevelUpSound() {
    // Play an ascending pattern
    const baseTime = this.audioContext.currentTime;
    
    this.playSound('levelUp', {
      frequency: 400,
      frequencyEnd: 600,
      duration: 0.1,
      type: 'sine',
      volume: 0.3
    });
    
    setTimeout(() => {
      this.playSound('levelUp', {
        frequency: 600,
        frequencyEnd: 800,
        duration: 0.1,
        type: 'sine',
        volume: 0.3
      });
    }, 100);
    
    setTimeout(() => {
      this.playSound('levelUp', {
        frequency: 800,
        frequencyEnd: 1000,
        duration: 0.2,
        type: 'sine',
        volume: 0.4
      });
    }, 200);
  }

  playPowerUpSound() {
    this.playSound('powerUp', {
      frequency: 600,
      frequencyEnd: 1200,
      duration: 0.3,
      type: 'sine',
      volume: 0.4
    });
  }

  playStartSound() {
    // Play an ascending pattern
    this.playSound('start', {
      frequency: 300,
      frequencyEnd: 600,
      duration: 0.3,
      type: 'triangle',
      volume: 0.4
    });
  }

  playBackgroundMusic() {
    // We'll use a simple repeating pattern for background "music"
    if (this.muted || !this.audioContext || this.backgroundMusic) return;
    
    // This is a very simple background sound
    // In a real game, you'd use actual music files
    this.backgroundMusicLoop();
  }

  backgroundMusicLoop() {
    if (this.muted || !this.audioContext) return;
    
    // Very quiet background "music" using simple oscillators
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    // Very quiet
    gain.gain.setValueAtTime(0.05, now);
    
    // Simple pattern
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(330, now + 1);
    osc.frequency.setValueAtTime(220, now + 2);
    osc.frequency.setValueAtTime(440, now + 3);
    
    osc.start(now);
    osc.stop(now + 4);
    
    // Store reference to stop it later
    this.backgroundMusic = osc;
    
    // Loop
    osc.onended = () => {
      this.backgroundMusic = null;
      if (!this.muted) {
        this.backgroundMusicLoop();
      }
    };
  }

  pauseBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.onended = null;
      try {
        this.backgroundMusic.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      this.backgroundMusic = null;
    }
  }

  resumeBackgroundMusic() {
    if (!this.muted && !this.backgroundMusic) {
      this.backgroundMusicLoop();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('snakeMuted', this.muted);
    
    if (this.muted) {
      this.pauseBackgroundMusic();
    } else {
      this.resumeBackgroundMusic();
    }
    
    return this.muted;
  }
}
