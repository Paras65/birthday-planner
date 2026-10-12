/**
 * HeroRig: Animated Superhero & Cartoon Companion SVG Rig Generator
 * Mounts the kid's face into 5 different hero costumes & renders companions
 */

const HeroRig = (() => {
  let activeAudio = null;

  // 1. Render Hero Costume with Kid Face
  function render(theme, faceUrl, isMouthOpen = false) {
    const faceImage = faceUrl || '/assets/default-hero.svg';

    switch (theme) {
      case 'space':
        return `
          <svg viewBox="0 0 240 280" class="hero-suit-svg hero-space" width="100%" height="100%">
            <!-- Jetpack Flames -->
            <polygon points="65,220 55,260 75,240" fill="#f59e0b" opacity="0.9"/>
            <polygon points="175,220 165,240 185,260" fill="#f59e0b" opacity="0.9"/>
            <polygon points="65,220 60,250 70,235" fill="#ef4444"/>
            <polygon points="175,220 170,235 180,250" fill="#ef4444"/>

            <!-- Jetpack Tanks -->
            <rect x="50" y="140" width="28" height="85" rx="14" fill="#94a3b8" stroke="#475569" stroke-width="3"/>
            <rect x="162" y="140" width="28" height="85" rx="14" fill="#94a3b8" stroke="#475569" stroke-width="3"/>

            <!-- Astronaut Body Suit -->
            <path d="M70,140 Q120,130 170,140 L180,240 Q120,250 60,240 Z" fill="#f8fafc" stroke="#334155" stroke-width="4"/>
            <!-- Blue Suit Details & Chest Panel -->
            <rect x="95" y="155" width="50" height="35" rx="8" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
            <circle cx="110" cy="172" r="6" fill="#ef4444"/>
            <circle cx="130" cy="172" r="6" fill="#22c55e"/>
            <!-- Belt -->
            <rect x="80" y="210" width="80" height="14" rx="4" fill="#0f172a"/>
            <circle cx="120" cy="217" r="7" fill="#f59e0b"/>

            <!-- Arms & Space Gloves -->
            <path d="M70,150 L38,195" stroke="#f8fafc" stroke-width="20" stroke-linecap="round"/>
            <path d="M70,150 L38,195" stroke="#334155" stroke-width="4" stroke-linecap="round" fill="none"/>
            <circle cx="34" cy="200" r="14" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3"/>

            <path d="M170,150 L202,195" stroke="#f8fafc" stroke-width="20" stroke-linecap="round"/>
            <path d="M170,150 L202,195" stroke="#334155" stroke-width="4" stroke-linecap="round" fill="none"/>
            <circle cx="206" cy="200" r="14" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3"/>

            <!-- Space Helmet Glass Bubble -->
            <circle cx="120" cy="95" r="76" fill="#e0f2fe" opacity="0.4" stroke="#0284c7" stroke-width="5"/>
            <ellipse cx="98" cy="65" rx="20" ry="10" fill="#ffffff" opacity="0.6" transform="rotate(-30 98 65)"/>

            <!-- Kid's Photo / Face inside helmet -->
            <clipPath id="spaceFaceClip">
              <circle cx="120" cy="98" r="54"/>
            </clipPath>
            <image href="${faceImage}" x="66" y="44" width="108" height="108" clip-path="url(#spaceFaceClip)" preserveAspectRatio="xMidYMid slice"/>

            <!-- Helmet Antenna -->
            <line x1="120" y1="20" x2="120" y2="2" stroke="#0284c7" stroke-width="4"/>
            <circle cx="120" cy="2" r="7" fill="#ef4444"/>
          </svg>
        `;

      case 'kingdom':
        return `
          <svg viewBox="0 0 240 280" class="hero-suit-svg hero-kingdom" width="100%" height="100%">
            <!-- Royal Velvet Cape Behind -->
            <path d="M50,130 C20,200 30,260 50,270 C80,270 160,270 190,270 C210,260 220,200 190,130 Z" fill="#9333ea" stroke="#581c87" stroke-width="3"/>
            <!-- Ermine Fur Cape Collar -->
            <path d="M68,135 Q120,150 172,135 Q120,120 68,135 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>

            <!-- Royal Tunic / Armor -->
            <path d="M75,135 Q120,130 165,135 L175,245 Q120,255 65,245 Z" fill="#fbbf24" stroke="#b45309" stroke-width="3"/>
            <polygon points="120,145 132,168 120,190 108,168" fill="#ef4444"/>
            <rect x="75" y="215" width="90" height="14" rx="4" fill="#78350f"/>
            <circle cx="120" cy="222" r="8" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>

            <!-- Arms & Golden Scepter -->
            <path d="M72,145 L45,190" stroke="#f59e0b" stroke-width="18" stroke-linecap="round"/>
            <circle cx="42" cy="195" r="11" fill="#fed7aa"/>

            <path d="M168,145 L195,190" stroke="#f59e0b" stroke-width="18" stroke-linecap="round"/>
            <circle cx="198" cy="195" r="11" fill="#fed7aa"/>
            <!-- Magic Star Wand in Hand -->
            <line x1="198" y1="210" x2="204" y2="135" stroke="#f59e0b" stroke-width="5"/>
            <polygon points="204,125 208,135 218,135 210,142 214,152 204,145 194,152 198,142 190,135 200,135" fill="#facc15"/>

            <!-- Kid's Photo / Face -->
            <clipPath id="kingdomFaceClip">
              <circle cx="120" cy="85" r="52"/>
            </clipPath>
            <circle cx="120" cy="85" r="54" fill="#ffffff" stroke="#f59e0b" stroke-width="4"/>
            <image href="${faceImage}" x="68" y="33" width="104" height="104" clip-path="url(#kingdomFaceClip)" preserveAspectRatio="xMidYMid slice"/>

            <!-- Golden Royalty Crown on Top -->
            <polygon points="80,48 90,20 105,38 120,12 135,38 150,20 160,48" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
            <circle cx="120" cy="12" r="5" fill="#ef4444"/>
            <circle cx="90" cy="20" r="4" fill="#3b82f6"/>
            <circle cx="150" cy="20" r="4" fill="#3b82f6"/>
          </svg>
        `;

      case 'jungle':
        return `
          <svg viewBox="0 0 240 280" class="hero-suit-svg hero-jungle" width="100%" height="100%">
            <!-- Jungle Safari Vest Body -->
            <path d="M70,130 Q120,125 170,130 L180,240 Q120,248 60,240 Z" fill="#84cc16" stroke="#4d7c0f" stroke-width="4"/>
            <!-- Pockets & Compass Badge -->
            <rect x="80" y="155" width="28" height="24" rx="4" fill="#65a30d" stroke="#365314" stroke-width="2"/>
            <rect x="132" y="155" width="28" height="24" rx="4" fill="#65a30d" stroke="#365314" stroke-width="2"/>
            <circle cx="120" cy="190" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
            <line x1="120" y1="184" x2="120" y2="196" stroke="#ef4444" stroke-width="2"/>
            <line x1="114" y1="190" x2="126" y2="190" stroke="#3b82f6" stroke-width="2"/>

            <!-- Arms -->
            <path d="M70,140 L40,185" stroke="#fed7aa" stroke-width="16" stroke-linecap="round"/>
            <circle cx="36" cy="190" r="12" fill="#fed7aa"/>
            <path d="M170,140 L200,185" stroke="#fed7aa" stroke-width="16" stroke-linecap="round"/>
            <circle cx="204" cy="190" r="12" fill="#fed7aa"/>

            <!-- Kid's Photo / Face -->
            <clipPath id="jungleFaceClip">
              <circle cx="120" cy="85" r="52"/>
            </clipPath>
            <circle cx="120" cy="85" r="54" fill="#ffffff" stroke="#65a30d" stroke-width="4"/>
            <image href="${faceImage}" x="68" y="33" width="104" height="104" clip-path="url(#jungleFaceClip)" preserveAspectRatio="xMidYMid slice"/>

            <!-- Safari Explorer Pith Hat -->
            <path d="M50,55 C50,25 90,18 120,18 C150,18 190,25 190,55 C165,48 140,46 120,46 C100,46 75,48 50,55 Z" fill="#d97706" stroke="#92400e" stroke-width="3"/>
            <ellipse cx="120" cy="55" rx="72" ry="14" fill="#f59e0b" stroke="#92400e" stroke-width="3"/>
            <rect x="75" y="44" width="90" height="8" fill="#84cc16"/>
          </svg>
        `;

      case 'racer':
        return `
          <svg viewBox="0 0 240 280" class="hero-suit-svg hero-racer" width="100%" height="100%">
            <!-- Racing Suit Body -->
            <path d="M70,135 Q120,130 170,135 L180,240 Q120,248 60,240 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="4"/>
            <!-- Checker Flag Stripes on Torso -->
            <rect x="110" y="135" width="20" height="95" fill="#ffffff"/>
            <rect x="110" y="145" width="10" height="10" fill="#18181b"/>
            <rect x="120" y="155" width="10" height="10" fill="#18181b"/>
            <rect x="110" y="165" width="10" height="10" fill="#18181b"/>
            <rect x="120" y="175" width="10" height="10" fill="#18181b"/>
            <rect x="110" y="185" width="10" height="10" fill="#18181b"/>
            <rect x="120" y="195" width="10" height="10" fill="#18181b"/>

            <!-- Arms & Steering Wheel -->
            <path d="M70,140 L45,185" stroke="#ef4444" stroke-width="16" stroke-linecap="round"/>
            <circle cx="40" cy="190" r="12" fill="#18181b"/>
            <path d="M170,140 L195,185" stroke="#ef4444" stroke-width="16" stroke-linecap="round"/>
            <circle cx="200" cy="190" r="12" fill="#18181b"/>

            <!-- Kid's Photo / Face -->
            <clipPath id="racerFaceClip">
              <circle cx="120" cy="85" r="52"/>
            </clipPath>
            <circle cx="120" cy="85" r="54" fill="#ffffff" stroke="#ef4444" stroke-width="4"/>
            <image href="${faceImage}" x="68" y="33" width="104" height="104" clip-path="url(#racerFaceClip)" preserveAspectRatio="xMidYMid slice"/>

            <!-- Racing Helmet Visor on forehead -->
            <path d="M68,55 Q120,25 172,55 L168,72 Q120,45 72,72 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
            <circle cx="120" cy="48" r="8" fill="#18181b"/>
            <text x="120" y="52" fill="#ffffff" font-size="10" font-weight="900" text-anchor="middle">1</text>
          </svg>
        `;

      case 'cosmic':
      default:
        return `
          <svg viewBox="0 0 240 280" class="hero-suit-svg hero-cosmic" width="100%" height="100%">
            <!-- Fluttering Superhero Cape Behind -->
            <path d="M55,130 C20,180 15,260 40,270 C70,270 170,270 200,270 C225,260 220,180 185,130 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="4"/>

            <!-- Glowing Superhero Suit Torso -->
            <path d="M70,135 Q120,128 170,135 L178,242 Q120,250 62,242 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="4"/>
            <!-- Golden Chest Emblem (Star Badge) -->
            <polygon points="120,148 126,164 142,164 130,174 134,190 120,180 106,190 110,174 98,164 114,164" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>

            <!-- Golden Belt -->
            <rect x="74" y="210" width="92" height="15" rx="4" fill="#f59e0b"/>
            <circle cx="120" cy="217" r="9" fill="#ef4444"/>

            <!-- Muscular Hero Arms (Power Posing!) -->
            <path d="M70,142 L35,185" stroke="#2563eb" stroke-width="20" stroke-linecap="round"/>
            <path d="M70,142 L35,185" stroke="#1d4ed8" stroke-width="3" stroke-linecap="round" fill="none"/>
            <circle cx="30" cy="190" r="14" fill="#f59e0b" stroke="#d97706" stroke-width="3"/>

            <path d="M170,142 L205,185" stroke="#2563eb" stroke-width="20" stroke-linecap="round"/>
            <path d="M170,142 L205,185" stroke="#1d4ed8" stroke-width="3" stroke-linecap="round" fill="none"/>
            <circle cx="210" cy="190" r="14" fill="#f59e0b" stroke="#d97706" stroke-width="3"/>

            <!-- Kid's Photo / Face -->
            <clipPath id="cosmicFaceClip">
              <circle cx="120" cy="85" r="52"/>
            </clipPath>
            <circle cx="120" cy="85" r="55" fill="#ffffff" stroke="#f59e0b" stroke-width="5"/>
            <image href="${faceImage}" x="68" y="33" width="104" height="104" clip-path="url(#cosmicFaceClip)" preserveAspectRatio="xMidYMid slice"/>

            <!-- Golden Super Hero Mask on Eyes -->
            <path d="M75,76 Q120,62 165,76 Q170,88 158,92 Q120,80 82,92 Q70,88 75,76 Z" fill="#f59e0b" opacity="0.9" stroke="#b45309" stroke-width="2"/>
            <polygon points="120,54 122,60 128,60 123,64 125,70 120,66 115,70 117,64 112,60 118,60" fill="#facc15"/>
          </svg>
        `;
    }
  }

  // 2. Render Cartoon Companion Rigs
  function renderCompanion(sidekickId, isSpeaking = false) {
    switch (sidekickId) {
      case 'bheem':
        return `
          <svg viewBox="0 0 160 180" class="toon-svg toon-bheem" width="100%" height="100%">
            <!-- Torso with Gold Necklace -->
            <path d="M45,115 L35,165 L125,165 L115,115 Z" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
            <circle cx="80" cy="130" r="8" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
            <!-- Round Cheerful Face -->
            <circle cx="80" cy="70" r="44" fill="#e0a96d" stroke="#8c5825" stroke-width="3"/>
            <!-- Hair & Topknot Shikha -->
            <path d="M38,62 C36,32 55,24 80,24 C105,24 124,32 122,62 C115,44 100,38 80,38 C60,38 45,44 38,62 Z" fill="#262626"/>
            <circle cx="80" cy="18" r="10" fill="#262626"/>
            <!-- Tilak -->
            <path d="M78,35 L82,35 L81,50 L79,50 Z" fill="#dc2626"/>
            <circle cx="80" cy="54" r="2.5" fill="#facc15"/>
            <!-- Big Eyes -->
            <ellipse cx="62" cy="65" rx="8" ry="10" fill="#ffffff" stroke="#8c5825" stroke-width="1.5"/>
            <ellipse cx="98" cy="65" rx="8" ry="10" fill="#ffffff" stroke="#8c5825" stroke-width="1.5"/>
            <circle cx="63" cy="65" r="5" fill="#3f2e18"/>
            <circle cx="97" cy="65" r="5" fill="#3f2e18"/>
            <!-- Motichoor Laddoo -->
            <circle cx="132" cy="120" r="14" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
            <circle cx="130" cy="118" r="2" fill="#ef4444"/>
            <circle cx="134" cy="122" r="2" fill="#ef4444"/>
            <!-- Mouth -->
            ${
              isSpeaking
                ? `<path d="M65,85 Q80,114 95,85 Z" fill="#991b1b" stroke="#5d1010" stroke-width="2.5"/>
                   <rect x="72" y="86" width="16" height="5" fill="#ffffff" rx="2"/>`
                : `<path d="M64,88 Q80,104 96,88" stroke="#7c2d12" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
            }
          </svg>
        `;

      case 'tom':
        return `
          <svg viewBox="0 0 160 180" class="toon-svg toon-tom" width="100%" height="100%">
            <!-- Cat Body -->
            <ellipse cx="80" cy="145" rx="42" ry="32" fill="#94a3b8" stroke="#334155" stroke-width="3"/>
            <!-- Cat Ears -->
            <polygon points="35,62 18,18 68,42" fill="#64748b" stroke="#334155" stroke-width="3"/>
            <polygon points="38,58 28,28 62,44" fill="#cbd5e1"/>
            <polygon points="125,62 142,18 92,42" fill="#64748b" stroke="#334155" stroke-width="3"/>
            <polygon points="122,58 132,28 98,44" fill="#cbd5e1"/>
            <!-- Gray Face -->
            <ellipse cx="80" cy="85" rx="54" ry="46" fill="#94a3b8" stroke="#334155" stroke-width="4"/>
            <ellipse cx="80" cy="98" rx="28" ry="20" fill="#e2e8f0"/>
            <!-- Green Glowing Eyes -->
            <ellipse cx="58" cy="74" rx="12" ry="15" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
            <ellipse cx="102" cy="74" rx="12" ry="15" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
            <ellipse cx="58" cy="74" rx="6" ry="12" fill="#0f172a"/>
            <ellipse cx="102" cy="74" rx="6" ry="12" fill="#0f172a"/>
            <circle cx="56" cy="70" r="3" fill="#ffffff"/>
            <circle cx="100" cy="70" r="3" fill="#ffffff"/>
            <!-- Pink Nose -->
            <polygon points="80,92 74,86 86,86" fill="#f43f5e"/>
            <!-- Whiskers -->
            <line x1="22" y1="88" x2="48" y2="90" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="20" y1="98" x2="48" y2="96" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="138" y1="88" x2="112" y2="90" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="140" y1="98" x2="112" y2="96" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Talking Mouth -->
            ${
              isSpeaking
                ? `<path d="M68,98 Q80,122 92,98 Z" fill="#e11d48" stroke="#881337" stroke-width="2.5"/>`
                : `<path d="M68,98 Q74,105 80,98 Q86,105 92,98" stroke="#334155" stroke-width="3" fill="none" stroke-linecap="round"/>`
            }
          </svg>
        `;

      case 'chintu':
        return `
          <svg viewBox="0 0 160 180" class="toon-svg toon-chintu" width="100%" height="100%">
            <!-- Hover Thruster Flame -->
            <polygon points="70,145 80,175 90,145" fill="#38bdf8"/>
            <polygon points="74,145 80,165 86,145" fill="#ffffff"/>
            <!-- Robot Body -->
            <rect x="42" y="55" width="76" height="70" rx="18" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
            <!-- Screen Face -->
            <rect x="52" y="66" width="56" height="42" rx="10" fill="#0f172a"/>
            <!-- Glowing LED Eyes -->
            <circle cx="68" cy="84" r="6" fill="#4ade80"/>
            <circle cx="92" cy="84" r="6" fill="#4ade80"/>
            <!-- Antenna -->
            <line x1="80" y1="55" x2="80" y2="30" stroke="#0284c7" stroke-width="3"/>
            <circle cx="80" cy="26" r="6" fill="#f59e0b"/>
            <!-- Mouth -->
            ${
              isSpeaking
                ? `<rect x="66" y="96" width="28" height="8" rx="3" fill="#f43f5e"/>`
                : `<line x1="68" y1="100" x2="92" y2="100" stroke="#4ade80" stroke-width="3" stroke-linecap="round"/>`
            }
          </svg>
        `;

      case 'shinchan':
      default:
        return `
          <svg viewBox="0 0 160 180" class="toon-svg toon-shinchan" width="100%" height="100%">
            <!-- Red Shirt Body -->
            <path d="M46,115 L38,165 L122,165 L114,115 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="3"/>
            <rect x="50" y="152" width="60" height="15" fill="#facc15"/>
            <!-- Chunky Round Face -->
            <ellipse cx="80" cy="72" rx="48" ry="42" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
            <!-- Ears -->
            <circle cx="32" cy="74" r="10" fill="#fed7aa" stroke="#c2410c" stroke-width="2.5"/>
            <circle cx="128" cy="74" r="10" fill="#fed7aa" stroke="#c2410c" stroke-width="2.5"/>
            <!-- Short Black Hair -->
            <path d="M35,60 C35,30 55,20 80,20 C105,20 125,30 125,60 C118,44 105,36 80,36 C55,36 42,44 35,60 Z" fill="#18181b"/>
            <!-- Iconic Arched Eyebrows -->
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
            <!-- Mouth -->
            ${
              isSpeaking
                ? `<path d="M64,82 Q80,114 96,82 Z" fill="#be123c" stroke="#881337" stroke-width="2.5"/>
                   <ellipse cx="80" cy="98" rx="6" ry="4" fill="#fb7185"/>`
                : `<path d="M66,84 Q80,100 94,84" stroke="#9f1239" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
            }
          </svg>
        `;
    }
  }

  // 3. Audio Narration Player (with Google TTS + Web Speech API fallback)
  function narrate(text, onStart, onEnd) {
    stopNarration();
    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      return;
    }

    if (onStart) onStart();

    // 1. Try Google TTS API stream first
    const ttsUrl = `/api/tts?lang=hi&text=${encodeURIComponent(text.substring(0, 300))}`;
    const audio = new Audio(ttsUrl);

    audio.onended = () => {
      activeAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      console.warn('Google TTS stream failed, fallback to Web Speech API');
      // Fallback: Web Speech API
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'hi-IN';
        utter.rate = 1.05;
        utter.pitch = 1.1;

        utter.onend = () => {
          if (onEnd) onEnd();
        };
        utter.onerror = () => {
          if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utter);
      } else {
        if (onEnd) onEnd();
      }
    };

    activeAudio = audio;
    audio.play().catch((e) => {
      console.log('Autoplay blocked or waiting for user tap', e);
      if (onEnd) onEnd();
    });
  }

  function stopNarration() {
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch (e) {}
      activeAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  return {
    render,
    renderCompanion,
    narrate,
    stopNarration,
  };
})();
