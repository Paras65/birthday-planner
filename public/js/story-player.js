/**
 * Grand Animated Storybook & Video Movie Player Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const storyId = AppUtils.getQueryParam('id');

  if (!storyId) {
    document.body.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <h2>⚠️ Storybook Link Not Found</h2>
        <p style="color: #64748b; margin: 16px 0;">Kripya Home page se storybook chunein ya naya banayein.</p>
        <a href="/" class="btn btn-primary">🏠 Go to Hero Studio Home</a>
      </div>
    `;
    return;
  }

  // Elements
  const chapterPill = document.getElementById('chapterPill');
  const sceneViewport = document.getElementById('sceneViewport');
  const actorHero = document.getElementById('actorHero');
  const actorCompanion = document.getElementById('actorCompanion');
  const bubbleSpeaker = document.getElementById('bubbleSpeaker');
  const bubbleText = document.getElementById('bubbleText');
  const narrationText = document.getElementById('narrationText');
  const voiceWave = document.getElementById('voiceWave');
  const prevChapterBtn = document.getElementById('prevChapterBtn');
  const nextChapterBtn = document.getElementById('nextChapterBtn');
  const togglePlayMovieBtn = document.getElementById('togglePlayMovieBtn');
  const replaySceneBtn = document.getElementById('replaySceneBtn');
  const bgmToggleBtn = document.getElementById('bgmToggleBtn');
  const voiceToggleBtn = document.getElementById('voiceToggleBtn');
  const chapterDotsContainer = document.getElementById('chapterDotsContainer');
  const interactiveLayer = document.getElementById('interactiveLayer');

  const theaterModeBtn = document.getElementById('theaterModeBtn');
  const bookModeBtn = document.getElementById('bookModeBtn');
  const movieStageBox = document.getElementById('movieStageBox');
  const storybookDualPage = document.getElementById('storybookDualPage');
  const bookPagesContainer = document.getElementById('bookPagesContainer');

  const openScrollsVaultBtn = document.getElementById('openScrollsVaultBtn');
  const scrollsModal = document.getElementById('scrollsModal');
  const closeScrollsModalBtn = document.getElementById('closeScrollsModalBtn');
  const scrollsVaultGrid = document.getElementById('scrollsVaultGrid');
  const inviteScrollWhatsAppBtn = document.getElementById('inviteScrollWhatsAppBtn');
  const printStoryBtn = document.getElementById('printStoryBtn');

  // State
  let story = null;
  let scrolls = [];
  let currentChapterIndex = 0;
  let isMovieAutoPlaying = false;
  let movieTimer = null;
  let isBgmOn = true;
  let isVoiceOn = true;
  let poppedOrbs = 0;

  // 1. Fetch Story Data
  fetch(`/api/stories/${storyId}`)
    .then((r) => {
      if (!r.ok) throw new Error('Story not found');
      return r.json();
    })
    .then((data) => {
      story = data.story;
      scrolls = data.scrolls || [];
      initPlayer();
    })
    .catch((err) => {
      console.error(err);
      AppUtils.showToast('Could not load storybook.');
    });

  function initPlayer() {
    renderDots();
    renderChapter(0);
    setupScrollsModal();

    // Start background music
    if (isBgmOn) SoundEngine.startMovieBGM();

    // Setup print
    if (printStoryBtn) {
      printStoryBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // WhatsApp invite link for relatives
    if (inviteScrollWhatsAppBtn) {
      const scrollUrl = `${window.location.origin}/scroll?id=${storyId}`;
      const inviteMsg = `🎂 Namaste! Hamare pyare ${story.kidName} ka ${story.kidAge}th Birthday Storybook chal raha hai! 🎬✨\nAap bhi unke liye apna Secret Magic Scroll (Wish) bhejein:`;
      inviteScrollWhatsAppBtn.href = AppUtils.getWhatsAppShareUrl(inviteMsg, scrollUrl);
    }
  }

  // 2. Render Chapter Stepper Dots
  function renderDots() {
    chapterDotsContainer.innerHTML = '';
    story.chapters.forEach((ch, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot-step ${idx === currentChapterIndex ? 'active' : ''}`;
      dot.title = ch.title;
      dot.addEventListener('click', () => {
        SoundEngine.click();
        renderChapter(idx);
      });
      chapterDotsContainer.appendChild(dot);
    });
  }

  // 3. Render Specific Chapter
  function renderChapter(index) {
    if (!story || !story.chapters[index]) return;
    HeroRig.stopNarration();
    clearTimeout(movieTimer);

    currentChapterIndex = index;
    const ch = story.chapters[currentChapterIndex];

    // Update Indicators
    chapterPill.textContent = `Chapter ${ch.chapterNumber} of 5`;
    prevChapterBtn.disabled = currentChapterIndex === 0;
    nextChapterBtn.disabled = currentChapterIndex === story.chapters.length - 1;

    // Update Dots
    const dots = chapterDotsContainer.querySelectorAll('.dot-step');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentChapterIndex);
      d.classList.toggle('completed', i < currentChapterIndex);
    });

    // Update Scene Backdrop
    sceneViewport.className = `scene-viewport scene-bg-${ch.backdrop}`;

    // Update Actors
    actorHero.innerHTML = HeroRig.render(story.theme, story.heroFaceUrl, false);
    actorCompanion.innerHTML = HeroRig.renderCompanion(story.sidekick, false);

    // Update Dialogue Bubble
    bubbleSpeaker.textContent = ch.dialogue.speaker;
    bubbleText.textContent = ch.dialogue.text;

    // Update Narration Subtitle
    narrationText.textContent = ch.narration;

    // Sound effect per chapter
    if (currentChapterIndex === 0) SoundEngine.heroFanfare();
    else if (currentChapterIndex === 1) SoundEngine.giggle();
    else if (currentChapterIndex === 2) SoundEngine.whoosh();
    else if (currentChapterIndex === 3) SoundEngine.magicSparkle();
    else if (currentChapterIndex === 4) {
      SoundEngine.cheer();
      AppUtils.showerConfetti();
    }

    // Setup Chapter Interactive Challenge
    setupChapterInteractivity(ch);

    // Narrate chapter aloud if voice enabled
    if (isVoiceOn) {
      voiceWave.classList.add('wave-active');
      HeroRig.narrate(
        ch.narration,
        () => {
          voiceWave.classList.add('wave-active');
          // Animate companion mouth
          actorCompanion.innerHTML = HeroRig.renderCompanion(story.sidekick, true);
        },
        () => {
          voiceWave.classList.remove('wave-active');
          actorCompanion.innerHTML = HeroRig.renderCompanion(story.sidekick, false);

          // If movie auto-playing, advance to next scene!
          if (isMovieAutoPlaying && currentChapterIndex < story.chapters.length - 1) {
            movieTimer = setTimeout(() => {
              renderChapter(currentChapterIndex + 1);
            }, 3000);
          } else if (isMovieAutoPlaying && currentChapterIndex === story.chapters.length - 1) {
            isMovieAutoPlaying = false;
            togglePlayMovieBtn.innerHTML = '▶️ Auto-Play Movie';
            togglePlayMovieBtn.classList.remove('btn-accent');
            togglePlayMovieBtn.classList.add('btn-primary');
          }
        }
      );
    }

    // Render Dual-Page Book View as well
    renderStorybookPages();
  }

  // 4. Chapter Interactivity
  function setupChapterInteractivity(ch) {
    interactiveLayer.innerHTML = '';
    poppedOrbs = 0;

    // Chapter 3: Pop the 3 floating magic orbs
    if (ch.chapterNumber === 3) {
      for (let i = 0; i < 3; i++) {
        const orb = document.createElement('div');
        orb.className = 'magic-target-orb';
        orb.innerHTML = '⚡';
        orb.style.left = `${20 + i * 30}%`;
        orb.style.top = `${30 + (i % 2) * 25}%`;
        orb.style.animationDelay = `${i * 0.4}s`;

        orb.addEventListener('click', () => {
          SoundEngine.balloonPop();
          orb.style.transform = 'scale(1.8)';
          orb.style.opacity = '0';
          orb.style.transition = 'all 0.25s ease';
          poppedOrbs++;
          setTimeout(() => orb.remove(), 250);

          if (poppedOrbs >= 3) {
            SoundEngine.heroFanfare();
            AppUtils.showerConfetti();
            AppUtils.showToast(`🎉 Superpower Unleashed! Speed boosted by 100%! 🚀`);
          }
        });

        interactiveLayer.appendChild(orb);
      }
    }

    // Chapter 4: Glowing secret scrolls orbs
    if (ch.chapterNumber === 4 && scrolls.length > 0) {
      scrolls.slice(0, 4).forEach((sc, idx) => {
        const orb = document.createElement('div');
        orb.className = 'magic-target-orb';
        orb.innerHTML = '📜';
        orb.style.background = 'radial-gradient(circle, #fbcfe8, #ec4899)';
        orb.style.boxShadow = '0 0 25px #ec4899';
        orb.style.left = `${15 + idx * 24}%`;
        orb.style.top = `${35 + (idx % 2) * 20}%`;
        orb.title = `Scroll from ${sc.senderName}`;

        orb.addEventListener('click', () => {
          SoundEngine.magicSparkle();
          openScrollsVaultBtn.click();
        });

        interactiveLayer.appendChild(orb);
      });
    }

    // Chapter 5: Giant Birthday Cake
    if (ch.chapterNumber === 5) {
      const cakeEl = document.createElement('div');
      cakeEl.style.position = 'absolute';
      cakeEl.style.bottom = '40px';
      cakeEl.style.left = '50%';
      cakeEl.style.transform = 'translateX(-50%)';
      cakeEl.style.fontSize = '4.5rem';
      cakeEl.style.cursor = 'pointer';
      cakeEl.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))';
      cakeEl.innerHTML = '🎂';
      cakeEl.title = 'Tap to Blow Candles & Launch Fireworks!';

      cakeEl.addEventListener('click', () => {
        SoundEngine.candleBlow();
        cakeEl.style.transform = 'translateX(-50%) scale(1.2)';
        cakeEl.style.transition = 'transform 0.2s';
        setTimeout(() => {
          cakeEl.style.transform = 'translateX(-50%) scale(1)';
          SoundEngine.cheer();
          AppUtils.showerConfetti();
          AppUtils.showToast(`🎂 Happy ${story.kidAge}th Birthday ${story.kidName}! 🎉🥳`);
        }, 300);
      });

      interactiveLayer.appendChild(cakeEl);
    }
  }

  // Actor Click Fun Reactions
  actorHero.addEventListener('click', () => {
    SoundEngine.whoosh();
    actorHero.style.transform = 'scale(1.15) rotate(5deg)';
    setTimeout(() => (actorHero.style.transform = ''), 400);
    AppUtils.showToast(`${story.kidName}: "Ready for action! ⚡"`);
  });

  actorCompanion.addEventListener('click', () => {
    SoundEngine.giggle();
    actorCompanion.style.transform = 'scale(1.15) rotate(-5deg)';
    setTimeout(() => (actorCompanion.style.transform = ''), 400);
  });

  // Navigation Controls
  prevChapterBtn.addEventListener('click', () => {
    SoundEngine.click();
    if (currentChapterIndex > 0) renderChapter(currentChapterIndex - 1);
  });

  nextChapterBtn.addEventListener('click', () => {
    SoundEngine.click();
    if (currentChapterIndex < story.chapters.length - 1) renderChapter(currentChapterIndex + 1);
  });

  replaySceneBtn.addEventListener('click', () => {
    SoundEngine.click();
    renderChapter(currentChapterIndex);
  });

  // Auto-play Movie Mode Toggle
  togglePlayMovieBtn.addEventListener('click', () => {
    SoundEngine.click();
    isMovieAutoPlaying = !isMovieAutoPlaying;
    if (isMovieAutoPlaying) {
      togglePlayMovieBtn.innerHTML = '⏸️ Pause Movie';
      togglePlayMovieBtn.classList.remove('btn-primary');
      togglePlayMovieBtn.classList.add('btn-accent');
      if (currentChapterIndex === story.chapters.length - 1) {
        renderChapter(0);
      } else {
        renderChapter(currentChapterIndex);
      }
    } else {
      togglePlayMovieBtn.innerHTML = '▶️ Auto-Play Movie';
      togglePlayMovieBtn.classList.remove('btn-accent');
      togglePlayMovieBtn.classList.add('btn-primary');
      clearTimeout(movieTimer);
      HeroRig.stopNarration();
    }
  });

  // BGM Toggle
  bgmToggleBtn.addEventListener('click', () => {
    SoundEngine.click();
    isBgmOn = !isBgmOn;
    if (isBgmOn) {
      SoundEngine.startMovieBGM();
      bgmToggleBtn.innerHTML = '🎵 Music: ON';
      bgmToggleBtn.style.color = '#10b981';
    } else {
      SoundEngine.stopMovieBGM();
      bgmToggleBtn.innerHTML = '🔇 Music: OFF';
      bgmToggleBtn.style.color = '#64748b';
    }
  });

  // Voice Toggle
  voiceToggleBtn.addEventListener('click', () => {
    SoundEngine.click();
    isVoiceOn = !isVoiceOn;
    if (isVoiceOn) {
      voiceToggleBtn.innerHTML = '🗣️ Voice: ON';
      voiceToggleBtn.style.color = '#10b981';
      renderChapter(currentChapterIndex);
    } else {
      HeroRig.stopNarration();
      voiceToggleBtn.innerHTML = '🤫 Voice: OFF';
      voiceToggleBtn.style.color = '#64748b';
    }
  });

  // View Mode Switcher (Theater vs Storybook)
  theaterModeBtn.addEventListener('click', () => {
    SoundEngine.click();
    theaterModeBtn.classList.add('active');
    bookModeBtn.classList.remove('active');
    movieStageBox.style.display = 'flex';
    storybookDualPage.style.display = 'none';
  });

  bookModeBtn.addEventListener('click', () => {
    SoundEngine.click();
    bookModeBtn.classList.add('active');
    theaterModeBtn.classList.remove('active');
    movieStageBox.style.display = 'none';
    storybookDualPage.style.display = 'block';
    renderStorybookPages();
  });

  // Render Illustrated Storybook Mode Pages
  function renderStorybookPages() {
    if (!story) return;
    const ch = story.chapters[currentChapterIndex];

    bookPagesContainer.innerHTML = `
      <!-- Left Page: Illustrated Scene -->
      <div style="background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 2px solid #fed7aa; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 380px;">
        <div style="width: 200px; height: 200px; margin-bottom: 16px;">
          ${HeroRig.render(story.theme, story.heroFaceUrl, false)}
        </div>
        <div style="width: 110px; height: 110px;">
          ${HeroRig.renderCompanion(story.sidekick, false)}
        </div>
      </div>

      <!-- Right Page: Story Text & Dialogue -->
      <div style="background: #ffffff; border-radius: 16px; padding: 28px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 2px solid #fed7aa; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <span style="background: var(--primary); color: #ffffff; padding: 4px 12px; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">Chapter ${ch.chapterNumber}</span>
          <h2 style="font-size: 1.6rem; color: #1e1b4b; margin: 10px 0 6px 0;">${ch.title}</h2>
          <h4 style="font-size: 1.05rem; color: var(--accent); margin-bottom: 16px;">${ch.subtitle}</h4>
          <p style="font-size: 1.05rem; line-height: 1.6; color: #334155; margin-bottom: 20px;">${ch.narration}</p>
          
          <div style="background: #f8fafc; border-left: 4px solid var(--secondary); padding: 12px 16px; border-radius: 8px;">
            <strong style="color: var(--primary);">${ch.dialogue.speaker}:</strong>
            <p style="margin: 4px 0 0 0; font-style: italic; color: #1e1b4b;">"${ch.dialogue.text}"</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; font-weight: 700; color: #64748b;">
          <span>Page ${currentChapterIndex * 2 + 1}</span>
          <span>Page ${currentChapterIndex * 2 + 2}</span>
        </div>
      </div>
    `;
  }

  // Setup Scrolls Vault Modal
  function setupScrollsModal() {
    openScrollsVaultBtn.addEventListener('click', () => {
      SoundEngine.magicSparkle();
      renderScrollsList();
      scrollsModal.style.display = 'flex';
    });

    closeScrollsModalBtn.addEventListener('click', () => {
      SoundEngine.click();
      scrollsModal.style.display = 'none';
    });
  }

  function renderScrollsList() {
    if (!scrolls || scrolls.length === 0) {
      scrollsVaultGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 30px; color: #64748b;">
          <p style="font-size: 1.15rem; font-weight: 700; color: #1e1b4b; margin-bottom: 8px;">
            📜 Abhi tak koi Secret Scroll nahi aaya hai!
          </p>
          <p style="font-size: 0.95rem; margin-bottom: 16px;">
            Apne Chacha, Dadi, Bua aur relatives ko WhatsApp link bhejein:
          </p>
          <a href="${inviteScrollWhatsAppBtn.href}" target="_blank" class="btn btn-whatsapp">
            💬 Invite Relatives on WhatsApp
          </a>
        </div>
      `;
      return;
    }

    scrollsVaultGrid.innerHTML = '';
    scrolls.forEach((sc) => {
      const card = document.createElement('div');
      card.className = 'scroll-card';
      card.innerHTML = `
        <div class="scroll-photo-wrap">
          <img src="${sc.photoUrl || '/assets/default-hero.svg'}" alt="${sc.senderName}">
        </div>
        <div class="scroll-sender">${sc.senderName}</div>
        <span class="scroll-relation">${sc.relation || 'Family'}</span>
        <div class="scroll-msg">“${sc.message}”</div>
      `;
      scrollsVaultGrid.appendChild(card);
    });
  }
});
