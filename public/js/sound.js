/**
 * Web Audio API Sound Effects Engine - ToonHero Storybook
 * Zero external audio files required! 100% synthesized in real-time.
 */

const SoundEngine = (() => {
  let audioCtx = null;
  let bgmInterval = null;
  let isBgmPlaying = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function init() {
    getAudioContext();
  }

  // 1. Superhero Fanfare
  function heroFanfare() {
    const ac = getAudioContext();
    if (!ac) return;

    const notes = [
      { f: 261.63, d: 0.15 }, // C4
      { f: 329.63, d: 0.15 }, // E4
      { f: 392.00, d: 0.18 }, // G4
      { f: 523.25, d: 0.40 }, // C5
      { f: 392.00, d: 0.15 }, // G4
      { f: 523.25, d: 0.60 }, // High C5!
    ];

    let t = ac.currentTime + 0.02;
    notes.forEach((note) => {
      const osc = ac.createOscillator();
      const filter = ac.createBiquadFilter();
      const gain = ac.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, t);
      filter.frequency.exponentialRampToValueAtTime(900, t + note.d);

      gain.gain.setValueAtTime(0.26, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d + 0.04;
    });
  }

  // 2. Superhero Whoosh / Flight
  function whoosh() {
    const ac = getAudioContext();
    if (!ac) return;

    const bufferSize = ac.sampleRate * 0.4;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1400, ac.currentTime + 0.2);
    filter.frequency.exponentialRampToValueAtTime(300, ac.currentTime + 0.4);
    filter.Q.value = 3.0;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.01, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ac.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    noise.start();
  }

  // 3. Magical Sparkles
  function magicSparkle() {
    const ac = getAudioContext();
    if (!ac) return;

    const freqs = [1046.5, 1318.5, 1567.98, 2093.0, 2637.02, 3135.96];
    freqs.forEach((freq, idx) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const time = ac.currentTime + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(time);
      osc.stop(time + 0.32);
    });
  }

  // 4. Balloon / Orb Pop
  function balloonPop() {
    const ac = getAudioContext();
    if (!ac) return;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.08);

    gain.gain.setValueAtTime(0.7, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start();
    osc.stop(ac.currentTime + 0.1);
  }

  // 5. Crowd Cheering & Applause
  function cheer() {
    const ac = getAudioContext();
    if (!ac) return;

    const bufferSize = ac.sampleRate * 2.0;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, ac.currentTime);
    filter.Q.value = 1.2;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.05, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ac.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0.3, ac.currentTime + 1.4);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 2.0);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    noise.start();

    heroFanfare();
  }

  // 6. Candle Blow
  function candleBlow() {
    const ac = getAudioContext();
    if (!ac) return;

    const bufferSize = ac.sampleRate * 0.7;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ac.currentTime);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.1, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.45, ac.currentTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.7);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    noise.start();
  }

  // 7. Cartoon Giggle / Laugh
  function giggle() {
    const ac = getAudioContext();
    if (!ac) return;

    const steps = [0.0, 0.12, 0.24, 0.36];
    steps.forEach((st, idx) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const t = ac.currentTime + st;

      osc.type = 'triangle';
      const base = 560 + (idx % 2) * 140;
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.exponentialRampToValueAtTime(base + 160, t + 0.08);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.11);
    });
  }

  // 8. Click
  function click() {
    const ac = getAudioContext();
    if (!ac) return;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(950, ac.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.07);
  }

  // 9. Upbeat Cartoon Adventure BGM Loop
  function startMovieBGM() {
    if (isBgmPlaying) return;
    const ac = getAudioContext();
    if (!ac) return;
    isBgmPlaying = true;

    // Upbeat melody snippet: C - E - G - A - G - E - D - C
    const melody = [523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25];
    let noteIdx = 0;

    bgmInterval = setInterval(() => {
      if (!isBgmPlaying) return;
      const t = ac.currentTime;
      const freq = melody[noteIdx % melody.length];
      noteIdx++;

      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      // Low soft volume so speech narration is completely audible
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(t);
      osc.stop(t + 0.18);
    }, 240);
  }

  function stopMovieBGM() {
    isBgmPlaying = false;
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  }

  return {
    init,
    heroFanfare,
    whoosh,
    magicSparkle,
    balloonPop,
    cheer,
    candleBlow,
    giggle,
    click,
    startMovieBGM,
    stopMovieBGM,
  };
})();
