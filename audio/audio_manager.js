/**
 * Crônica de Aethelgard - Síntese Procedural de Áudio e Música de Ambientação (audio_manager.js)
 * Gera efeitos sonoros medievais e trilhas sonoras ambientes por região via Web Audio API (100% offline).
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicMuted = false;
    this.currentMusicTimer = null;
    this.currentRegionType = null;
    this.activeNodes = [];
  }

  init() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        console.log("[AudioManager] Web Audio API inicializada com sucesso.");
      }
    } catch (e) {
      console.warn("[AudioManager] Web Audio API não suportada pelo navegador.");
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopMusic();
    } else {
      this.playRegionalMusic(this.currentRegionType || "cidade");
    }
    if (window.ui) {
      window.ui.showToast(`Áudio Geral: ${this.muted ? 'Mutado' : 'Ativado'}`, "info");
    }
    return this.muted;
  }

  toggleMusicMute() {
    this.musicMuted = !this.musicMuted;
    if (this.musicMuted || this.muted) {
      this.stopMusic();
    } else {
      this.playRegionalMusic(this.currentRegionType || "cidade");
    }
    if (window.ui) {
      window.ui.showToast(`Música de Fundo: ${this.musicMuted ? 'Mutada' : 'Ativada'}`, "info");
    }
    return this.musicMuted;
  }

  play(soundName) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    switch (soundName) {
      case "click":
      case "menu_open":
        this.playTone(550, 0.04, "sine", 0.06);
        setTimeout(() => this.playTone(720, 0.05, "triangle", 0.04), 20);
        break;
      case "hover":
      case "choice_hover":
        this.playTone(400, 0.03, "sine", 0.02);
        break;
      case "page_turn":
        this.playNoiseSlide(0.12, 1800, 400, 0.04);
        break;
      case "travel":
        this.playSlide(180, 420, 0.35, "sine", 0.12);
        break;
      case "sword_clash":
        this.playNoiseAndTone(0.14, 1400, 450, "sawtooth", 0.15);
        break;
      case "spell_cast":
        this.playSlide(350, 1200, 0.45, "triangle", 0.18);
        setTimeout(() => this.playTone(1400, 0.3, "sine", 0.1), 150);
        break;
      case "dragon_roar":
        this.playDragonRoar();
        break;
      case "levelup":
      case "quest_done":
        this.playFanfare();
        break;
      case "gold":
        this.playTone(1350, 0.07, "sine", 0.12);
        setTimeout(() => this.playTone(1650, 0.09, "sine", 0.12), 70);
        break;
      case "potion":
      case "inventory_equip":
        this.playSlide(280, 750, 0.22, "sine", 0.12);
        break;
      case "overload":
      case "error":
        this.playSlide(280, 80, 0.3, "sawtooth", 0.15);
        break;
      case "victory":
        this.playVictoryChord();
        break;
      case "defeat":
        this.playDefeatChord();
        break;
      case "dramatic_chord":
      case "combat_start":
        this.playTone(130, 1.4, "sawtooth", 0.22);
        this.playTone(195, 1.4, "sawtooth", 0.22);
        this.playTone(65, 1.6, "sawtooth", 0.28);
        break;
      case "save_game":
        this.playTone(520, 0.1, "sine", 0.1);
        setTimeout(() => this.playTone(660, 0.15, "triangle", 0.1), 90);
        break;
      default:
        this.playTone(440, 0.08, "sine", 0.08);
    }
  }

  playTone(freq, duration, type = "sine", vol = 0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playSlide(startFreq, endFreq, duration, type = "sine", vol = 0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playNoiseSlide(duration, startFreq, endFreq, vol = 0.05) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + duration);
  }

  playNoiseAndTone(duration, filterFreq, toneFreq, type, vol = 0.15) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = toneFreq;

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playDragonRoar() {
    if (!this.ctx) return;
    const duration = 0.9;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(55, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playFanfare() {
    if (!this.ctx) return;
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.35, "triangle", 0.15);
      }, idx * 110);
    });
  }

  playVictoryChord() {
    if (!this.ctx) return;
    const notes = [392.00, 493.88, 587.33, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.65, "sine", 0.18);
      }, idx * 130);
    });
  }

  playDefeatChord() {
    if (!this.ctx) return;
    const notes = [220.00, 196.00, 174.61, 146.83];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.7, "sawtooth", 0.15);
      }, idx * 140);
    });
  }

  /* --- MOTOR DE TRILHA SONORA AMBIENTE POR REGIÃO --- */
  stopMusic() {
    if (this.currentMusicTimer) {
      clearInterval(this.currentMusicTimer);
      this.currentMusicTimer = null;
    }
    this.activeNodes.forEach(n => {
      try { n.stop(); n.disconnect(); } catch (e) {}
    });
    this.activeNodes = [];
  }

  playRegionalMusic(regionType) {
    if (this.muted || this.musicMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Se já está tocando para esta região, não reiniciar
    if (this.currentMusicTimer && this.currentRegionType === regionType) return;

    this.stopMusic();
    this.currentRegionType = regionType;
    console.log(`[AudioManager] Iniciando trilha sonora ambiente para: ${regionType}`);

    // Definir acordes/escalas por região
    let chordPool = [130.81, 164.81, 196.00]; // Dó Menor padrão
    let intervalMs = 6000;
    let waveform = "sine";
    let vol = 0.035;

    if (regionType === "title" || regionType === "castelo" || regionType === "cidade") {
      chordPool = [146.83, 220.00, 261.63, 329.63]; // Ré Menor solene medieval
      intervalMs = 5000;
      waveform = "triangle";
      vol = 0.04;
    } else if (regionType === "floresta" || regionType === "templo") {
      chordPool = [174.61, 220.00, 261.63, 349.23]; // Fá Lídio místico
      intervalMs = 4500;
      waveform = "sine";
      vol = 0.035;
    } else if (regionType === "ruinas" || regionType === "caverna" || regionType === "pantano") {
      chordPool = [110.00, 130.81, 155.56, 196.00]; // Lá Menor abissal
      intervalMs = 7000;
      waveform = "sawtooth";
      vol = 0.025;
    } else if (regionType === "combate" || regionType === "chefe") {
      chordPool = [130.81, 138.59, 164.81, 196.00]; // Tensão marcial
      intervalMs = 2800;
      waveform = "sawtooth";
      vol = 0.05;
    }

    const playAmbientDrone = () => {
      if (this.muted || this.musicMuted || !this.ctx) return;
      const freq = chordPool[Math.floor(Math.random() * chordPool.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = waveform;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 1.5);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + (intervalMs / 1000) - 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + (intervalMs / 1000));
    };

    playAmbientDrone();
    this.currentMusicTimer = setInterval(playAmbientDrone, intervalMs);
  }
}

window.audioManager = new AudioManager();
