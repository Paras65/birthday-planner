/**
 * Family Secret Wish Scroll Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const storyId = AppUtils.getQueryParam('id');

  const kidNameEl = document.getElementById('kidName');
  const scrollForm = document.getElementById('scrollForm');
  const senderNameInput = document.getElementById('senderName');
  const relationInput = document.getElementById('relation');
  const messageInput = document.getElementById('messageText');
  const photoInput = document.getElementById('photoInput');
  const openCameraBtn = document.getElementById('openCameraBtn');
  const cameraBox = document.getElementById('cameraBox');
  const cameraVideo = document.getElementById('cameraVideo');
  const snapBtn = document.getElementById('snapBtn');
  const previewPhoto = document.getElementById('previewPhoto');
  const submitScrollBtn = document.getElementById('submitScrollBtn');
  const quickWishesContainer = document.getElementById('quickWishesContainer');
  const successModal = document.getElementById('successModal');
  const viewStoryBtn = document.getElementById('viewStoryBtn');

  let cameraStream = null;
  let photoBase64 = '';

  if (!storyId) {
    document.body.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <h2>⚠️ Birthday Storybook Link Missing</h2>
        <p style="color: #64748b; margin: 16px 0;">Kripya WhatsApp par bheja gaya link open karein.</p>
        <a href="/" class="btn btn-primary">🏠 Go to Home</a>
      </div>
    `;
    return;
  }

  // 1. Fetch Story Info
  fetch(`/api/stories/${storyId}`)
    .then((r) => {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    })
    .then((data) => {
      if (data.story && kidNameEl) {
        kidNameEl.textContent = data.story.kidName;
      }
    })
    .catch((err) => {
      console.warn('Story fetch failed', err);
    });

  // 2. Quick wishes
  const quickWishes = [
    'Happy Birthday champ! Hamesha muskurate raho aur unche udo! 🦸🎂',
    'May God bless you with infinite happiness, good health & superpowers! ✨🎈',
    'Party hard superstar! Cake mein mera sabse bada slice rakhna! 🍰😋',
    'Tu hamare parivar ki shaan hai beta! Lots of love and blessings! ❤️🎉',
  ];

  if (quickWishesContainer) {
    quickWishes.forEach((w) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'btn btn-secondary';
      chip.style.fontSize = '0.84rem';
      chip.style.padding = '6px 12px';
      chip.textContent = w;
      chip.addEventListener('click', () => {
        SoundEngine.click();
        messageInput.value = w;
      });
      quickWishesContainer.appendChild(chip);
    });
  }

  // 3. Photo Upload
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      photoBase64 = event.target.result;
      previewPhoto.src = photoBase64;
      previewPhoto.style.display = 'block';
      SoundEngine.magicSparkle();
      AppUtils.showToast('Photo added! 📸');
    };
    reader.readAsDataURL(file);
  });

  // 4. Camera Selfie
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
      AppUtils.showToast('Camera not available. Please upload photo.');
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

    photoBase64 = canvas.toDataURL('image/png');
    previewPhoto.src = photoBase64;
    previewPhoto.style.display = 'block';
    stopCamera();
    AppUtils.showToast('Selfie captured! 📸');
  });

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      cameraStream = null;
    }
    cameraBox.style.display = 'none';
    openCameraBtn.textContent = '📸 Open Camera';
  }

  // 5. Submit Scroll
  scrollForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    SoundEngine.init();

    const senderName = senderNameInput.value.trim();
    if (!senderName) {
      AppUtils.showToast('Kripya apna naam enter karein!');
      senderNameInput.focus();
      return;
    }

    submitScrollBtn.disabled = true;
    submitScrollBtn.innerHTML = '✨ Sealing Magic Scroll...';

    const payload = {
      senderName,
      relation: relationInput.value.trim() || 'Family',
      message: messageInput.value.trim() || 'Happy Birthday!',
      gemColor: document.querySelector('input[name="gemColor"]:checked')?.value || '#ec4899',
      photoBase64,
    };

    try {
      const res = await fetch(`/api/stories/${storyId}/scrolls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        SoundEngine.heroFanfare();
        AppUtils.showerConfetti();
        successModal.style.display = 'flex';

        viewStoryBtn.onclick = () => {
          window.location.href = `/story?id=${storyId}`;
        };
      } else {
        AppUtils.showToast(data.error || 'Failed to submit scroll');
        submitScrollBtn.disabled = false;
        submitScrollBtn.innerHTML = '📜 Send Secret Wish Scroll!';
      }
    } catch (err) {
      console.error(err);
      AppUtils.showToast('Network error while submitting scroll.');
      submitScrollBtn.disabled = false;
      submitScrollBtn.innerHTML = '📜 Send Secret Wish Scroll!';
    }
  });
});
