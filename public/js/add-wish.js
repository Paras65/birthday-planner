/**
 * Add Wish & Photo Page Logic for Family Members
 */

document.addEventListener('DOMContentLoaded', () => {
  const partyId = AppUtils.getQueryParam('id');

  const kidNameEl = document.getElementById('kidName');
  const wishForm = document.getElementById('wishForm');
  const senderNameInput = document.getElementById('senderName');
  const relationInput = document.getElementById('relation');
  const commentInput = document.getElementById('commentText');
  const quickWishesWrap = document.getElementById('quickWishesWrap');
  const photoInput = document.getElementById('photoInput');
  const openCameraBtn = document.getElementById('openCameraBtn');
  const cameraBox = document.getElementById('cameraBox');
  const cameraVideo = document.getElementById('cameraVideo');
  const snapBtn = document.getElementById('snapBtn');
  const previewPhoto = document.getElementById('previewPhoto');
  const submitWishBtn = document.getElementById('submitWishBtn');

  const successModal = document.getElementById('successModal');
  const viewReelBtn = document.getElementById('viewReelBtn');

  let cameraStream = null;
  let photoBase64 = '';

  if (!partyId) {
    document.body.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <h2>⚠️ Birthday Link Not Found</h2>
        <p style="color: #64748b; margin: 16px 0;">Kripya WhatsApp par bheja gaya link open karein ya naya room banayein.</p>
        <a href="/" class="btn btn-primary">🏠 Go to Home</a>
      </div>
    `;
    return;
  }

  // 1. Fetch Party Details
  fetch(`/api/parties/${partyId}`)
    .then((r) => {
      if (!r.ok) throw new Error('Party not found');
      return r.json();
    })
    .then((data) => {
      if (data.party && kidNameEl) {
        kidNameEl.textContent = data.party.kidName;
      }
    })
    .catch((err) => {
      console.warn('Error loading party info', err);
    });

  // 2. Quick wishes suggestions
  const quickWishes = [
    'Happy Birthday champ! Hamesha muskurate raho aur khub aage badho! ❤️🎉',
    'May God bless you with infinite happiness, health and success! ✨🎈',
    'Happy Birthday superstar! Tu hamare parivar ki shaan hai! 🎂🍫',
    'Party hard sweetheart! Cake me mera sabse bada slice rakhna! 🍰😋',
  ];

  if (quickWishesWrap) {
    quickWishes.forEach((w) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'quick-wish-chip';
      chip.textContent = w;
      chip.addEventListener('click', () => {
        PartyBeats.init();
        commentInput.value = w;
      });
      quickWishesWrap.appendChild(chip);
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
      AppUtils.showToast('Photo selected! Looking great! 📸');
    };
    reader.readAsDataURL(file);
  });

  // 4. Camera Selfie
  openCameraBtn.addEventListener('click', async () => {
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

    const canvas = document.createElement('canvas');
    canvas.width = cameraVideo.videoWidth || 300;
    canvas.height = cameraVideo.videoHeight || 300;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0);

    photoBase64 = canvas.toDataURL('image/png');
    previewPhoto.src = photoBase64;
    stopCamera();
    AppUtils.showToast('Selfie captured! 📸');
  });

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      cameraStream = null;
    }
    cameraBox.style.display = 'none';
    openCameraBtn.textContent = '📸 Camera';
  }

  // 5. Submit Wish
  wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const senderName = senderNameInput.value.trim();
    if (!senderName) {
      AppUtils.showToast('Kripya apna naam enter karein!');
      senderNameInput.focus();
      return;
    }

    submitWishBtn.disabled = true;
    submitWishBtn.innerHTML = '✨ Adding to Video Reel...';

    const payload = {
      senderName,
      relation: relationInput.value.trim() || 'Family',
      comment: commentInput.value.trim() || 'Happy Birthday champ! Lots of love and blessings! ❤️🎉',
      photoBase64,
    };

    try {
      const res = await fetch(`/api/parties/${partyId}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        PartyBeats.partyHorn();
        AppUtils.showerConfetti();
        successModal.style.display = 'flex';

        viewReelBtn.onclick = () => {
          window.location.href = `/reel?id=${partyId}`;
        };
      } else {
        AppUtils.showToast(data.error || 'Failed to submit wish');
        submitWishBtn.disabled = false;
        submitWishBtn.innerHTML = '💌 Add My Photo & Wish to Reel!';
      }
    } catch (err) {
      console.error(err);
      AppUtils.showToast('Network error while adding wish.');
      submitWishBtn.disabled = false;
      submitWishBtn.innerHTML = '💌 Add My Photo & Wish to Reel!';
    }
  });
});
