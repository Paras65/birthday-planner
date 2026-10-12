/**
 * Hero Studio & Story Creator Logic - ToonHero
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const kidNameInput = document.getElementById('kidName');
  const kidAgeInput = document.getElementById('kidAge');
  const heroTitleInput = document.getElementById('heroTitle');
  const favoriteFoodInput = document.getElementById('favoriteFood');
  const favoritePowerInput = document.getElementById('favoritePower');
  const heroNameplate = document.getElementById('heroNameplate');
  const heroTitleBadge = document.getElementById('heroTitleBadge');
  const avatarContainer = document.getElementById('avatarContainer');

  const themeCards = document.querySelectorAll('.theme-card');
  const sidekickCards = document.querySelectorAll('.sidekick-card');

  const faceInput = document.getElementById('faceInput');
  const openCameraBtn = document.getElementById('openCameraBtn');
  const cameraBox = document.getElementById('cameraBox');
  const cameraVideo = document.getElementById('cameraVideo');
  const snapBtn = document.getElementById('snapBtn');
  const resetFaceBtn = document.getElementById('resetFaceBtn');

  const storyForm = document.getElementById('storyForm');
  const createStoryBtn = document.getElementById('createStoryBtn');
  const storiesGrid = document.getElementById('storiesGrid');
  const successModal = document.getElementById('successModal');
  const openStoryBtn = document.getElementById('openStoryBtn');
  const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');

  // State
  let currentTheme = 'cosmic';
  let currentSidekick = 'shinchan';
  let userFaceUrl = '/assets/default-hero.svg';
  let cameraStream = null;

  // Initialize Avatar Rig Preview
  function updateAvatarPreview() {
    if (avatarContainer) {
      avatarContainer.innerHTML = HeroRig.render(currentTheme, userFaceUrl);
    }
    if (heroNameplate) {
      heroNameplate.textContent = kidNameInput.value.trim() || 'Aarav';
    }
    if (heroTitleBadge) {
      heroTitleBadge.textContent = heroTitleInput.value.trim() || 'Super Hero';
    }
  }
  updateAvatarPreview();

  // Name & Title dynamic input binding
  kidNameInput.addEventListener('input', () => {
    heroNameplate.textContent = kidNameInput.value.trim() || 'Hero';
  });

  heroTitleInput.addEventListener('input', () => {
    heroTitleBadge.textContent = heroTitleInput.value.trim() || 'Super Hero';
  });

  // Theme card selector
  themeCards.forEach((card) => {
    card.addEventListener('click', () => {
      SoundEngine.click();
      themeCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      currentTheme = card.dataset.theme;
      updateAvatarPreview();
      SoundEngine.magicSparkle();
    });
  });

  // Sidekick card selector
  sidekickCards.forEach((card) => {
    card.addEventListener('click', () => {
      SoundEngine.click();
      sidekickCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      currentSidekick = card.dataset.sidekick;
      SoundEngine.giggle();
    });
  });

  // Photo Upload Handler
  faceInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      userFaceUrl = event.target.result;
      updateAvatarPreview();
      SoundEngine.magicSparkle();
      AppUtils.showToast('Hero face updated! Looks incredible! 🦸✨');
    };
    reader.readAsDataURL(file);
  });

  // Camera Handler
  openCameraBtn.addEventListener('click', async () => {
    SoundEngine.click();
    if (cameraStream) {
      stopCamera();
      return;
    }

    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 400 }, height: { ideal: 400 } },
        audio: false,
      });
      cameraVideo.srcObject = cameraStream;
      cameraBox.style.display = 'block';
      openCameraBtn.textContent = '❌ Close Camera';
    } catch (err) {
      console.warn(err);
      AppUtils.showToast('Camera not available or access denied.');
    }
  });

  snapBtn.addEventListener('click', () => {
    if (!cameraStream) return;
    SoundEngine.magicSparkle();

    const canvas = document.createElement('canvas');
    canvas.width = cameraVideo.videoWidth || 300;
    canvas.height = cameraVideo.videoHeight || 300;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0);

    userFaceUrl = canvas.toDataURL('image/png');
    updateAvatarPreview();
    stopCamera();
    AppUtils.showToast('Awesome selfie captured! Fitted into suit! 📸');
  });

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      cameraStream = null;
    }
    cameraBox.style.display = 'none';
    openCameraBtn.textContent = '📸 Selfie Camera';
  }

  // Reset face
  resetFaceBtn.addEventListener('click', () => {
    SoundEngine.click();
    userFaceUrl = '/assets/default-hero.svg';
    faceInput.value = '';
    updateAvatarPreview();
    AppUtils.showToast('Face reset to cartoon avatar!');
  });

  // Form Submit: Generate Storybook
  storyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    SoundEngine.init();

    const kidName = kidNameInput.value.trim();
    if (!kidName) {
      AppUtils.showToast('Kripya bache ka naam enter karein!');
      kidNameInput.focus();
      return;
    }

    createStoryBtn.disabled = true;
    createStoryBtn.innerHTML = '✨ Generating AI Adventure Movie...';

    const payload = {
      kidName,
      kidAge: kidAgeInput.value || 5,
      gender: document.getElementById('gender').value || 'boy',
      heroTitle: heroTitleInput.value.trim() || 'Super Hero',
      theme: currentTheme,
      sidekick: currentSidekick,
      favoriteFood: favoriteFoodInput.value.trim() || 'Birthday Cake & Laddoo',
      favoritePower: favoritePowerInput.value.trim() || 'Super Flight & Mega Smile',
      heroFaceBase64: userFaceUrl.startsWith('data:image') ? userFaceUrl : '',
    };

    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.story) {
        SoundEngine.heroFanfare();
        AppUtils.showerConfetti();

        // Setup success modal
        const storyId = data.story.id;
        const storyUrl = `${window.location.origin}/story?id=${storyId}`;
        const scrollUrl = `${window.location.origin}/scroll?id=${storyId}`;

        openStoryBtn.onclick = () => {
          window.location.href = `/story?id=${storyId}`;
        };

        const shareMsg = `🎉 Suno Suno! Humare pyare ${kidName} ka ${payload.kidAge}th Birthday Storybook & Movie tayar hai! 🎬✨\nAap bhi unke liye apna Secret Magic Scroll (Wish) bhejein:`;
        shareWhatsAppBtn.href = AppUtils.getWhatsAppShareUrl(shareMsg, scrollUrl);

        successModal.style.display = 'flex';
      } else {
        AppUtils.showToast(data.error || 'Failed to create story');
        createStoryBtn.disabled = false;
        createStoryBtn.innerHTML = '🚀 Generate Animated Adventure Movie!';
      }
    } catch (err) {
      console.error(err);
      AppUtils.showToast('Network error while generating story.');
      createStoryBtn.disabled = false;
      createStoryBtn.innerHTML = '🚀 Generate Animated Adventure Movie!';
    }
  });

  // Load Saved Stories Gallery
  async function loadSavedStories() {
    try {
      const res = await fetch('/api/stories');
      const data = await res.json();
      if (!data.stories || data.stories.length === 0) {
        storiesGrid.innerHTML = `
          <div style="grid-column: 1/-1; background: #ffffff; padding: 30px; border-radius: 20px; text-align: center; color: #64748b; border: 2px dashed #e2e8f0;">
            <p style="font-size: 1.2rem; font-weight: 700; color: #1e1b4b; margin-bottom: 6px;">
              🌟 Abhi tak koi Storybook create nahi hua hai!
            </p>
            <p style="font-size: 0.95rem;">
              Upar diye form mein bache ka naam & theme chunein aur 1-click mein unki animated movie banayein!
            </p>
          </div>
        `;
        return;
      }

      storiesGrid.innerHTML = '';
      data.stories.forEach((s) => {
        const card = document.createElement('div');
        card.className = 'story-card';

        const themeLabels = {
          cosmic: '⚡ Cosmic Superhero',
          space: '🚀 Space Galaxy',
          kingdom: '🏰 Magic Kingdom',
          jungle: '🦖 Dino Safari',
          racer: '🏎️ Speed Racer',
        };

        card.innerHTML = `
          <div class="story-card-header">
            <div class="story-card-avatar">
              <img src="${s.heroFaceUrl}" alt="${s.kidName}">
            </div>
            <div>
              <div class="story-card-title">${s.kidName}'s ${s.kidAge}th Birthday</div>
              <div class="story-card-theme">${themeLabels[s.theme] || 'Hero Adventure'}</div>
            </div>
          </div>
          <div class="story-card-body">
            Companion: <strong>${s.sidekick}</strong><br/>
            Secret Family Scrolls: <strong>${s.scrollsCount || 0}</strong>
          </div>
          <div class="story-card-actions">
            <a href="/story?id=${s.id}" class="btn btn-primary">🎬 Watch Movie</a>
            <a href="/scroll?id=${s.id}" class="btn btn-secondary">📜 Add Scroll</a>
            <button class="btn btn-secondary delete-story-btn" data-id="${s.id}" style="color: #ef4444;" title="Delete">🗑️</button>
          </div>
        `;

        card.querySelector('.delete-story-btn').addEventListener('click', async (e) => {
          e.preventDefault();
          if (confirm(`Kya aap ${s.kidName} ki storybook delete karna chahte hain?`)) {
            await fetch(`/api/stories/${s.id}`, { method: 'DELETE' });
            SoundEngine.click();
            AppUtils.showToast('Storybook deleted!');
            loadSavedStories();
          }
        });

        storiesGrid.appendChild(card);
      });
    } catch (e) {
      console.warn('Could not load stories list', e);
    }
  }

  loadSavedStories();
});
