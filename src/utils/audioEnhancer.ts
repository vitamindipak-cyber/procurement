/**
 * Web Audio API based Voice Enhancer and Ambient Sound Bed.
 * Specifically designed to reduce metallic/nasal robotic artifacts in synthetic TTS
 * voices (such as Piper/VITS) and add chest resonance, vocal warmth, and dynamics.
 */

class VoiceEnhancerEngine {
  private audioCtx: AudioContext | null = null;
  private connectedSources = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();
  private lowWarmthFilter: BiquadFilterNode | null = null;
  private notchHarshnessFilter: BiquadFilterNode | null = null;
  private sibilanceFilter: BiquadFilterNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private masterVoiceGain: GainNode | null = null;

  // Soft ambient background audio bed
  private bgmGain: GainNode | null = null;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmFilter: BiquadFilterNode | null = null;

  private isEnhanced = true;
  private isBgmEnabled = true;

  private initContext() {
    if (this.audioCtx) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.audioCtx = new AudioContextClass();

    // 1. Low shelf filter (+3.2 dB @ 180 Hz): Adds human vocal warmth & chest resonance
    this.lowWarmthFilter = this.audioCtx.createBiquadFilter();
    this.lowWarmthFilter.type = 'lowshelf';
    this.lowWarmthFilter.frequency.value = 180;
    this.lowWarmthFilter.gain.value = this.isEnhanced ? 3.2 : 0;

    // 2. Peaking notch filter (-3.8 dB @ 3150 Hz, Q=1.7): Scoops out synthetic metallic buzz
    this.notchHarshnessFilter = this.audioCtx.createBiquadFilter();
    this.notchHarshnessFilter.type = 'peaking';
    this.notchHarshnessFilter.frequency.value = 3150;
    this.notchHarshnessFilter.Q.value = 1.7;
    this.notchHarshnessFilter.gain.value = this.isEnhanced ? -3.8 : 0;

    // 3. High shelf filter (-2.2 dB @ 6500 Hz): Softens harsh digital sibilance
    this.sibilanceFilter = this.audioCtx.createBiquadFilter();
    this.sibilanceFilter.type = 'highshelf';
    this.sibilanceFilter.frequency.value = 6500;
    this.sibilanceFilter.gain.value = this.isEnhanced ? -2.2 : 0;

    // 4. Dynamics Compressor: Levels narration volume, prevents peak harshness
    this.compressor = this.audioCtx.createDynamicsCompressor();
    this.compressor.threshold.value = this.isEnhanced ? -18 : 0;
    this.compressor.knee.value = 24;
    this.compressor.ratio.value = this.isEnhanced ? 3.8 : 1;
    this.compressor.attack.value = 0.005;
    this.compressor.release.value = 0.22;

    // 5. Master voice gain
    this.masterVoiceGain = this.audioCtx.createGain();
    this.masterVoiceGain.gain.value = 1.0;

    // Connect voice filter chain:
    this.lowWarmthFilter.connect(this.notchHarshnessFilter);
    this.notchHarshnessFilter.connect(this.sibilanceFilter);
    this.sibilanceFilter.connect(this.compressor);
    this.compressor.connect(this.masterVoiceGain);
    this.masterVoiceGain.connect(this.audioCtx.destination);

    // Initialize soft ambient BGM bed
    this.initBgmNodes();
  }

  private initBgmNodes() {
    if (!this.audioCtx) return;

    this.bgmGain = this.audioCtx.createGain();
    this.bgmGain.gain.value = 0; // starts silent

    this.bgmFilter = this.audioCtx.createBiquadFilter();
    this.bgmFilter.type = 'lowpass';
    this.bgmFilter.frequency.value = 280; // warm, velvety background pad

    // Harmonic chord (F2: 87.31Hz, C3: 130.81Hz, A3: 220Hz)
    const frequencies = [87.31, 130.81, 220.0];
    this.bgmOscillators = frequencies.map((freq, idx) => {
      const osc = this.audioCtx!.createOscillator();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      const oscGain = this.audioCtx!.createGain();
      oscGain.gain.value = idx === 0 ? 0.08 : 0.04;
      osc.connect(oscGain);
      oscGain.connect(this.bgmFilter!);
      osc.start();
      return osc;
    });

    this.bgmFilter.connect(this.bgmGain);
    this.bgmGain.connect(this.audioCtx.destination);
  }

  public attachMedia(media: HTMLMediaElement | null) {
    if (!media) return;
    try {
      this.initContext();
      if (!this.audioCtx || !this.lowWarmthFilter) return;

      if (!this.connectedSources.has(media)) {
        const sourceNode = this.audioCtx.createMediaElementSource(media);
        sourceNode.connect(this.lowWarmthFilter);
        this.connectedSources.set(media, sourceNode);
      }
    } catch {
      // Browsers may guard before user interaction
    }
  }

  public resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  public setEnhanced(enabled: boolean) {
    this.isEnhanced = enabled;
    this.initContext();
    if (!this.audioCtx) return;

    const time = this.audioCtx.currentTime;
    if (this.lowWarmthFilter) {
      this.lowWarmthFilter.gain.setTargetAtTime(enabled ? 3.2 : 0, time, 0.05);
    }
    if (this.notchHarshnessFilter) {
      this.notchHarshnessFilter.gain.setTargetAtTime(enabled ? -3.8 : 0, time, 0.05);
    }
    if (this.sibilanceFilter) {
      this.sibilanceFilter.gain.setTargetAtTime(enabled ? -2.2 : 0, time, 0.05);
    }
    if (this.compressor) {
      this.compressor.threshold.setTargetAtTime(enabled ? -18 : 0, time, 0.05);
      this.compressor.ratio.setTargetAtTime(enabled ? 3.8 : 1, time, 0.05);
    }
  }

  public setBgmEnabled(enabled: boolean, isMediaPlaying = false) {
    this.isBgmEnabled = enabled;
    this.initContext();
    this.updateBgmState(isMediaPlaying);
  }

  public updateBgmState(isMediaPlaying: boolean) {
    if (!this.audioCtx || !this.bgmGain) return;
    const time = this.audioCtx.currentTime;
    // Low, soothing level (0.075) that stays gently underneath speech
    const targetVolume = this.isBgmEnabled && isMediaPlaying ? 0.075 : 0;
    this.bgmGain.gain.setTargetAtTime(targetVolume, time, 0.35);
  }
}

export const voiceEnhancer = new VoiceEnhancerEngine();
