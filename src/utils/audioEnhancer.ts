/**
 * Web Audio API — Voice Enhancer & Ambient Study Bed
 *
 * EQ chain tuned for Microsoft Azure Neural Nepali voices
 * (ne-NP-SagarNeural / ne-NP-HemkalaNeural) served as MP3.
 *
 * Neural voices are already warm and clear, so the chain is light:
 *   1. Low-shelf warmth  : +2.5 dB @ 220 Hz  — adds chest resonance without muddiness
 *   2. Presence boost    : +1.8 dB @ 1 200 Hz — lifts Nepali vowel clarity (अ/आ/इ)
 *   3. Metallic notch    : −3.0 dB @ 3 000 Hz — softens any residual digital buzz
 *   4. Air shelf         : −1.5 dB @ 7 000 Hz — tames mp3 compression harshness
 *   5. Dynamics compressor: gentle levelling, keeps narration consistent
 *
 * Soft ambient BGM bed (pure-tone chord, synthesised in-browser):
 *   F2 (87 Hz) + C3 (131 Hz) + A3 (220 Hz) → lowpass @ 300 Hz → barely audible pad
 *   Fades in when media plays, fades out on pause/end.
 */

class VoiceEnhancerEngine {
  private audioCtx: AudioContext | null = null;
  private connectedSources = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();

  // EQ nodes
  private warmthFilter:    BiquadFilterNode | null = null;
  private presenceFilter:  BiquadFilterNode | null = null;
  private notchFilter:     BiquadFilterNode | null = null;
  private airFilter:       BiquadFilterNode | null = null;
  private compressor:      DynamicsCompressorNode | null = null;
  private masterGain:      GainNode | null = null;

  // Ambient BGM nodes
  private bgmGain:         GainNode | null = null;
  private bgmFilter:       BiquadFilterNode | null = null;
  private bgmOscillators:  OscillatorNode[] = [];

  private isEnhanced   = true;
  private isBgmEnabled = true;

  // -----------------------------------------------------------------
  // Initialise AudioContext and filter chain (runs once, on first use)
  // -----------------------------------------------------------------
  private initContext() {
    if (this.audioCtx) return;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.audioCtx = new AudioContextClass();
    const ctx = this.audioCtx;

    // 1. Low-shelf warmth — chest resonance for neural voices
    this.warmthFilter = ctx.createBiquadFilter();
    this.warmthFilter.type = 'lowshelf';
    this.warmthFilter.frequency.value = 220;
    this.warmthFilter.gain.value = this.isEnhanced ? 2.5 : 0;

    // 2. Presence boost — Nepali vowel clarity band
    this.presenceFilter = ctx.createBiquadFilter();
    this.presenceFilter.type = 'peaking';
    this.presenceFilter.frequency.value = 1200;
    this.presenceFilter.Q.value = 0.9;
    this.presenceFilter.gain.value = this.isEnhanced ? 1.8 : 0;

    // 3. Metallic notch — reduce digital buzz in neural mp3 output
    this.notchFilter = ctx.createBiquadFilter();
    this.notchFilter.type = 'peaking';
    this.notchFilter.frequency.value = 3000;
    this.notchFilter.Q.value = 1.4;
    this.notchFilter.gain.value = this.isEnhanced ? -3.0 : 0;

    // 4. High-shelf air cut — soften mp3 compression artefacts above 7 kHz
    this.airFilter = ctx.createBiquadFilter();
    this.airFilter.type = 'highshelf';
    this.airFilter.frequency.value = 7000;
    this.airFilter.gain.value = this.isEnhanced ? -1.5 : 0;

    // 5. Gentle dynamics compressor — keeps narration consistent
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.value = this.isEnhanced ? -20 : 0;
    this.compressor.knee.value      = 28;
    this.compressor.ratio.value     = this.isEnhanced ? 3.0 : 1;
    this.compressor.attack.value    = 0.004;
    this.compressor.release.value   = 0.25;

    // 6. Master gain — slight boost to compensate for EQ cuts above
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = this.isEnhanced ? 1.08 : 1.0;

    // Connect chain: warmth → presence → notch → air → compressor → master → output
    this.warmthFilter.connect(this.presenceFilter);
    this.presenceFilter.connect(this.notchFilter);
    this.notchFilter.connect(this.airFilter);
    this.airFilter.connect(this.compressor);
    this.compressor.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);

    this.initBgmNodes();
  }

  // -----------------------------------------------------------------
  // Ambient BGM bed (synthesised, no external file needed)
  // -----------------------------------------------------------------
  private initBgmNodes() {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.value = 0; // silent until media plays

    this.bgmFilter = ctx.createBiquadFilter();
    this.bgmFilter.type = 'lowpass';
    this.bgmFilter.frequency.value = 300; // velvet low pad

    // Harmonic chord: F2 + C3 + A3
    const freqs: [number, OscillatorType, number][] = [
      [87.31,  'sine',     0.07],
      [130.81, 'triangle', 0.04],
      [220.00, 'triangle', 0.03],
    ];

    this.bgmOscillators = freqs.map(([freq, type, vol]) => {
      const osc     = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type            = type;
      osc.frequency.value = freq;
      oscGain.gain.value  = vol;
      osc.connect(oscGain);
      oscGain.connect(this.bgmFilter!);
      osc.start();
      return osc;
    });

    this.bgmFilter.connect(this.bgmGain);
    this.bgmGain.connect(ctx.destination);
  }

  // -----------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------

  /** Attach a media element to the filter chain (call once per element). */
  public attachMedia(media: HTMLMediaElement | null) {
    if (!media) return;
    try {
      this.initContext();
      if (!this.audioCtx || !this.warmthFilter) return;
      if (!this.connectedSources.has(media)) {
        const src = this.audioCtx.createMediaElementSource(media);
        src.connect(this.warmthFilter);
        this.connectedSources.set(media, src);
      }
    } catch {
      // Browsers block before first user gesture — harmless
    }
  }

  /** Resume suspended AudioContext after a user gesture. */
  public resume() {
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  /** Enable or disable the EQ enhancement chain. */
  public setEnhanced(enabled: boolean) {
    this.isEnhanced = enabled;
    this.initContext();
    if (!this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    this.warmthFilter?.gain.setTargetAtTime(enabled ? 2.5  : 0, t, 0.05);
    this.presenceFilter?.gain.setTargetAtTime(enabled ? 1.8  : 0, t, 0.05);
    this.notchFilter?.gain.setTargetAtTime(enabled ? -3.0 : 0, t, 0.05);
    this.airFilter?.gain.setTargetAtTime(enabled ? -1.5 : 0, t, 0.05);
    this.masterGain?.gain.setTargetAtTime(enabled ? 1.08 : 1.0, t, 0.05);
    if (this.compressor) {
      this.compressor.threshold.setTargetAtTime(enabled ? -20 : 0, t, 0.05);
      this.compressor.ratio.setTargetAtTime(enabled ? 3.0  : 1, t, 0.05);
    }
  }

  /** Enable or disable the ambient BGM bed. */
  public setBgmEnabled(enabled: boolean, isMediaPlaying = false) {
    this.isBgmEnabled = enabled;
    this.initContext();
    this.updateBgmState(isMediaPlaying);
  }

  /** Call this on play/pause/ended events to ramp BGM in/out. */
  public updateBgmState(isMediaPlaying: boolean) {
    if (!this.audioCtx || !this.bgmGain) return;
    const target = this.isBgmEnabled && isMediaPlaying ? 0.07 : 0;
    this.bgmGain.gain.setTargetAtTime(target, this.audioCtx.currentTime, 0.4);
  }
}

export const voiceEnhancer = new VoiceEnhancerEngine();
