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
    shinchan: {
      id: 'shinchan',
      name: 'Shinchan',
      badge: '👦 Shinchan',
      themeColor: '#ef4444',
      clipName: 'shinchan-intro',
      pitch: 1.35,
      rate: 1.30,
      soundFx: 'cartoonLaugh',
      voiceGender: 'male',
      introPrefix: (sender) => `Oye hoye! Shinchan laya hai ${sender} ka mast wish: `,
      preferredVoiceNames: ['Swara', 'Prabhat', 'Google हिन्दी'],
      intro: '🎉 Oye hoye! Main aa gaya birthday party lootne!',
      renderSvg: (mouthOpen = false) => `
        <svg viewBox="0 0 160 160" class="toon-svg toon-shinchan">
          <!-- Red Shirt Body -->
          <path d="M46,115 L38,155 L122,155 L114,115 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="3"/>
          <rect x="50" y="145" width="60" height="15" fill="#facc15"/>
          <!-- Chunky Round Face -->
          <ellipse cx="80" cy="72" rx="48" ry="42" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
          <!-- Ears -->
          <circle cx="32" cy="74" r="10" fill="#fed7aa" stroke="#c2410c" stroke-width="2.5"/>
          <circle cx="128" cy="74" r="10" fill="#fed7aa" stroke="#c2410c" stroke-width="2.5"/>
          <!-- Short Spiky Black Hair -->
          <path d="M35,60 C35,30 55,20 80,20 C105,20 125,30 125,60 C118,44 105,36 80,36 C55,36 42,44 35,60 Z" fill="#18181b"/>
          <!-- Iconic Thick Jet-Black Arched Eyebrows! -->
          <path d="M46,45 Q58,34 72,47" stroke="#18181b" stroke-width="7" stroke-linecap="round" fill="none"/>
          <path d="M88,47 Q102,34 114,45" stroke="#18181b" stroke-width="7" stroke-linecap="round" fill="none"/>
          <!-- Cheeky Eyes -->
          <ellipse cx="60" cy="62" rx="7.5" ry="9" fill="#18181b"/>
          <ellipse cx="100" cy="62" rx="7.5" ry="9" fill="#18181b"/>
          <circle cx="58" cy="59" r="2.5" fill="#ffffff"/>
          <circle cx="98" cy="59" r="2.5" fill="#ffffff"/>
          <!-- Rosy Cheeks -->
          <circle cx="48" cy="80" r="8" fill="#fb7185" opacity="0.6"/>
          <circle cx="112" cy="80" r="8" fill="#fb7185" opacity="0.6"/>
          <!-- Speaking Mouth -->
          ${
            mouthOpen
              ? `<path d="M64,82 Q80,114 96,82 Z" fill="#be123c" stroke="#881337" stroke-width="2.5"/>
                 <ellipse cx="80" cy="98" rx="6" ry="4" fill="#fb7185"/>`
              : `<path d="M66,84 Q80,100 94,84" stroke="#9f1239" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
          }
        </svg>
      `,
    },

    bheem: {
      id: 'bheem',
      name: 'Chhota Bheem',
      badge: '🦸 Chhota Bheem',
      themeColor: '#f97316',
      clipName: 'bheem-intro',
      pitch: 1.10,
      rate: 1.15,
      soundFx: 'heroFanfare',
      voiceGender: 'male',
      introPrefix: (sender) => `Dholakpur se Bheem laya hai ${sender} ka superpower wish: `,
      preferredVoiceNames: ['Prabhat', 'Madhur', 'Google हिन्दी'],
      intro: '🧆 Dholakpur ke laddoos aur super birthday wishes!',
      renderSvg: (mouthOpen = false) => `
        <svg viewBox="0 0 160 160" class="toon-svg toon-bheem">
          <!-- Torso with Gold Necklace -->
          <path d="M45,115 L35,155 L125,155 L115,115 Z" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
          <circle cx="80" cy="128" r="8" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
          <!-- Face -->
          <circle cx="80" cy="70" r="44" fill="#e0a96d" stroke="#8c5825" stroke-width="3"/>
          <!-- Hair & Topknot / Shikha -->
          <path d="M38,62 C36,32 55,24 80,24 C105,24 124,32 122,62 C115,44 100,38 80,38 C60,38 45,44 38,62 Z" fill="#262626"/>
          <circle cx="80" cy="18" r="10" fill="#262626"/>
          <!-- Red Tilak on Forehead -->
          <path d="M78,35 L82,35 L81,50 L79,50 Z" fill="#dc2626"/>
          <circle cx="80" cy="54" r="2.5" fill="#facc15"/>
          <!-- Big Friendly Eyes -->
          <ellipse cx="62" cy="65" rx="8" ry="10" fill="#ffffff" stroke="#8c5825" stroke-width="1.5"/>
          <ellipse cx="98" cy="65" rx="8" ry="10" fill="#ffffff" stroke="#8c5825" stroke-width="1.5"/>
          <circle cx="63" cy="65" r="5" fill="#3f2e18"/>
          <circle cx="97" cy="65" r="5" fill="#3f2e18"/>
          <circle cx="61" cy="62" r="2" fill="#ffffff"/>
          <circle cx="95" cy="62" r="2" fill="#ffffff"/>
          <!-- Motichoor Laddoo in Hand -->
          <circle cx="132" cy="120" r="14" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
          <circle cx="130" cy="118" r="2" fill="#ef4444"/>
          <circle cx="134" cy="122" r="2" fill="#ef4444"/>
          <!-- Smile / Speaking Mouth -->
          ${
            mouthOpen
              ? `<path d="M65,85 Q80,112 95,85 Z" fill="#991b1b" stroke="#5d1010" stroke-width="2.5"/>
                 <rect x="72" y="86" width="16" height="5" fill="#ffffff" rx="2"/>`
              : `<path d="M64,88 Q80,104 96,88" stroke="#7c2d12" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
          }
        </svg>
      `,
    },

    tom: {
      id: 'tom',
      name: 'Talking Tom',
      badge: '🐱 Talking Tom',
      themeColor: '#3b82f6',
      clipName: 'mimi-intro',
      pitch: 1.55,
      rate: 1.45,
      soundFx: 'boing',
      voiceGender: 'female',
      introPrefix: (sender) => `Meow meow! Talking Tom bol raha hai, ${sender} ne kaha: `,
      preferredVoiceNames: ['Swara', 'Ana', 'Google हिन्दी', 'Zira'],
      intro: '🐾 Meow! Repeat after me: Happy Birthday!',
      renderSvg: (mouthOpen = false) => `
        <svg viewBox="0 0 160 160" class="toon-svg toon-tom">
          <!-- Cat Ears -->
          <polygon points="35,62 18,18 68,42" fill="#64748b" stroke="#334155" stroke-width="3"/>
          <polygon points="38,58 28,28 62,44" fill="#cbd5e1"/>
          <polygon points="125,62 142,18 92,42" fill="#64748b" stroke="#334155" stroke-width="3"/>
          <polygon points="122,58 132,28 98,44" fill="#cbd5e1"/>
          <!-- Gray Cat Face -->
          <ellipse cx="80" cy="85" rx="54" ry="46" fill="#94a3b8" stroke="#334155" stroke-width="4"/>
          <ellipse cx="80" cy="98" rx="28" ry="20" fill="#e2e8f0"/>
          <!-- Big Green Glowing Eyes -->
          <ellipse cx="58" cy="74" rx="12" ry="15" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
          <ellipse cx="102" cy="74" rx="12" ry="15" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
          <ellipse cx="58" cy="74" rx="6" ry="12" fill="#0f172a"/>
          <ellipse cx="102" cy="74" rx="6" ry="12" fill="#0f172a"/>
          <circle cx="56" cy="70" r="3" fill="#ffffff"/>
          <circle cx="100" cy="70" r="3" fill="#ffffff"/>
          <!-- Cute Pink Nose -->
          <polygon points="80,92 74,86 86,86" fill="#f43f5e"/>
          <!-- Whiskers -->
          <line x1="22" y1="88" x2="48" y2="90" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="20" y1="98" x2="48" y2="96" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="138" y1="88" x2="112" y2="90" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="140" y1="98" x2="112" y2="96" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Talking Mouth -->
          ${
            mouthOpen
              ? `<path d="M68,98 Q80,122 92,98 Z" fill="#e11d48" stroke="#881337" stroke-width="2.5"/>
                 <ellipse cx="80" cy="110" rx="5" ry="3" fill="#fda4af"/>`
              : `<path d="M68,98 Q74,105 80,98 Q86,105 92,98" stroke="#334155" stroke-width="3" fill="none" stroke-linecap="round"/>`
          }
        </svg>
      `,
    },

    veer: {
      id: 'veer',
      name: 'Super Veer',
      badge: '🦸 Super Veer',
      themeColor: '#ef4444',
      clipName: 'veer-intro',
      pitch: 1.15, // Strong, heroic, confident pitch
      rate: 1.16,  // Energetic punchy superhero pace
      soundFx: 'heroFanfare',
      voiceGender: 'male',
      introPrefix: (sender) => `Dhoom dhadaka! Super Veer laya hai ${sender} ka superpower wish: `,
      preferredVoiceNames: ['Prabhat', 'Madhur', 'Google हिन्दी'],
      intro: '⚡ Dhoom Dhadaka! Superpowers unlocked today!',
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

    mimi: {
      id: 'mimi',
      name: 'Mimi The Kitty',
      badge: '🐱 Mimi Kitty',
      themeColor: '#ff5da2',
      clipName: 'mimi-intro',
      pitch: 1.6, // Cute high-pitched squeaky kitten voice
      rate: 1.40, // Fast playful kitten speed
      soundFx: 'sparkle',
      voiceGender: 'female',
      introPrefix: (sender) => `Meow meow! Suno sab log! ${sender} ne bheja hai pyara sa wish: `,
      preferredVoiceNames: ['Swara', 'Ana', 'Google हिन्दी', 'Zira', 'Heera', 'Jenny'],
      intro: '🐾 Meow-magical birthday wishes!',
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
      clipName: 'bhalu-intro',
      pitch: 0.62, // Deep, heavy, cuddly bear tone
      rate: 0.78, // Slow chubby bear pace
      soundFx: 'boing',
      voiceGender: 'male',
      introPrefix: (sender) => `Arre waah! Hahaha! Suno mere pyare champ, ${sender} bol rahe hain: `,
      preferredVoiceNames: ['Madhur', 'Prabhat', 'Ravi', 'Guy', 'Google हिन्दी'],
      intro: '🍯 Bhalu Dada ki taraf se dher saara aashirwaad aur chocolate!',
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
      clipName: 'fairy-intro',
      pitch: 1.45, // Sweet, light, magical fairy tone
      rate: 1.32,
      soundFx: 'sparkle',
      voiceGender: 'female',
      introPrefix: (sender) => `Chhoo mantar! Chamakti pari aayi hai, aur ${sender} ne kaha hai: `,
      preferredVoiceNames: ['Neerja', 'Swara', 'Jenny', 'Google हिन्दी'],
      intro: '✨ May all your magical dreams come true today!',
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

    dino: {
      id: 'dino',
      name: 'Dino Rex',
      badge: '🦖 Dino Rex',
      themeColor: '#10b981',
      clipName: 'dino-intro',
      pitch: 0.68, // Goofy, low, bouncy dinosaur rumble
      rate: 0.82,  // Deep funny giant pace
      soundFx: 'dinoRoar',
      voiceGender: 'male',
      introPrefix: (sender) => `Roaaar! Ohooo! Mazedaar din hai! ${sender} kehte hain: `,
      preferredVoiceNames: ['Madhur', 'Prabhat', 'Google हिन्दी'],
      intro: '🦖 ROAAAR! Happy Birthday to the coolest champion!',
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
      clipName: 'robo-intro',
      pitch: 1.35, // Monotone electronic robot pitch
      rate: 1.22,  // Measured mechanical pace
      soundFx: 'robotBeep',
      voiceGender: 'robot',
      introPrefix: (sender) => `BEEP BOOP! Birthday greetings received from ${sender}! `,
      preferredVoiceNames: ['David', 'George', 'Microsoft'],
      intro: '⚡ BEEP BOOP! Happy Birthday signal transmission activated!',
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

  // Backwards-compatible aliases
  characters.mimi = characters.tom;
  characters.superhero = characters.veer;
  characters.fairy = characters.bheem;
  characters.dino = characters.shinchan;

  let currentUtterance = null;
  let mouthInterval = null;

  function getAll() {
    return [
      characters.shinchan,
      characters.bheem,
      characters.veer,
      characters.tom,
      characters.bhalu,
      characters.robo,
    ];
  }

  function get(id) {
    if (id === 'mimi') return characters.tom;
    if (id === 'superhero') return characters.veer;
    if (id === 'fairy') return characters.bheem;
    if (id === 'dino') return characters.shinchan;
    return characters[id] || characters.shinchan;
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

  // Smart Voice Picker: Picks gender-matched Hindi voices for distinct cartoon characters
  function selectVoiceForCharacter(char) {
    refreshVoices();
    if (cachedVoices.length === 0) return null;

    // 1. If user explicitly picked a voice from dropdown
    if (userPreferredVoiceURI) {
      const userChoice = cachedVoices.find((v) => v.voiceURI === userPreferredVoiceURI);
      if (userChoice) return userChoice;
    }

    const hindiVoices = cachedVoices.filter(
      (v) => (v.lang && v.lang.startsWith('hi')) || (v.name && v.name.toLowerCase().includes('hindi'))
    );

    // 2. Select female Hindi voice for female characters (Mimi, Pari)
    if (char.voiceGender === 'female') {
      const femaleHindi = hindiVoices.find(
        (v) => v.name.includes('Swara') || v.name.includes('Female') || v.name.includes('Google हिन्दी') || v.name.includes('Heera')
      );
      if (femaleHindi) return femaleHindi;
      const anyFemale = cachedVoices.find(
        (v) => v.name.includes('Zira') || v.name.includes('Jenny') || v.name.includes('Female')
      );
      if (anyFemale) return anyFemale;
    } else if (char.voiceGender === 'male') {
      // 3. Select male/deep Hindi voice for male characters (Bhalu, Superhero, Dino)
      const maleHindi = hindiVoices.find(
        (v) => v.name.includes('Madhur') || v.name.includes('Male') || v.name.includes('Prabhat') || v.name.includes('Ravi')
      );
      if (maleHindi) return maleHindi;
      const anyMale = cachedVoices.find(
        (v) => v.name.includes('David') || v.name.includes('Guy') || v.name.includes('Male')
      );
      if (anyMale) return anyMale;
    }

    const bestHindi = getBestHindiVoice();
    if (bestHindi) return bestHindi;

    return cachedVoices[0];
  }

  let currentAudio = null;

  // Real-time Web Audio API cartoon voice filter sculptor with pitch warping (Option 3)
  function applyCharacterAudioFilter(audio, char) {
    try {
      audio.preservesPitch = false;
      audio.mozPreservesPitch = false;
      audio.webkitPreservesPitch = false;
    } catch (e) {
      console.log('preservesPitch flag setting', e);
    }
    audio.playbackRate = char.rate || 1.0;
    audio.crossOrigin = 'anonymous';

    if (!window.AudioContext && !window.webkitAudioContext) return;

    try {
      const ac = window.SoundFx && SoundFx.getAudioContext ? SoundFx.getAudioContext() : new (window.AudioContext || window.webkitAudioContext)();
      if (!ac || audio._connectedToAudioContext) return;

      const source = ac.createMediaElementSource(audio);
      audio._connectedToAudioContext = true;

      if (char.id === 'robo') {
        // Metallic robotic droid voice (1150Hz bandpass filter + boost)
        const filter = ac.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1150, ac.currentTime);
        filter.Q.setValueAtTime(5.0, ac.currentTime);

        const gain = ac.createGain();
        gain.gain.setValueAtTime(2.2, ac.currentTime);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ac.destination);
      } else if (char.id === 'bhalu' || char.id === 'dino') {
        // Deep heavy cuddly bear rumble
        const lowpass = ac.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(1500, ac.currentTime);

        const bassBoost = ac.createBiquadFilter();
        bassBoost.type = 'lowshelf';
        bassBoost.frequency.setValueAtTime(320, ac.currentTime);
        bassBoost.gain.setValueAtTime(8.5, ac.currentTime);

        source.connect(bassBoost);
        bassBoost.connect(lowpass);
        lowpass.connect(ac.destination);
      } else if (char.id === 'tom' || char.id === 'mimi') {
        // Talking Tom Squeaky playful voice
        const highpass = ac.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.setValueAtTime(320, ac.currentTime);

        const trebleBoost = ac.createBiquadFilter();
        trebleBoost.type = 'highshelf';
        trebleBoost.frequency.setValueAtTime(2500, ac.currentTime);
        trebleBoost.gain.setValueAtTime(6.0, ac.currentTime);

        source.connect(highpass);
        highpass.connect(trebleBoost);
        trebleBoost.connect(ac.destination);
      } else if (char.id === 'shinchan') {
        // Shinchan: Cheeky, bright naughty boy presence
        const midBoost = ac.createBiquadFilter();
        midBoost.type = 'peaking';
        midBoost.frequency.setValueAtTime(1800, ac.currentTime);
        midBoost.gain.setValueAtTime(6.0, ac.currentTime);

        source.connect(midBoost);
        midBoost.connect(ac.destination);
      } else if (char.id === 'bheem') {
        // Chhota Bheem: Warm, heroic presence
        const presence = ac.createBiquadFilter();
        presence.type = 'peaking';
        presence.frequency.setValueAtTime(1400, ac.currentTime);
        presence.gain.setValueAtTime(5.0, ac.currentTime);

        source.connect(presence);
        presence.connect(ac.destination);
      } else {
        // Super Veer - Dynamic crisp presence boost
        const presence = ac.createBiquadFilter();
        presence.type = 'peaking';
        presence.frequency.setValueAtTime(1600, ac.currentTime);
        presence.gain.setValueAtTime(4.0, ac.currentTime);

        source.connect(presence);
        presence.connect(ac.destination);
      }
    } catch (e) {
      console.log('Audio filter passthrough', e);
    }
  }

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
      }, 150);
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

  // Speak with character (Option 3: Pre-made Cute Cartoon Voice Clips & Real Voice Acting)
  function speak(characterId, text, onMouthToggle, onComplete, senderName = 'Family') {
    stopSpeaking();

    const char = get(characterId);

    // 1. Play character's signature SoundFx sound
    if (window.SoundFx && char.soundFx && typeof SoundFx[char.soundFx] === 'function') {
      SoundFx[char.soundFx]();
    }

    // 2. Start soft cartoon party background music
    if (window.SoundFx && SoundFx.startCartoonBGM) {
      SoundFx.startCartoonBGM();
    }

    // If user explicitly picked a custom browser voice from dropdown, use Web Speech API
    if (userPreferredVoiceURI) {
      const cleanText = (text || '').replace(/<[^>]*>?/gm, '');
      const intro = char.introPrefix ? char.introPrefix(senderName) : '';
      fallbackWebSpeech(char, `${intro}${cleanText}`, onMouthToggle, () => {
        if (window.SoundFx && SoundFx.stopCartoonBGM) SoundFx.stopCartoonBGM();
        if (onComplete) onComplete();
      });
      return;
    }

    // 3. Option 3: Play Pre-Made Animated Cartoon Voice Acting Clip
    const clipUrl = `/assets/audio/${char.clipName || 'veer-intro'}.mp3`;
    const introAudio = new Audio(clipUrl);
    applyCharacterAudioFilter(introAudio, char);
    currentAudio = introAudio;

    let isOpen = false;
    introAudio.onplay = () => {
      mouthInterval = setInterval(() => {
        isOpen = !isOpen;
        if (onMouthToggle) onMouthToggle(isOpen);
      }, 150);
    };

    const finishPresentation = () => {
      cleanupMouth(onMouthToggle);
      currentAudio = null;
      if (window.SoundFx && SoundFx.stopCartoonBGM) SoundFx.stopCartoonBGM();
      if (window.SoundFx && SoundFx.cheer) SoundFx.cheer();
      if (onComplete) onComplete();
    };

    introAudio.onended = () => {
      const cleanText = (text || '').replace(/<[^>]*>?/gm, '').trim();

      // If there is a personalized wish message to speak after the intro clip
      if (cleanText && cleanText.length > 0 && !cleanText.toLowerCase().includes('happy birthday to you champ!')) {
        const msgText = `${senderName ? senderName + ' ne kaha: ' : ''}${cleanText}`;
        const ttsUrl = `/api/tts?text=${encodeURIComponent(msgText)}&lang=hi`;
        const msgAudio = new Audio(ttsUrl);
        applyCharacterAudioFilter(msgAudio, char);
        currentAudio = msgAudio;

        msgAudio.onended = finishPresentation;
        msgAudio.onerror = finishPresentation;
        msgAudio.play().catch((err) => {
          console.warn('Message TTS playback issue', err);
          finishPresentation();
        });
      } else {
        finishPresentation();
      }
    };

    introAudio.onerror = (err) => {
      console.warn('Clip playback failed, falling back to TTS / WebSpeech', err);
      const cleanText = (text || '').replace(/<[^>]*>?/gm, '').trim() || 'Happy Birthday!';
      const intro = char.introPrefix ? char.introPrefix(senderName) : '';
      const speechText = `${intro}${cleanText}`;

      const ttsUrl = `/api/tts?text=${encodeURIComponent(speechText)}&lang=hi`;
      const fallbackAudio = new Audio(ttsUrl);
      applyCharacterAudioFilter(fallbackAudio, char);
      currentAudio = fallbackAudio;

      fallbackAudio.onended = finishPresentation;
      fallbackAudio.onerror = () => {
        fallbackWebSpeech(char, speechText, onMouthToggle, finishPresentation);
      };
      fallbackAudio.play().catch(() => {
        fallbackWebSpeech(char, speechText, onMouthToggle, finishPresentation);
      });
    };

    introAudio.play().catch((err) => {
      console.warn('Audio play was prevented or failed', err);
      introAudio.onerror(err);
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
    if (window.SoundFx && SoundFx.stopCartoonBGM) {
      SoundFx.stopCartoonBGM();
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
