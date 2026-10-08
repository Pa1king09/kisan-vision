// Ultra-soft Sci-Fi Sound Effects Engine using Browser Web Audio API
// 100% Client-side synthetic audio generation (0ms latency, zero external network assets required)

class SoundFXEngine {
  constructor() {
    this.ctx = null;
  }

  getAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Ultra-soft harmonic chime played when AI finishes calculating a recommendation or disease scan.
   * 3-note ascending ethereal harmonic chord (C5 -> E5 -> G5) with gentle sine roll-off.
   */
  playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0.00, duration: 0.4 }, // C5
        { freq: 659.25, time: 0.08, duration: 0.5 }, // E5
        { freq: 783.99, time: 0.16, duration: 0.7 }, // G5
        { freq: 1046.50, time: 0.24, duration: 0.8 }, // C6 high shimmer
      ];

      notes.forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        // Soft attack and exponential decay for organic bell tone
        gain.gain.setValueAtTime(0.0001, now + time);
        gain.gain.linearRampToValueAtTime(0.12, now + time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + duration + 0.05);
      });
    } catch (e) {
      console.warn('Audio FX could not play:', e);
    }
  }

  /**
   * Soft activation blip when voice assistant starts listening (Siri/Gemini style)
   */
  playVoiceStart() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  /**
   * Soft closing blip when voice assistant finishes capturing speech
   */
  playVoiceEnd() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.14);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }
}

export const soundFx = new SoundFXEngine();
export const playSuccessChime = () => soundFx.playSuccessChime();
export const playVoiceStart = () => soundFx.playVoiceStart();
export const playVoiceEnd = () => soundFx.playVoiceEnd();
