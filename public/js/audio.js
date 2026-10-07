/**
 * SoundFx - Zero-dependency Web Audio API synthesizer for KidBirthday celebration
 */
const SoundFx = (() => {
  let ctx = null;

  function getAudioContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  // Safe wrapper for user interactions
  function init() {
    getAudioContext();
  }

  // 1. Balloon Pop
  function pop() {
    const ac = getAudioContext();
    if (!ac) return;

    const bufferSize = ac.sampleRate * 0.12;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.02));
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, ac.currentTime + 0.12);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(1.0, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    noise.start();
  }

  // 2. Candle Blow (Breath wind effect)
  function candleBlow() {
    const ac = getAudioContext();
    if (!ac) return;

    const bufferSize = ac.sampleRate * 0.8;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(250, ac.currentTime + 0.8);
    filter.Q.value = 2.5;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.05, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ac.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    noise.start();
  }

  // 3. Cartoon Spring Boing
  function boing() {
    const ac = getAudioContext();
    if (!ac) return;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(650, ac.currentTime + 0.18);
    osc.frequency.exponentialRampToValueAtTime(220, ac.currentTime + 0.35);

    gain.gain.setValueAtTime(0.6, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.38);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.4);
  }

  // 4. Fairy Sparkle
  function sparkle() {
    const ac = getAudioContext();
    if (!ac) return;

    const notes = [1046.5, 1318.5, 1567.98, 2093.0, 2637.02, 3135.96];
    notes.forEach((freq, idx) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const time = ac.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(time);
      osc.stop(time + 0.35);
    });
  }

  // 5. Celebration Horn
  function partyHorn() {
    const ac = getAudioContext();
    if (!ac) return;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, ac.currentTime);
    osc.frequency.linearRampToValueAtTime(440, ac.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(280, ac.currentTime + 0.5);

    gain.gain.setValueAtTime(0.3, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ac.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.55);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.6);
  }

  // 6. Crowd Cheering & Clapping
  function cheer() {
    const ac = getAudioContext();
    if (!ac) return;

    // Background cheer noise
    const bufferSize = ac.sampleRate * 2.2;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ac.currentTime);
    filter.Q.value = 1.2;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.05, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ac.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0.35, ac.currentTime + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 2.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    noise.start();

    // Fanfare bells on top
    fanfare();
  }

  // 7. Happy Birthday Melody / Fanfare
  function fanfare() {
    const ac = getAudioContext();
    if (!ac) return;

    // "Happy Birthday To You" snippet: G4, G4, A4, G4, C5, B4
    const notes = [
      { f: 392.0, d: 0.25 },
      { f: 392.0, d: 0.25 },
      { f: 440.0, d: 0.45 },
      { f: 392.0, d: 0.45 },
      { f: 523.25, d: 0.5 },
      { f: 493.88, d: 0.8 },
    ];

    let t = ac.currentTime + 0.05;
    notes.forEach((note) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d + 0.04;
    });
  }

  // 8. Cute UI Click
  function click() {
    const ac = getAudioContext();
    if (!ac) return;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ac.currentTime + 0.06);

    gain.gain.setValueAtTime(0.2, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.07);
  }

  return {
    init,
    pop,
    candleBlow,
    boing,
    sparkle,
    partyHorn,
    cheer,
    fanfare,
    click,
  };
})();

