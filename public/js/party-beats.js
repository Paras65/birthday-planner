/**
 * PartyBeats: Upbeat Cheerful Celebration Beats Synthesizer (Dholak, Claps & Melody)
 * Synthesizes celebratory music in real-time and provides audio stream for Video Recorder
 */

const PartyBeats = (() => {
  let audioCtx = null;
  let isPlaying = false;
  let beatTimer = null;
  let beatStep = 0;
  let mediaDest = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        mediaDest = audioCtx.createMediaStreamDestination();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function getAudioStream() {
    getAudioContext();
    return mediaDest ? mediaDest.stream : null;
  }

  // Helper to connect to both speakers and recording stream
  function connectNode(node) {
    const ac = getAudioContext();
    if (!ac) return;
    node.connect(ac.destination);
    if (mediaDest) {
      node.connect(mediaDest);
    }
  }

  // 1. Dholak Base & Slap Beat
  function triggerDholak(isSlap = false) {
    const ac = getAudioContext();
    if (!ac) return;

    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    if (isSlap) {
      // High crisp dholak slap
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    } else {
      // Deep bass dholak thump
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.16);

      gain.gain.setValueAtTime(0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    }

    osc.connect(gain);
    connectNode(gain);

    osc.start(t);
    osc.stop(t + (isSlap ? 0.1 : 0.2));
  }

  // 2. Party Hand Clap & Shaker
  function triggerHandClap() {
    const ac = getAudioContext();
    if (!ac) return;

    const t = ac.currentTime;
    const bufferSize = ac.sampleRate * 0.12;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.value = 1.6;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    connectNode(gain);

    noise.start(t);
  }

  // 3. Cheerful Celebration Horn Melody
  // Melodic riff: C5 - E5 - G5 - A5 - G5 - C6
  const melodyNotes = [
    523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 1046.5, 783.99,
    587.33, 659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25,
  ];

  function triggerMelody(noteIndex) {
    const ac = getAudioContext();
    if (!ac) return;

    const freq = melodyNotes[noteIndex % melodyNotes.length];
    const t = ac.currentTime;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    connectNode(gain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 4. Start the Upbeat Celebration Beat Loop (125 BPM Masti)
  function startPartyLoop() {
    if (isPlaying) return;
    const ac = getAudioContext();
    if (!ac) return;
    isPlaying = true;
    beatStep = 0;

    // 125 BPM = ~120ms per 16th step
    const stepDuration = 125;

    beatTimer = setInterval(() => {
      if (!isPlaying) return;

      // 4-on-the-floor dholak kick on beats 0, 4, 8, 12
      if (beatStep % 4 === 0) {
        triggerDholak(false);
      }
      // Dholak slap on beats 2, 6, 10, 14
      if (beatStep % 4 === 2) {
        triggerDholak(true);
      }
      // Hand clap on backbeats 4, 12
      if (beatStep % 8 === 4) {
        triggerHandClap();
      }

      // Melody note every 2 steps
      if (beatStep % 2 === 0) {
        triggerMelody(Math.floor(beatStep / 2));
      }

      beatStep = (beatStep + 1) % 32;
    }, stepDuration);
  }

  function stopPartyLoop() {
    isPlaying = false;
    if (beatTimer) {
      clearInterval(beatTimer);
      beatTimer = null;
    }
  }

  // 5. Celebration Confetti Horn
  function partyHorn() {
    const ac = getAudioContext();
    if (!ac) return;

    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.linearRampToValueAtTime(560, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.4);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

    osc.connect(gain);
    connectNode(gain);

    osc.start(t);
    osc.stop(t + 0.45);
  }

  // 6. Crowd Cheer Fanfare
  function crowdCheer() {
    const ac = getAudioContext();
    if (!ac) return;

    const t = ac.currentTime;
    const bufferSize = ac.sampleRate * 1.5;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.value = 1.2;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    connectNode(gain);

    noise.start(t);
  }

  return {
    init: getAudioContext,
    startPartyLoop,
    stopPartyLoop,
    partyHorn,
    crowdCheer,
    getAudioStream,
  };
})();
