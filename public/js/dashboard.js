/**
 * Dashboard & Party Reel Creator Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const partyForm = document.getElementById('partyForm');
  const kidNameInput = document.getElementById('kidName');
  const kidAgeInput = document.getElementById('kidAge');
  const kidPhotoInput = document.getElementById('kidPhotoInput');
  const openCameraBtn = document.getElementById('openCameraBtn');
  const cameraBox = document.getElementById('cameraBox');
  const cameraVideo = document.getElementById('cameraVideo');
  const snapBtn = document.getElementById('snapBtn');
  const previewKidPhoto = document.getElementById('previewKidPhoto');
  const createReelBtn = document.getElementById('createReelBtn');
  const reelsGrid = document.getElementById('reelsGrid');

  const successModal = document.getElementById('successModal');
  const viewReelBtn = document.getElementById('viewReelBtn');
  const addWishLinkBtn = document.getElementById('addWishLinkBtn');
  const inviteWhatsAppBtn = document.getElementById('inviteWhatsAppBtn');

  let cameraStream = null;
  let kidPhotoBase64 = '';

  // 1. Photo File Upload
  kidPhotoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      kidPhotoBase64 = event.target.result;
      previewKidPhoto.src = kidPhotoBase64;
      AppUtils.showToast('Spotlight photo selected! 🌟');
    };
    reader.readAsDataURL(file);
  });

  // 2. Camera Snapshot
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
      AppUtils.showToast('Camera not available or access denied.');
    }
  });

  snapBtn.addEventListener('click', () => {
    if (!cameraStream) return;

    const canvas = document.createElement('canvas');
    canvas.width = cameraVideo.videoWidth || 320;
    canvas.height = cameraVideo.videoHeight || 320;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0);

    kidPhotoBase64 = canvas.toDataURL('image/png');
    previewKidPhoto.src = kidPhotoBase64;
    stopCamera();
    AppUtils.showToast('Spotlight selfie captured! 📸');
  });

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      cameraStream = null;
    }
    cameraBox.style.display = 'none';
    openCameraBtn.textContent = '📸 Camera';
  }

  // 3. Form Submission
  partyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const kidName = kidNameInput.value.trim();
    if (!kidName) {
      AppUtils.showToast('Kripya bache ka naam enter karein!');
      kidNameInput.focus();
      return;
    }

    createReelBtn.disabled = true;
    createReelBtn.innerHTML = '✨ Creating Birthday Reel...';

    const payload = {
      kidName,
      kidAge: kidAgeInput.value || 5,
      celebrationTheme: 'gold-festive',
      kidPhotoBase64,
    };

    try {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.party) {
        PartyBeats.partyHorn();
        AppUtils.showerConfetti();

        const partyId = data.party.id;
        const reelUrl = `${window.location.origin}/reel?id=${partyId}`;
        const wishUrl = `${window.location.origin}/wish?id=${partyId}`;

        viewReelBtn.onclick = () => {
          window.location.href = reelUrl;
        };

        addWishLinkBtn.onclick = () => {
          window.location.href = wishUrl;
        };

        const inviteMsg = `🎂 Namaste! Hamare pyare ${kidName} ka ${payload.kidAge}th Birthday Celebration Video Reel ban raha hai! 🎬✨\nAap bhi apni photo aur sweet wish is link par add karein taaki video reel mein aapka message shamil ho sake:`;
        inviteWhatsAppBtn.href = AppUtils.getWhatsAppShareUrl(inviteMsg, wishUrl);

        successModal.style.display = 'flex';
        loadPartiesList();
      } else {
        AppUtils.showToast(data.error || 'Failed to create reel');
        createReelBtn.disabled = false;
        createReelBtn.innerHTML = '🎬 Create WhatsApp Birthday Reel!';
      }
    } catch (err) {
      console.error(err);
      AppUtils.showToast('Network error while creating party reel.');
      createReelBtn.disabled = false;
      createReelBtn.innerHTML = '🎬 Create WhatsApp Birthday Reel!';
    }
  });

  // 4. Load Parties List
  async function loadPartiesList() {
    try {
      const res = await fetch('/api/parties');
      const data = await res.json();

      if (!data.parties || data.parties.length === 0) {
        reelsGrid.innerHTML = `
          <div style="grid-column: 1/-1; background: #ffffff; padding: 36px 20px; border-radius: 24px; text-align: center; border: 2px dashed #e2e8f0; color: #64748b;">
            <p style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
              🎉 Abhi tak koi Birthday Reel create nahi hua hai!
            </p>
            <p style="font-size: 0.95rem;">
              Upar bache ka naam likhein aur photo upload karke 1-click mein family reel banayein!
            </p>
          </div>
        `;
        return;
      }

      reelsGrid.innerHTML = '';
      data.parties.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'party-reel-card';

        const wishUrl = `${window.location.origin}/wish?id=${p.id}`;
        const inviteMsg = `🎂 Namaste! Hamare pyare ${p.kidName} ka ${p.kidAge}th Birthday Video Reel ban raha hai! 🎬✨\nApni photo aur pyara wish add karein:`;
        const whatsappUrl = AppUtils.getWhatsAppShareUrl(inviteMsg, wishUrl);

        card.innerHTML = `
          <div class="reel-card-top">
            <div class="reel-card-photo">
              <img src="${p.kidPhotoUrl || '/assets/default-user.svg'}" alt="${p.kidName}">
            </div>
            <div class="reel-card-info">
              <h3>${p.kidName}'s ${p.kidAge}th Birthday</h3>
              <p>WhatsApp Video Reel</p>
            </div>
          </div>
          <div class="reel-card-stats">
            💌 Family Wishes: <strong>${p.wishCount || 0} Photos & Comments</strong>
          </div>
          <div class="reel-card-actions">
            <a href="/reel?id=${p.id}" class="btn btn-primary">🎬 Watch Reel</a>
            <a href="/wish?id=${p.id}" class="btn btn-secondary">➕ Add Wish</a>
            <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp" title="Share WhatsApp Invite">💬 Invite</a>
            <button class="btn btn-secondary delete-reel-btn" data-id="${p.id}" style="color: #ef4444;" title="Delete">🗑️</button>
          </div>
        `;

        card.querySelector('.delete-reel-btn').addEventListener('click', async () => {
          if (confirm(`Kya aap ${p.kidName} ki birthday reel delete karna chahte hain?`)) {
            await fetch(`/api/parties/${p.id}`, { method: 'DELETE' });
            AppUtils.showToast('Reel deleted!');
            loadPartiesList();
          }
        });

        reelsGrid.appendChild(card);
      });
    } catch (e) {
      console.warn('Could not load parties', e);
    }
  }

  loadPartiesList();
});
