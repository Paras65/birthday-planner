/**
 * CharacterManager - Cartoon characters with interactive SVG rigs, authentic cartoon voices & SoundFx
 */
const CharacterManager = (() => {
  let cachedVoices = [];
  let userPreferredVoiceURI = null;

  function refreshVoices() {
    if ('speechSynthesis' in window) {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    }
  }

  if ('speechSynthesis' in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      refreshVoices();
      // Notify listeners if any voice selector dropdown exists
      window.dispatchEvent(new CustomEvent('voicesready', { detail: cachedVoices }));
    };
  }

  const characters = {
    mimi: {
      id: 'mimi',
      name: 'Mimi The Kitty',
      badge: '🐱 Mimi Kitty',
      themeColor: '#ff5da2',
      pitch: 1.28, // Cheerful sweet tone without SAPI distortion
      rate: 1.05,
      soundFx: 'sparkle',
      introPrefix: (sender) => `Meow meow! Suno sab log! ${sender} ne bheja hai pyara sa wish: `,
      preferredVoiceNames: ['Ana', 'Maisie', 'Swara', 'Zira', 'Google हिन्दी', 'Google UK English Female', 'Heera', 'Jenny'],
      intro: 'Meow-magical birthday wishes!',
      renderSvg: (mouthOpen = false) => `
        <svg viewBox="0 0 160 160" class="toon-svg toon-mimi">
          <defs>
            <radialGradient id="mimiGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#fff0f5"/>
              <stop offset="100%" stop-color="#ffb6c1"/>
            </radialGradient>
          </defs>
          <polygon points="35,60 15,15 65,40" fill="#ff8da1" stroke="#e05273" stroke-width="3"/>
          <polygon points="38,55 25,25 60,42" fill="#ffd1dc"/>
          <polygon points="125,60 145,15 95,40" fill="#ff8da1" stroke="#e05273" stroke-width="3"/>
          <polygon points="122,55 135,25 100,42" fill="#ffd1dc"/>
          <ellipse cx="80" cy="85" rx="55" ry="48" fill="url(#mimiGrad)" stroke="#e05273" stroke-width="4"/>
          <path d="M42,42 C30,30 20,52 42,46 C42,46 62,52 50,30 Z" fill="#ff2e7a"/>
          <circle cx="46" cy="43" r="5" fill="#ffd166"/>
          <ellipse cx="58" cy="80" rx="9" ry="12" fill="#2d2340"/>
          <ellipse cx="102" cy="80" rx="9" ry="12" fill="#2d2340"/>
          <circle cx="56" cy="76" r="3.5" fill="#ffffff"/>
          <circle cx="61" cy="82" r="1.5" fill="#ffffff"/>
          <circle cx="100" cy="76" r="3.5" fill="#ffffff"/>
          <circle cx="105" cy="82" r="1.5" fill="#ffffff"/>
          <polygon points="80,92 75,87 85,87" fill="#ff4081"/>
          <line x1="25" y1="85" x2="48" y2="87" stroke="#e05273" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="22" y1="94" x2="48" y2="92" stroke="#e05273" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="135" y1="85" x2="112" y2="87" stroke="#e05273" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="138" y1="94" x2="112" y2="92" stroke="#e05273" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="48" cy="94" r="8" fill="#ff8da1" opacity="0.6"/>
          <circle cx="112" cy="94" r="8" fill="#ff8da1" opacity="0.6"/>
          ${
            mouthOpen
              ? `<path d="M72,97 Q80,116 88,97 Z" fill="#ff2e7a" stroke="#b3003b" stroke-width="2"/>
                 <ellipse cx="80" cy="105" rx="4" ry="2.5" fill="#ffd166"/>`
              : `<path d="M72,96 Q76,102 80,96 Q84,102 88,96" stroke="#b3003b" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
          }
        </svg>
      `,
    },

    bhalu: {
      id: 'bhalu',
      name: 'Bhalu Dada',
      badge: '🐻 Bhalu Dada',
      themeColor: '#b45309',
      pitch: 0.88, // Warm, cuddly bear tone
      rate: 0.92,
      soundFx: 'boing',
      introPrefix: (sender) => `Arre waah! Hahaha! Suno mere pyare champ, ${sender} bol rahe hain: `,
      preferredVoiceNames: ['Madhur', 'Prabhat', 'Ravi', 'Guy', 'George', 'David', 'Google हिन्दी'],
      intro: 'Bhalu Dada ki taraf se dher saara aashirwaad aur chocolate!',
      renderSvg: (mouthOpen = false) => `
        <svg viewBox="0 0 160 160" class="toon-svg toon-bhalu">
          <circle cx="35" cy="45" r="22" fill="#8d5b32" stroke="#5d3a1a" stroke-width="3"/>
          <circle cx="35" cy="45" r="12" fill="#d49b6a"/>
          <circle cx="125" cy="45" r="22" fill="#8d5b32" stroke="#5d3a1a" stroke-width="3"/>
          <circle cx="125" cy="45" r="12" fill="#d49b6a"/>
          <circle cx="80" cy="85" r="52" fill="#a06839" stroke="#5d3a1a" stroke-width="4"/>
          <ellipse cx="80" cy="96" rx="26" ry="20" fill="#ffd8a8"/>
          <circle cx="62" cy="74" r="7" fill="#2d2340"/>
          <circle cx="98" cy="74" r="7" fill="#2d2340"/>
          <circle cx="60" cy="72" r="2.5" fill="#ffffff"/>
          <circle cx="96" cy="72" r="2.5" fill="#ffffff"/>
          <ellipse cx="80" cy="90" rx="9" ry="6" fill="#42250d"/>
          <circle cx="50" cy="95" r="7" fill="#fca5a5" opacity="0.6"/>
          <circle cx="110" cy="95" r="7" fill="#fca5a5" opacity="0.6"/>
          ${
            mouthOpen
              ? `<path d="M72,99 Q80,118 88,99 Z" fill="#b91c1c" stroke="#5d3a1a" stroke-width="2"/>
                 <ellipse cx="80" cy="107" rx="5" ry="3" fill="#f87171"/>`
              : `<path d="M80,95 L80,102 M73,103 Q80,108 87,103" stroke="#5d3a1a" stroke-width="3" fill="none" stroke-linecap="round"/>`
          }
        </svg>
      `,
    },

    fairy: {
      id: 'fairy',
      name: 'Pari The Fairy',
      badge: '👑 Pari Fairy',
      themeColor: '#ec4899',
      pitch: 1.22,
      rate: 0.95,
      soundFx: 'sparkle',
      introPrefix: (sender) => `Chhoo mantar! Chamakti pari aayi hai, aur ${sender} ne kaha hai: `,
      preferredVoiceNames: ['Neerja', 'Swara', 'Jenny', 'Zira', 'Google हिन्दी', 'Google UK English Female'],
      intro: 'May all your magical dreams come true today!',
      renderSvg: (mouthOpen = false) => `
        <svg viewBox="0 0 160 160" class="toon-svg toon-fairy">
          <defs>
            <linearGradient id="fairyWings" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#c084fc" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#67e8f9" stop-opacity="0.5"/>
            </linearGradient>
          </defs>
          <ellipse cx="30" cy="65" rx="26" ry="16" fill="url(#fairyWings)" transform="rotate(-30 30 65)"/>
          <ellipse cx="130" cy="65" rx="26" ry="16" fill="url(#fairyWings)" transform="rotate(30 130 65)"/>
          <ellipse cx="32" cy="88" rx="20" ry="12" fill="url(#fairyWings)" transform="rotate(-15 32 88)"/>
          <ellipse cx="128" cy="88" rx="20" ry="12" fill="url(#fairyWings)" transform="rotate(15 128 88)"/>
          <circle cx="80" cy="85" r="45" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
          <path d="M38,80 C30,40 70,35 80,35 C90,35 130,40 122,80 C110,55 95,50 80,50 C65,50 50,55 38,80 Z" fill="#fbbf24"/>
          <polygon points="62,45 70,25 80,38 90,25 98,45" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
          <circle cx="80" cy="36" r="3.5" fill="#ec4899"/>
          <ellipse cx="62" cy="82" rx="7" ry="9" fill="#4338ca"/>
          <ellipse cx="98" cy="82" rx="7" ry="9" fill="#4338ca"/>
          <circle cx="60" cy="79" r="2.5" fill="#ffffff"/>
          <circle cx="96" cy="79" r="2.5" fill="#ffffff"/>
          <circle cx="50" cy="94" r="7" fill="#f472b6" opacity="0.6"/>
          <circle cx="110" cy="94" r="7" fill="#f472b6" opacity="0.6"/>
          ${
            mouthOpen
              ? `<path d="M73,98 Q80,114 87,98 Z" fill="#db2777" stroke="#9d174d" stroke-width="2"/>`
              : `<path d="M72,100 Q80,109 88,100" stroke="#db2777" stroke-width="3" fill="none" stroke-linecap="round"/>`
          }
        </svg>
      `,
    },

    superhero: {
      id: 'superhero',
      name: 'Super Veer',
      badge: '🦸 Super Veer',
      themeColor: '#ef4444',
      pitch: 1.08,
      rate: 1.15,
      soundFx: 'fanfare',
      introPrefix: (sender) => `Dhoom dhadaka! Super Veer laya hai ${sender} ka superpower wish: `,
      preferredVoiceNames: ['Prabhat', 'Guy', 'Google हिन्दी', 'Google US English'],
      intro: 'Superpowers unlocked today! Heroic birthday celebration!',
      renderSvg: (mouthOpen = false) => `
        <svg viewBox="0 0 160 160" class="toon-svg toon-hero">
          <path d="M40,75 L15,145 L70,120 L80,148 L90,120 L145,145 L120,75 Z" fill="#dc2626"/>
          <circle cx="80" cy="80" r="46" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
          <path d="M38,70 Q35,35 80,35 Q125,35 122,70 Q105,48 80,48 Q55,48 38,70 Z" fill="#1e293b"/>
          <path d="M45,70 C55,62 70,68 80,72 C90,68 105,62 115,70 C120,82 105,88 92,84 C80,80 80,80 68,84 C55,88 40,82 45,70 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
          <ellipse cx="62" cy="74" rx="8" ry="6" fill="#ffffff"/>
          <ellipse cx="98" cy="74" rx="8" ry="6" fill="#ffffff"/>
          <circle cx="63" cy="74" r="3.5" fill="#1e293b"/>
          <circle cx="97" cy="74" r="3.5" fill="#1e293b"/>
          <polygon points="80,38 74,48 81,48 77,58 86,47 80,47" fill="#fbbf24"/>
          ${
            mouthOpen
              ? `<path d="M70,98 Q80,118 90,98 Z" fill="#991b1b" stroke="#1e293b" stroke-width="2"/>
                 <rect x="73" y="99" width="14" height="4" fill="#ffffff"/>`
              : `<path d="M68,102 Q80,114 92,102" stroke="#991b1b" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
          }
        </svg>
      `,
    },

    dino: {
      id: 'dino',
      name: 'Dino Rex',
      badge: '🦖 Dino Rex',
      themeColor: '#10b981',
      pitch: 0.96,
      rate: 1.08,
      soundFx: 'partyHorn',
      introPrefix: (sender) => `Roaaar! Ohooo! Mazedaar din hai! ${sender} kehte hain: `,
      preferredVoiceNames: ['Ravi', 'Guy', 'Google हिन्दी', 'Google US English'],
      intro: 'ROAAAR! Happy Birthday to the coolest champion!',
      renderSvg: (mouthOpen = false) => `
        <svg viewBox="0 0 160 160" class="toon-svg toon-dino">
          <polygon points="70,22 80,35 60,35" fill="#f59e0b"/>
          <polygon points="90,24 100,38 80,38" fill="#f59e0b"/>
          <polygon points="110,32 120,46 100,46" fill="#f59e0b"/>
          <ellipse cx="78" cy="85" rx="52" ry="46" fill="#34d399" stroke="#059669" stroke-width="4"/>
          <circle cx="60" cy="55" r="6" fill="#10b981"/>
          <circle cx="95" cy="58" r="8" fill="#10b981"/>
          <circle cx="58" cy="74" r="10" fill="#ffffff" stroke="#059669" stroke-width="2"/>
          <circle cx="98" cy="74" r="10" fill="#ffffff" stroke="#059669" stroke-width="2"/>
          <circle cx="60" cy="74" r="5" fill="#1f2937"/>
          <circle cx="96" cy="74" r="5" fill="#1f2937"/>
          <circle cx="58" cy="72" r="2" fill="#ffffff"/>
          <circle cx="94" cy="72" r="2" fill="#ffffff"/>
          <circle cx="45" cy="92" r="7" fill="#fb7185" opacity="0.6"/>
          <circle cx="112" cy="92" r="7" fill="#fb7185" opacity="0.6"/>
          ${
            mouthOpen
              ? `<path d="M58,98 Q78,124 100,98 Z" fill="#b91c1c" stroke="#059669" stroke-width="2"/>
                 <polygon points="65,98 70,105 75,98" fill="#ffffff"/>
                 <polygon points="85,98 90,105 95,98" fill="#ffffff"/>`
              : `<path d="M60,100 Q78,114 98,100" stroke="#047857" stroke-width="4" fill="none" stroke-linecap="round"/>`
          }
        </svg>
      `,
    },

    robo: {
      id: 'robo',
      name: 'Robo Chintu',
      badge: '🤖 Robo Chintu',
      themeColor: '#06b6d4',
      pitch: 1.25,
      rate: 1.05,
      soundFx: 'boing',
      introPrefix: (sender) => `BEEP BOOP! Birthday greetings received from ${sender}! `,
      preferredVoiceNames: ['David', 'George', 'Microsoft'],
      intro: 'BEEP BOOP! Happy Birthday signal transmission activated!',
      renderSvg: (mouthOpen = false) => `
        <svg viewBox="0 0 160 160" class="toon-svg toon-robo">
          <line x1="80" y1="40" x2="80" y2="15" stroke="#0891b2" stroke-width="5" stroke-linecap="round"/>
          <circle cx="80" cy="14" r="9" fill="#f59e0b" stroke="#0891b2" stroke-width="2"/>
          <line x1="65" y1="20" x2="73" y2="28" stroke="#f59e0b" stroke-width="2"/>
          <line x1="95" y1="20" x2="87" y2="28" stroke="#f59e0b" stroke-width="2"/>
          <rect x="35" y="40" width="90" height="78" rx="20" fill="#22d3ee" stroke="#0e7490" stroke-width="4"/>
          <rect x="46" y="52" width="68" height="54" rx="12" fill="#0f172a"/>
          <rect x="55" y="62" width="16" height="12" rx="4" fill="#38ef7d"/>
          <rect x="89" y="62" width="16" height="12" rx="4" fill="#38ef7d"/>
          <rect x="25" y="65" width="10" height="22" rx="4" fill="#f59e0b"/>
          <rect x="125" y="65" width="10" height="22" rx="4" fill="#f59e0b"/>
          ${
            mouthOpen
              ? `<rect x="62" y="84" width="36" height="14" rx="4" fill="#f43f5e"/>
                 <line x1="68" y1="84" x2="68" y2="98" stroke="#ffffff" stroke-width="2"/>
                 <line x1="74" y1="84" x2="74" y2="98" stroke="#ffffff" stroke-width="2"/>
                 <line x1="80" y1="84" x2="80" y2="98" stroke="#ffffff" stroke-width="2"/>
                 <line x1="86" y1="84" x2="86" y2="98" stroke="#ffffff" stroke-width="2"/>`
              : `<line x1="62" y1="89" x2="98" y2="89" stroke="#38ef7d" stroke-width="4" stroke-linecap="round"/>`
          }
        </svg>
      `,
    },
  };

  let currentUtterance = null;
  let mouthInterval = null;

  function getAll() {
    return Object.values(characters);
  }

  function get(id) {
    return characters[id] || characters.mimi;
  }

  function getAvailableVoices() {
    refreshVoices();
    return cachedVoices;
  }

  function setUserVoice(voiceURI) {
    userPreferredVoiceURI = voiceURI;
  }

  function getBestHindiVoice() {
    refreshVoices();
    if (cachedVoices.length === 0) return null;
    return (
      cachedVoices.find((v) => (v.lang.startsWith('hi') || v.name.includes('Hindi')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))) ||
      cachedVoices.find((v) => v.lang.startsWith('hi') || v.name.includes('Hindi')) ||
      cachedVoices.find((v) => v.lang.includes('IN') || v.name.includes('India') || v.name.includes('Neerja') || v.name.includes('Prabhat')) ||
      cachedVoices.find((v) => v.name.includes('Natural') || v.name.includes('Google')) ||
      cachedVoices[0]
    );
  }

  // Smart Voice Picker: Always auto-selects Hindi/Natural Indian voice first
  function selectVoiceForCharacter(char) {
    refreshVoices();
    if (cachedVoices.length === 0) return null;

    // 1. If user explicitly picked a voice from dropdown
    if (userPreferredVoiceURI) {
      const userChoice = cachedVoices.find((v) => v.voiceURI === userPreferredVoiceURI);
      if (userChoice) return userChoice;
    }

    // 2. Highest priority: Auto-select Hindi voice so it sounds natural in Hindi/Hinglish!
    const bestHindi = getBestHindiVoice();
    if (bestHindi && (bestHindi.lang.startsWith('hi') || bestHindi.name.includes('Hindi') || bestHindi.lang.includes('IN'))) {
      return bestHindi;
    }

    // 3. Search for natural/high-quality voices based on character's preferred list
    for (const name of char.preferredVoiceNames) {
      const match = cachedVoices.find((v) => v.name.includes(name) || v.voiceURI.includes(name));
      if (match) return match;
    }

    // 4. Search for Natural / Online / Google voices
    const naturalVoice = cachedVoices.find(
      (v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online')
    );
    if (naturalVoice) return naturalVoice;

    // 5. Prefer female voice for mimi/fairy
    if (char.id === 'mimi' || char.id === 'fairy') {
      const female = cachedVoices.find((v) => v.name.includes('Zira') || v.name.includes('Female') || v.name.includes('Eva'));
      if (female) return female;
    }

    return cachedVoices[0];
  }

  let currentAudio = null;

  function fallbackWebSpeech(char, speechText, onMouthToggle, onComplete) {
    if (!('speechSynthesis' in window)) {
      cleanupMouth(onMouthToggle);
      if (onComplete) onComplete();
      return;
    }
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.pitch = char.pitch || 1.1;
    utterance.rate = char.rate || 1.0;

    const chosenVoice = selectVoiceForCharacter(char);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang || 'hi-IN';
    }

    let isOpen = false;
    utterance.onstart = () => {
      mouthInterval = setInterval(() => {
        isOpen = !isOpen;
        if (onMouthToggle) onMouthToggle(isOpen);
      }, 160);
    };

    utterance.onend = () => {
      cleanupMouth(onMouthToggle);
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      cleanupMouth(onMouthToggle);
      if (onComplete) onComplete();
    };

    currentUtterance = utterance;
    synth.speak(utterance);
  }

  // Speak with character
  function speak(characterId, text, onMouthToggle, onComplete, senderName = 'Family') {
    stopSpeaking();

    const char = get(characterId);

    // Play signature cartoon SoundFx sound before speech
    if (window.SoundFx && char.soundFx && typeof SoundFx[char.soundFx] === 'function') {
      SoundFx[char.soundFx]();
    }

    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const intro = char.introPrefix ? char.introPrefix(senderName) : '';
    const speechText = `${intro}${cleanText}`;

    // If user explicitly picked a custom browser voice from dropdown, use Web Speech API
    if (userPreferredVoiceURI) {
      fallbackWebSpeech(char, speechText, onMouthToggle, onComplete);
      return;
    }

    // Default: Use Free Google Cartoon TTS Audio API with playful playback speed
    const ttsUrl = `/api/tts?text=${encodeURIComponent(speechText)}&lang=hi`;
    const audio = new Audio(ttsUrl);
    audio.playbackRate = char.rate || 1.1;
    currentAudio = audio;

    let isOpen = false;
    audio.onplay = () => {
      mouthInterval = setInterval(() => {
        isOpen = !isOpen;
        if (onMouthToggle) onMouthToggle(isOpen);
      }, 160);
    };

    audio.onended = () => {
      cleanupMouth(onMouthToggle);
      currentAudio = null;
      if (onComplete) onComplete();
    };

    audio.onerror = (err) => {
      console.warn('Server TTS failed, falling back to Web Speech API', err);
      currentAudio = null;
      fallbackWebSpeech(char, speechText, onMouthToggle, onComplete);
    };

    audio.play().catch((err) => {
      console.warn('Audio play was prevented or failed, falling back to Web Speech', err);
      currentAudio = null;
      fallbackWebSpeech(char, speechText, onMouthToggle, onComplete);
    });
  }

  function cleanupMouth(onMouthToggle) {
    if (mouthInterval) {
      clearInterval(mouthInterval);
      mouthInterval = null;
    }
    if (onMouthToggle) onMouthToggle(false);
  }

  function stopSpeaking() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (mouthInterval) {
      clearInterval(mouthInterval);
      mouthInterval = null;
    }
    currentUtterance = null;
  }

  return {
    getAll,
    get,
    getAvailableVoices,
    setUserVoice,
    speak,
    stopSpeaking,
  };
})();
