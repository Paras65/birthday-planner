/**
 * Showtime Controller - Grand birthday presentation: Cake & candles, cartoon stage lip-sync, kid reactions, grand finale dance, scrapbook
 */
document.addEventListener('DOMContentLoaded', () => {
  const partyId = AppUtils.getQueryParam('party');

  // If no partyId in URL
  if (!partyId) {
    document.querySelector('.showtime-page-shell').innerHTML = `
      <div class="cake-section" style="margin-top: 40px;">
        <h2 style="color: #ef4444; font-size: 2rem; margin-bottom: 12px;">⚠️ Birthday Room Link Not Found</h2>
        <p style="color: #64748b; font-size: 1.15rem; margin-bottom: 24px;">Kripya WhatsApp par share kiya gaya valid link open karein ya Home page se naya celebration room banayein.</p>
        <a href="/" class="btn btn-primary" style="font-size: 1.1rem;">🏠 Go to Home / Create Party</a>
      </div>
    `;
    return;
  }

  // State
  let party = null;
  let wishes = [];
  let currentWishIndex = 0;
  let candlesBlown = false;
  let isPlayingWish = false;

  // DOM Elements
  const kidNameHeader = document.getElementById('kidNameHeader');
  const stageKidName = document.getElementById('stageKidName');
  const stageAge = document.getElementById('stageAge');
  const cakeSection = document.getElementById('cakeSection');
  const candlesContainer = document.getElementById('candlesContainer');
  const blowCandlesBtn = document.getElementById('blowCandlesBtn');
  const micBlowBtn = document.getElementById('micBlowBtn');
  const startShowBtn = document.getElementById('startShowBtn');
  const stageSection = document.getElementById('stageSection');
  const curtainLeft = document.getElementById('curtainLeft');
  const curtainRight = document.getElementById('curtainRight');
  const cartoonAvatarStage = document.getElementById('cartoonAvatarStage');
  const cartoonNameBadge = document.getElementById('cartoonNameBadge');
  const selfiePhotoFrame = document.getElementById('selfiePhotoFrame');
  const senderBadge = document.getElementById('senderBadge');
  const speechBubble = document.getElementById('speechBubble');
  const wishCounterBadge = document.getElementById('wishCounterBadge');
  const prevWishBtn = document.getElementById('prevWishBtn');
  const nextWishBtn = document.getElementById('nextWishBtn');
  const replayWishBtn = document.getElementById('replayWishBtn');
  const finaleBtn = document.getElementById('finaleBtn');
  const reactHugBtn = document.getElementById('reactHugBtn');
  const reactKissBtn = document.getElementById('reactKissBtn');
  const reactHighfiveBtn = document.getElementById('reactHighfiveBtn');
  const finaleSection = document.getElementById('finaleSection');
  const danceCrew = document.getElementById('danceCrew');
  const floatingBalloonsContainer = document.getElementById('floatingBalloonsContainer');
  const scrapbookModal = document.getElementById('scrapbookModal');
  const openScrapbookBtn = document.getElementById('openScrapbookBtn');
  const closeScrapbookBtn = document.getElementById('closeScrapbookBtn');
  const printScrapbookBtn = document.getElementById('printScrapbookBtn');
  const scrapbookGrid = document.getElementById('scrapbookGrid');
  const backToStageBtn = document.getElementById('backToStageBtn');

  // 1. Fetch Party & Wishes
  fetch(`/api/parties/${partyId}`)
    .then((r) => {
      if (!r.ok) throw new Error('Party not found');
      return r.json();
    })
    .then((data) => {
      party = data.party;
      wishes = data.wishes || [];
      initPartyDisplay();
    })
    .catch((err) => {
      console.warn('API error loading party', err);
      document.querySelector('.showtime-page-shell').innerHTML = `
        <div class="cake-section" style="margin-top: 40px;">
          <h2 style="color: #ef4444; font-size: 2rem; margin-bottom: 12px;">⚠️ Yeh Birthday Room Exist Nahi Karta</h2>
          <p style="color: #64748b; font-size: 1.15rem; margin-bottom: 24px;">Yeh celebration room shayad delete ho chuka hai ya link incomplete hai.</p>
          <a href="/" class="btn btn-primary" style="font-size: 1.1rem;">🏠 Go to Home / Create Party</a>
        </div>
      `;
    });

  function initPartyDisplay() {
    kidNameHeader.textContent = party.kidName;
    stageKidName.textContent = party.kidName;
    stageAge.textContent = `${party.kidAge}th`;

    const showtimeWhatsappShareBtn = document.getElementById('showtimeWhatsappShareBtn');
    const showtimeShareLinkBtn = document.getElementById('showtimeShareLinkBtn');
    const wishUrl = `${window.location.origin}/wish?party=${partyId}`;
    const shareText = `🎂 Namaste! Humare pyare ${party.kidName} ka ${party.kidAge}th Birthday celebration chal raha hai! 🎉\nKripya is magical link par apni selfie upload karein aur sweet wish bhejein! Cute cartoons aapki photo ke saath wish bolenge! 🎈👇`;

    if (showtimeWhatsappShareBtn) {
      showtimeWhatsappShareBtn.href = AppUtils.getWhatsAppShareUrl(shareText, wishUrl);
    }

    if (showtimeShareLinkBtn) {
      showtimeShareLinkBtn.onclick = async () => {
        if (navigator.share) {
          try {
            await navigator.share({ title: `${party.kidName}'s Birthday Wish`, text: shareText, url: wishUrl });
            return;
          } catch (e) {}
        }
        navigator.clipboard.writeText(wishUrl);
        SoundFx.click();
        AppUtils.showToast('Family wish link copied! WhatsApp par share karein 📋');
      };
    }

    renderCakeCandles(party.kidAge);
  }

  // 2. Render Cake Candles
  function renderCakeCandles(ageCount) {
    candlesContainer.innerHTML = '';
    const total = Math.min(Math.max(ageCount || 5, 1), 12);
    for (let i = 0; i < total; i++) {
      const candle = document.createElement('div');
      candle.className = 'cake-candle';
      candle.innerHTML = `
        <div class="candle-flame"></div>
        <div class="candle-wick"></div>
        <div class="candle-stick candle-col-${(i % 4) + 1}"></div>
      `;
      candlesContainer.appendChild(candle);
    }
  }

  // 3. Blow Candles
  function blowOutCandles() {
    if (candlesBlown) return;
    candlesBlown = true;
    SoundFx.candleBlow();

    // Extinguish flames
    document.querySelectorAll('.candle-flame').forEach((flame) => {
      flame.classList.add('extinguished');
      // Smoke puff
      const smoke = document.createElement('div');
      smoke.className = 'candle-smoke';
      flame.parentElement.appendChild(smoke);
    });

    setTimeout(() => {
      SoundFx.cheer();
      AppUtils.showerConfetti();
      blowCandlesBtn.style.display = 'none';
      if (micBlowBtn) micBlowBtn.style.display = 'none';
      startShowBtn.style.display = 'inline-flex';
      startShowBtn.classList.add('pulsing');
      AppUtils.showToast('🎉 Yay! Candles Blown! Click Start Showtime below! 🎪');
    }, 600);
  }

  blowCandlesBtn.addEventListener('click', () => {
    SoundFx.init();
    blowOutCandles();
  });

  // Optional: Mic blow detection
  if (micBlowBtn) {
    micBlowBtn.addEventListener('click', async () => {
      SoundFx.init();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const src = ac.createMediaStreamSource(stream);
        const analyser = ac.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        micBlowBtn.textContent = '🌬️ Blow into mic now!';
        micBlowBtn.classList.add('listening');

        const checkVolume = () => {
          if (candlesBlown) {
            stream.getTracks().forEach((t) => t.stop());
            ac.close();
            return;
          }
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          if (avg > 75) {
            blowOutCandles();
            stream.getTracks().forEach((t) => t.stop());
            ac.close();
            return;
          }
          requestAnimationFrame(checkVolume);
        };
        checkVolume();
      } catch (e) {
        AppUtils.showToast('Mic permission not available. Use tap button!');
      }
    });
  }

  // 4. Start Stage Showtime
  startShowBtn.addEventListener('click', () => {
    SoundFx.fanfare();
    cakeSection.style.display = 'none';
    stageSection.style.display = 'block';

    // Open Curtains animation
    setTimeout(() => {
      curtainLeft.classList.add('open');
      curtainRight.classList.add('open');
      SoundFx.boing();
      loadWish(0);
    }, 400);
  });

  // 5. Present Individual Wish
  function loadWish(index) {
    if (!wishes || wishes.length === 0) {
      const wishUrl = `${window.location.origin}/wish?party=${partyId}`;
      const shareText = `🎂 Namaste! Humare pyare ${party.kidName} ka ${party.kidAge}th Birthday celebration chal raha hai! 🎉\nKripya is link par apni selfie upload karein aur sweet wish bhejein! 🎈👇`;
      const whatsappUrl = AppUtils.getWhatsAppShareUrl(shareText, wishUrl);

      speechBubble.innerHTML = `
        <div style="text-align: center; padding: 10px;">
          <p style="font-size: 1.15rem; color: #1e293b; margin-bottom: 10px; font-weight: 700;">
            🎈 Abhi tak koi wish submit nahi hui hai!
          </p>
          <p style="font-size: 0.92rem; color: #64748b; margin-bottom: 14px;">
            Apne relatives, Chacha, Dadi, Bua ko WhatsApp par invite link bhejein:
          </p>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp" style="font-size: 0.9rem; padding: 8px 16px;">
              💬 Share on WhatsApp
            </a>
            <button onclick="navigator.clipboard.writeText('${wishUrl}'); SoundFx.click(); AppUtils.showToast('Wish link copied! 📋');" class="btn btn-secondary" style="font-size: 0.9rem; padding: 8px 14px;">
              📋 Copy Link
            </button>
          </div>
        </div>
      `;
      wishCounterBadge.textContent = '0 Wishes';
      prevWishBtn.disabled = true;
      nextWishBtn.disabled = true;
      replayWishBtn.disabled = true;
      return;
    }

    if (index < 0) index = 0;
    if (index >= wishes.length) index = wishes.length - 1;
    currentWishIndex = index;

    const wish = wishes[currentWishIndex];
    const char = CharacterManager.get(wish.characterId);

    // Update Counter
    wishCounterBadge.textContent = `Wish ${currentWishIndex + 1} of ${wishes.length}`;
    prevWishBtn.disabled = currentWishIndex === 0;
    nextWishBtn.disabled = currentWishIndex === wishes.length - 1;

    // Sender details
    senderBadge.innerHTML = `<strong>${wish.senderName}</strong> <span class="relation-pill">${wish.relation || 'Family'}</span>`;
    selfiePhotoFrame.src = wish.selfieUrl || '/assets/default-avatar.svg';

    // Cartoon Setup
    cartoonNameBadge.textContent = char.name;
    cartoonAvatarStage.innerHTML = char.renderSvg(false);

    // Bounce cartoon onto stage
    cartoonAvatarStage.classList.remove('stage-bounce');
    void cartoonAvatarStage.offsetWidth; // trigger reflow
    cartoonAvatarStage.classList.add('stage-bounce');

    // Speech text
    speechBubble.innerHTML = `<div class="speech-quote">“${wish.message}”</div>`;

    // Update Reaction Badges
    updateReactionButtons(wish);

    // Confetti burst for this wish
    AppUtils.shootConfetti();
    SoundFx.sparkle();

    // Auto-play the cartoon speech or voice audio
    playWishAudio(wish, char);
  }



  function playWishAudio(wish, char) {
    CharacterManager.stopSpeaking();

    if (wish.voiceType === 'audio' && wish.audioUrl) {
      // Play recorded real audio note
      const audio = new Audio(wish.audioUrl);
      let mouthTimer = setInterval(() => {
        const isOpen = Math.random() > 0.5;
        cartoonAvatarStage.innerHTML = char.renderSvg(isOpen);
      }, 160);

      audio.onended = () => {
        clearInterval(mouthTimer);
        cartoonAvatarStage.innerHTML = char.renderSvg(false);
      };
      audio.play().catch((e) => console.log('Audio autoplay blocked, user can tap replay', e));
    } else {
      // Use Web Speech API cartoon voice with Hindi intro & SoundFx
      CharacterManager.speak(
        char.id,
        wish.message,
        (isMouthOpen) => {
          cartoonAvatarStage.innerHTML = char.renderSvg(isMouthOpen);
        },
        () => {
          cartoonAvatarStage.innerHTML = char.renderSvg(false);
        },
        wish.senderName
      );
    }
  }

  // 6. Navigation Controls
  prevWishBtn.addEventListener('click', () => {
    SoundFx.click();
    if (currentWishIndex > 0) loadWish(currentWishIndex - 1);
  });

  nextWishBtn.addEventListener('click', () => {
    SoundFx.click();
    if (currentWishIndex < wishes.length - 1) {
      loadWish(currentWishIndex + 1);
    } else {
      startFinale();
    }
  });

  replayWishBtn.addEventListener('click', () => {
    SoundFx.click();
    if (wishes[currentWishIndex]) {
      const wish = wishes[currentWishIndex];
      const char = CharacterManager.get(wish.characterId);
      playWishAudio(wish, char);
    }
  });

  // 7. Kid's Reactions
  function sendReaction(type, emoji, btn) {
    SoundFx.boing();
    const wish = wishes[currentWishIndex];
    if (!wish) return;

    // Floating reaction emojis
    const rect = btn.getBoundingClientRect();
    AppUtils.spawnReactionEmoji(emoji, rect.left + rect.width / 2, rect.top);

    // Optimistic UI update
    wish.reactions = wish.reactions || { hug: 0, kiss: 0, highfive: 0 };
    wish.reactions[type] = (wish.reactions[type] || 0) + 1;
    updateReactionButtons(wish);

    // Post to API
    fetch(`/api/wishes/${wish.id}/reaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    }).catch((e) => console.warn('Could not post reaction', e));
  }

  reactHugBtn.addEventListener('click', (e) => sendReaction('hug', '🤗', reactHugBtn));
  reactKissBtn.addEventListener('click', (e) => sendReaction('kiss', '😘', reactKissBtn));
  reactHighfiveBtn.addEventListener('click', (e) => sendReaction('highfive', '✋', reactHighfiveBtn));

  function updateReactionButtons(wish) {
    const r = wish.reactions || { hug: 0, kiss: 0, highfive: 0 };
    reactHugBtn.querySelector('.reaction-count').textContent = r.hug || 0;
    reactKissBtn.querySelector('.reaction-count').textContent = r.kiss || 0;
    reactHighfiveBtn.querySelector('.reaction-count').textContent = r.highfive || 0;
  }

  // 8. Act 4: Grand Finale Dance Party
  finaleBtn.addEventListener('click', startFinale);

  function startFinale() {
    CharacterManager.stopSpeaking();
    SoundFx.cheer();
    AppUtils.showerConfetti();

    stageSection.style.display = 'none';
    finaleSection.style.display = 'block';

    // Render all cartoon characters dancing together
    danceCrew.innerHTML = '';
    const allChars = CharacterManager.getAll();
    allChars.forEach((c, idx) => {
      const toon = document.createElement('div');
      toon.className = `dancing-toon dance-anim-${(idx % 3) + 1}`;
      toon.innerHTML = `
        <div class="toon-dance-svg">${c.renderSvg(true)}</div>
        <div class="toon-dance-label">${c.name}</div>
      `;
      danceCrew.appendChild(toon);
    });

    // Render floating balloons with family member selfies
    floatingBalloonsContainer.innerHTML = '';
    const colors = ['#ff4d94', '#ffd166', '#06d6a0', '#118ab2', '#8338ec', '#fb5607'];

    wishes.forEach((w, i) => {
      const balloon = document.createElement('div');
      balloon.className = 'floating-selfie-balloon';
      const col = colors[i % colors.length];
      balloon.style.left = `${10 + ((i * 22) % 80)}%`;
      balloon.style.animationDelay = `${(i * 0.8).toFixed(1)}s`;
      balloon.style.animationDuration = `${6 + (i % 3) * 2}s`;
      balloon.innerHTML = `
        <div class="balloon-body" style="background-color: ${col};">
          <img src="${w.selfieUrl}" alt="${w.senderName}" class="balloon-selfie" />
          <div class="balloon-tie" style="background-color: ${col};"></div>
          <div class="balloon-string"></div>
        </div>
        <div class="balloon-sender-name">${w.senderName}</div>
      `;

      // Tap balloon to POP
      balloon.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundFx.pop();
        AppUtils.shootConfetti(e.clientX, e.clientY);
        balloon.classList.add('popped');
        setTimeout(() => balloon.remove(), 300);
      });

      floatingBalloonsContainer.appendChild(balloon);
    });

    // Continuous celebration intervals
    const finaleTimer = setInterval(() => {
      if (finaleSection.style.display === 'block') {
        AppUtils.shootConfetti(Math.random() * window.innerWidth, window.innerHeight * 0.4, 40);
      } else {
        clearInterval(finaleTimer);
      }
    }, 1800);
  }

  backToStageBtn.addEventListener('click', () => {
    finaleSection.style.display = 'none';
    stageSection.style.display = 'block';
    loadWish(currentWishIndex);
  });

  // 9. Act 5: Interactive Memory Scrapbook
  openScrapbookBtn.addEventListener('click', () => {
    SoundFx.click();
    renderScrapbook();
    scrapbookModal.style.display = 'flex';
  });

  closeScrapbookBtn.addEventListener('click', () => {
    scrapbookModal.style.display = 'none';
  });

  printScrapbookBtn.addEventListener('click', () => {
    window.print();
  });

  function renderScrapbook() {
    scrapbookGrid.innerHTML = '';
    wishes.forEach((w) => {
      const card = document.createElement('div');
      card.className = 'scrapbook-polaroid';
      const char = CharacterManager.get(w.characterId);
      const r = w.reactions || { hug: 0, kiss: 0, highfive: 0 };

      card.innerHTML = `
        <div class="polaroid-photo-box">
          <img src="${w.selfieUrl}" alt="${w.senderName}" class="polaroid-img" />
          <div class="polaroid-char-badge">${char.badge}</div>
        </div>
        <div class="polaroid-content">
          <h3 class="polaroid-name">${w.senderName} <span class="polaroid-rel">(${w.relation})</span></h3>
          <p class="polaroid-msg">“${w.message}”</p>
          <div class="polaroid-reactions">
            <span>🤗 ${r.hug || 0}</span>
            <span>😘 ${r.kiss || 0}</span>
            <span>✋ ${r.highfive || 0}</span>
          </div>
        </div>
      `;
      scrapbookGrid.appendChild(card);
    });
  }
});

