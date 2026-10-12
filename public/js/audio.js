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

  // 9. Electronic Robot Computer Beep
  function robotBeep() {
    const ac = getAudioContext();
    if (!ac) return;

    const freqs = [880, 1760, 587, 1174];
    freqs.forEach((freq, idx) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const time = ac.currentTime + idx * 0.07;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(time);
      osc.stop(time + 0.07);
    });
  }

  // 10. Heroic Superhero Trumpet Fanfare
  function heroFanfare() {
    const ac = getAudioContext();
    if (!ac) return;

    // Brassy heroic stabs: C4, E4, G4, high C5, G4, high C5!
    const notes = [
      { f: 261.63, d: 0.12 },
      { f: 329.63, d: 0.12 },
      { f: 392.00, d: 0.15 },
      { f: 523.25, d: 0.35 },
      { f: 392.00, d: 0.12 },
      { f: 523.25, d: 0.50 },
    ];

    let t = ac.currentTime + 0.02;
    notes.forEach((note) => {
      const osc = ac.createOscillator();
      const filter = ac.createBiquadFilter();
      const gain = ac.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, t);
      filter.frequency.exponentialRampToValueAtTime(800, t + note.d);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d + 0.04;
    });
  }

  // 11. Goofy Dinosaur Roar & Rumble
  function dinoRoar() {
    const ac = getAudioContext();
    if (!ac) return;

    const osc = ac.createOscillator();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();

    osc.type = 'sawtooth';
    const t = ac.currentTime;
    osc.frequency.setValueAtTime(85, t);
    osc.frequency.linearRampToValueAtTime(175, t + 0.25);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.7);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, t);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    osc.start(t);
    osc.stop(t + 0.8);
  }

  // 12. Upbeat Cartoon Party Background Music (BGM Loop)
  let bgmInterval = null;
  let bgmPlaying = false;

  function startCartoonBGM() {
    if (bgmPlaying) return;
    const ac = getAudioContext();
    if (!ac) return;
    bgmPlaying = true;

    // Cheerful bouncy cartoon marimba melody: C - E - G - A - G - E - D - C
    const melody = [523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25];
    let noteIdx = 0;

    bgmInterval = setInterval(() => {
      if (!bgmPlaying) return;
      const t = ac.currentTime;
      const freq = melody[noteIdx % melody.length];
      noteIdx++;

      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      // Soft non-intrusive volume (0.05) so voice remains crystal clear
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(t);
      osc.stop(t + 0.2);
    }, 230);
  }

  // 13. Funny Cartoon Laugh / Giggles
  function cartoonLaugh() {
    const ac = getAudioContext();
    if (!ac) return;

    // Series of 4 bouncy joyful giggles: alternating pitch boings
    const giggleTimes = [0.0, 0.12, 0.24, 0.36];
    giggleTimes.forEach((gt, idx) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const t = ac.currentTime + gt;

      osc.type = 'triangle';
      const baseFreq = 580 + (idx % 2) * 120;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 180, t + 0.08);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(t);
      osc.stop(t + 0.11);
    });
  }

  return {
    init,
    getAudioContext,
    pop,
    candleBlow,
    boing,
    sparkle,
    partyHorn,
    cheer,
    fanfare,
    robotBeep,
    heroFanfare,
    dinoRoar,
    cartoonLaugh,
    startCartoonBGM,
    stopCartoonBGM,
    click,
  };
})();

/**
 * VoiceChanger - Real-time Talking Tom, Shinchan, Bhalu & Robo voice warping engine
 * Uses Web Audio API & OfflineAudioContext with standard PCM WAV export
 */
const VoiceChanger = (() => {
  let activeSource = null;
  let mouthInterval = null;

  function getAudioContext() {
    return SoundFx.getAudioContext();
  }

  // 1. Decode Blob into AudioBuffer
  async function decodeAudioBlob(blob) {
    const ac = getAudioContext();
    if (!ac) throw new Error('AudioContext unavailable');
    const arrayBuffer = await blob.arrayBuffer();
    return await ac.decodeAudioData(arrayBuffer);
  }

  // 2. Offline AudioContext DSP: Warps pitch & frequency into genuine cartoon voices
  async function renderVoiceEffect(audioBuffer, effectType) {
    if (!effectType || effectType === 'normal') {
      return audioBuffer;
    }

    let rate = 1.0;
    if (effectType === 'tom') rate = 1.45;       // Talking Tom squeaky chipmunk
    else if (effectType === 'shinchan') rate = 1.30; // Naughty Shinchan cheeky pitch
    else if (effectType === 'bhalu') rate = 0.76;    // Deep funny cuddly giant bear
    else if (effectType === 'robo') rate = 1.05;     // Electronic droid

    const targetLength = Math.max(1, Math.ceil(audioBuffer.length / rate));
    const offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
      audioBuffer.numberOfChannels,
      targetLength,
      audioBuffer.sampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = rate;

    if (effectType === 'tom') {
      // Talking Tom: High-pass to strip chest rumble + presence boost
      const highpass = offlineCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(320, offlineCtx.currentTime);

      const boost = offlineCtx.createBiquadFilter();
      boost.type = 'peaking';
      boost.frequency.setValueAtTime(2600, offlineCtx.currentTime);
      boost.gain.setValueAtTime(5.0, offlineCtx.currentTime);

      source.connect(highpass);
      highpass.connect(boost);
      boost.connect(offlineCtx.destination);
    } else if (effectType === 'shinchan') {
      // Shinchan: Playful bright mid-high peak
      const midBoost = offlineCtx.createBiquadFilter();
      midBoost.type = 'peaking';
      midBoost.frequency.setValueAtTime(1800, offlineCtx.currentTime);
      midBoost.gain.setValueAtTime(6.0, offlineCtx.currentTime);

      source.connect(midBoost);
      midBoost.connect(offlineCtx.destination);
    } else if (effectType === 'bhalu') {
      // Bhalu Dada: Deep bass resonance & lowpass warmth
      const bassBoost = offlineCtx.createBiquadFilter();
      bassBoost.type = 'lowshelf';
      bassBoost.frequency.setValueAtTime(300, offlineCtx.currentTime);
      bassBoost.gain.setValueAtTime(8.0, offlineCtx.currentTime);

      const lowpass = offlineCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1400, offlineCtx.currentTime);

      source.connect(bassBoost);
      bassBoost.connect(lowpass);
      lowpass.connect(offlineCtx.destination);
    } else if (effectType === 'robo') {
      // Robo Chintu: Metallic droid bandpass filter
      const bandpass = offlineCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1150, offlineCtx.currentTime);
      bandpass.Q.setValueAtTime(5.0, offlineCtx.currentTime);

      const gain = offlineCtx.createGain();
      gain.gain.setValueAtTime(2.2, offlineCtx.currentTime);

      source.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(offlineCtx.destination);
    } else {
      source.connect(offlineCtx.destination);
    }

    source.start(0);
    return await offlineCtx.startRendering();
  }

  // 3. AudioBuffer to 16-bit PCM WAV Blob
  function audioBufferToWavBlob(abuffer) {
    const numOfChan = abuffer.numberOfChannels;
    const length = abuffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    const channels = [];
    const sampleRate = abuffer.sampleRate;
    let offset = 0;
    let pos = 0;

    function setUint16(data) {
      out.setUint16(pos, data, true);
      pos += 2;
    }
    function setUint32(data) {
      out.setUint32(pos, data, true);
      pos += 4;
    }

    // RIFF identifier
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"

    // fmt sub-chunk
    setUint32(0x20746d66); // "fmt "
    setUint32(16);         // SubChunk1Size = 16
    setUint16(1);          // AudioFormat 1 = PCM
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);         // 16 bits per sample

    // data sub-chunk
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (offset < abuffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out.buffer], { type: 'audio/wav' });
  }

  // 4. Play AudioBuffer with real-time audio amplitude Lip-Sync
  function playBufferWithLipSync(audioBuffer, onMouthToggle, onEnded) {
    stopPlayback();

    const ac = getAudioContext();
    if (!ac) {
      if (onEnded) onEnded();
      return;
    }

    const source = ac.createBufferSource();
    source.buffer = audioBuffer;

    const analyser = ac.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyser.connect(ac.destination);

    // Amplitude-based real-time lip-sync
    mouthInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const avg = sum / dataArray.length;
      if (onMouthToggle) {
        onMouthToggle(avg > 18);
      }
    }, 60);

    source.onended = () => {
      stopPlayback();
      if (onMouthToggle) onMouthToggle(false);
      if (onEnded) onEnded();
    };

    activeSource = source;
    source.start(0);
  }

  function stopPlayback() {
    if (activeSource) {
      try {
        activeSource.stop();
      } catch (e) {}
      activeSource = null;
    }
    if (mouthInterval) {
      clearInterval(mouthInterval);
      mouthInterval = null;
    }
  }

  return {
    decodeAudioBlob,
    renderVoiceEffect,
    audioBufferToWavBlob,
    playBufferWithLipSync,
    stopPlayback,
  };
})();

