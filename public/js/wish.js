/**
 * Wish Submission Portal Script - Handles selfie upload, sticker decorator, cartoon voice preview, audio recording, and submission
 */
document.addEventListener('DOMContentLoaded', () => {
  const partyId = AppUtils.getQueryParam('party');

  // If no party specified in URL
  if (!partyId) {
    const portalHeader = document.querySelector('.portal-header');
    if (portalHeader) {
      portalHeader.innerHTML = `
        <div style="background: #ffffff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-top: 20px;">
          <h2 style="color: #ef4444; font-size: 1.8rem; margin-bottom: 12px;">⚠️ Birthday Room Link Not Found</h2>
          <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 20px;">Kripya WhatsApp par bheja gaya link open karein ya Home page par naya room banayein.</p>
          <a href="/" class="btn btn-primary">🏠 Go to Home / Create Room</a>
        </div>
      `;
    }
    const wishFormEl = document.getElementById('wishForm');
    if (wishFormEl) wishFormEl.style.display = 'none';
    return;
  }

  // Elements
  const partyKidNameEl = document.getElementById('partyKidName');
  const partyAgeEl = document.getElementById('partyAge');
  const senderNameInput = document.getElementById('senderName');
  const relationInput = document.getElementById('relation');
  const messageInput = document.getElementById('messageText');
  const photoInput = document.getElementById('photoInput');
  const openCameraBtn = document.getElementById('openCameraBtn');
  const cameraVideo = document.getElementById('cameraVideo');
  const snapBtn = document.getElementById('snapBtn');
  const cameraContainer = document.getElementById('cameraContainer');
  const stickerCanvas = document.getElementById('stickerCanvas');
  const stickerPalette = document.getElementById('stickerPalette');
  const clearStickersBtn = document.getElementById('clearStickersBtn');
  const characterGrid = document.getElementById('characterGrid');
  const testVoiceBtn = document.getElementById('testVoiceBtn');
  const wishForm = document.getElementById('wishForm');
  const submitBtn = document.getElementById('submitBtn');
  const quickWishesContainer = document.getElementById('quickWishesContainer');
  const voiceTypeRadios = document.querySelectorAll('input[name="voiceType"]');
  const audioRecorderSection = document.getElementById('audioRecorderSection');
  const recordAudioBtn = document.getElementById('recordAudioBtn');
  const stopAudioBtn = document.getElementById('stopAudioBtn');
  const recordingTimer = document.getElementById('recordingTimer');
  const audioPreview = document.getElementById('audioPreview');
  const successModal = document.getElementById('successModal');
  const viewShowtimeBtn = document.getElementById('viewShowtimeBtn');

  // State
  let selectedCharacterId = 'mimi';
  let userImage = null;
  let activeStickers = []; // [{ id, x, y, size }]
  let selectedStickerIndex = -1;
  let isDraggingSticker = false;
  let dragOffset = { x: 0, y: 0 };
  let mediaRecorder = null;
  let audioChunks = [];
  let recordedAudioBlob = null;
  let recordInterval = null;
  let recordSeconds = 0;
  let cameraStream = null;

  const ctx = stickerCanvas.getContext('2d');

  // 1. Fetch Party Information
  fetch(`/api/parties/${partyId}`)
    .then((r) => {
      if (!r.ok) throw new Error('Party not found');
      return r.json();
    })
    .then((data) => {
      if (data.party) {
        partyKidNameEl.textContent = data.party.kidName;
        partyAgeEl.textContent = `${data.party.kidAge}th`;
      }
    })
    .catch((err) => {
      console.warn('Could not load party info', err);
      const portalHeader = document.querySelector('.portal-header');
      if (portalHeader) {
        portalHeader.innerHTML = `
          <div style="background: #ffffff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-top: 20px;">
            <h2 style="color: #ef4444; font-size: 1.8rem; margin-bottom: 12px;">⚠️ Yeh Birthday Room Exist Nahi Karta</h2>
            <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 20px;">Yeh room shayad delete ho chuka hai ya link incomplete hai.</p>
            <a href="/" class="btn btn-primary">🏠 Go to Home / Create Room</a>
          </div>
        `;
      }
      if (wishForm) wishForm.style.display = 'none';
    });

  // 2. Render Character Selector
  const chars = CharacterManager.getAll();
  characterGrid.innerHTML = '';
  chars.forEach((c) => {
    const card = document.createElement('div');
    card.className = `character-card ${c.id === selectedCharacterId ? 'active' : ''}`;
    card.dataset.id = c.id;
    card.innerHTML = `
      <div class="char-avatar">${c.renderSvg(false)}</div>
      <div class="char-name">${c.name}</div>
      <div class="char-intro">${c.intro}</div>
    `;
    card.addEventListener('click', () => {
      SoundFx.click();
      selectedCharacterId = c.id;
      document.querySelectorAll('.character-card').forEach((el) => el.classList.remove('active'));
      card.classList.add('active');
    });
    characterGrid.appendChild(card);
  });

  // 3. Render Sticker Palette
  const stickers = StickerManager.getStickers();
  stickerPalette.innerHTML = '';
  stickers.forEach((s) => {
    const btn = document.createElement('button');
    type = 'button';
    btn.className = 'sticker-btn';
    btn.innerHTML = `<span class="sticker-emoji">${s.emoji}</span> <span>${s.name}</span>`;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      addStickerToCanvas(s.id);
    });
    stickerPalette.appendChild(btn);
  });

  // 4. Quick Wish Suggestions
  const quickWishes = [
    'Happy Birthday champ! Tu hamare ghar ki shaan hai! 🎂🎉',
    'May God bless you with infinite happiness, smiles & superpowers! 🦸✨',
    'Happy Birthday superstar! Khoob saari masti aur chocolates tere liye! 🍫🎈',
    'Party hard sweetheart! Cake me mera sabse bada slice rakhna! 🍰😋',
  ];
  quickWishes.forEach((w) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'quick-wish-chip';
    chip.textContent = w;
    chip.addEventListener('click', () => {
      SoundFx.click();
      messageInput.value = w;
    });
    quickWishesContainer.appendChild(chip);
  });

  // 5. Image & Canvas Handling
  function initDefaultCanvas() {
    stickerCanvas.width = 400;
    stickerCanvas.height = 400;
    // Draw default placeholder
    const defaultImg = new Image();
    defaultImg.src = '/assets/default-avatar.svg';
    defaultImg.onload = () => {
      userImage = defaultImg;
      drawCanvas();
    };
  }
  initDefaultCanvas();

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        userImage = img;
        activeStickers = [];
        drawCanvas();
        SoundFx.sparkle();
        AppUtils.showToast('Photo loaded! Tap stickers below to add silly hats & goggles! 🥳');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Camera integration
  openCameraBtn.addEventListener('click', async () => {
    SoundFx.click();
    if (cameraStream) {
      // Toggle off
      stopCamera();
      return;
    }
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      cameraVideo.srcObject = cameraStream;
      cameraContainer.style.display = 'block';
      openCameraBtn.textContent = '❌ Close Camera';
    } catch (err) {
      AppUtils.showToast('Camera access denied or unavailable. Use upload button.');
    }
  });

  snapBtn.addEventListener('click', () => {
    if (!cameraStream) return;
    SoundFx.cameraShutter ? SoundFx.cameraShutter() : SoundFx.pop();
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cameraVideo.videoWidth || 400;
    tempCanvas.height = cameraVideo.videoHeight || 400;
    const tctx = tempCanvas.getContext('2d');
    tctx.drawImage(cameraVideo, 0, 0);

    const img = new Image();
    img.onload = () => {
      userImage = img;
      activeStickers = [];
      drawCanvas();
      stopCamera();
      AppUtils.showToast('Selfie captured! Now decorate it! 🎨');
    };
    img.src = tempCanvas.toDataURL('image/png');
  });

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      cameraStream = null;
    }
    cameraContainer.style.display = 'none';
    openCameraBtn.textContent = '📸 Open Camera';
  }

  function addStickerToCanvas(stickerId) {
    SoundFx.boing();
    const centerX = stickerCanvas.width / 2;
    const centerY = stickerCanvas.height / 2;
    activeStickers.push({
      id: stickerId,
      x: centerX + (Math.random() * 40 - 20),
      y: centerY - 40,
      size: 90,
    });
    selectedStickerIndex = activeStickers.length - 1;
    drawCanvas();
  }

  const removePhotoBtn = document.getElementById('removePhotoBtn');
  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', () => {
      SoundFx.click();
      photoInput.value = '';
      activeStickers = [];
      selectedStickerIndex = -1;
      initDefaultCanvas();
      AppUtils.showToast('Photo removed! Reset to default avatar. 🔄');
    });
  }

  clearStickersBtn.addEventListener('click', () => {
    SoundFx.click();
    activeStickers = [];
    selectedStickerIndex = -1;
    drawCanvas();
  });

  function drawCanvas() {
    ctx.clearRect(0, 0, stickerCanvas.width, stickerCanvas.height);

    if (userImage) {
      // Draw image to fill square canvas cleanly
      const minDim = Math.min(userImage.width, userImage.height);
      const sx = (userImage.width - minDim) / 2;
      const sy = (userImage.height - minDim) / 2;
      ctx.drawImage(userImage, sx, sy, minDim, minDim, 0, 0, stickerCanvas.width, stickerCanvas.height);
    } else {
      ctx.fillStyle = '#fce7f3';
      ctx.fillRect(0, 0, stickerCanvas.width, stickerCanvas.height);
    }

    // Draw stickers
    activeStickers.forEach((stk, idx) => {
      const def = StickerManager.getSticker(stk.id);
      if (def) {
        def.draw(ctx, stk.x, stk.y, stk.size);
      }
      // Highlight selected
      if (idx === selectedStickerIndex) {
        ctx.save();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(stk.x - stk.size / 2, stk.y - stk.size / 2, stk.size, stk.size);
        ctx.restore();
      }
    });
  }

  // Interactive Dragging on Canvas
  function getCanvasCoords(e) {
    const rect = stickerCanvas.getBoundingClientRect();
    const scaleX = stickerCanvas.width / rect.width;
    const scaleY = stickerCanvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function handlePointerDown(e) {
    const pos = getCanvasCoords(e);
    // Find topmost sticker hit
    let foundIndex = -1;
    for (let i = activeStickers.length - 1; i >= 0; i--) {
      const stk = activeStickers[i];
      const dist = Math.hypot(pos.x - stk.x, pos.y - stk.y);
      if (dist <= stk.size / 2) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex !== -1) {
      selectedStickerIndex = foundIndex;
      isDraggingSticker = true;
      dragOffset.x = pos.x - activeStickers[foundIndex].x;
      dragOffset.y = pos.y - activeStickers[foundIndex].y;
      drawCanvas();
    } else {
      selectedStickerIndex = -1;
      drawCanvas();
    }
  }

  function handlePointerMove(e) {
    if (!isDraggingSticker || selectedStickerIndex === -1) return;
    if (e.cancelable) e.preventDefault();
    const pos = getCanvasCoords(e);
    activeStickers[selectedStickerIndex].x = pos.x - dragOffset.x;
    activeStickers[selectedStickerIndex].y = pos.y - dragOffset.y;
    drawCanvas();
  }

  function handlePointerUp() {
    isDraggingSticker = false;
  }

  stickerCanvas.addEventListener('mousedown', handlePointerDown);
  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('mouseup', handlePointerUp);

  stickerCanvas.addEventListener('touchstart', handlePointerDown, { passive: false });
  window.addEventListener('touchmove', handlePointerMove, { passive: false });
  window.addEventListener('touchend', handlePointerUp);



  // 6b. Voice Testing Preview
  testVoiceBtn.addEventListener('click', () => {
    SoundFx.init();
    const text = messageInput.value.trim() || 'Happy Birthday to you champ!';
    const sender = senderNameInput.value.trim() || 'Aapke Family Member';
    testVoiceBtn.disabled = true;
    testVoiceBtn.innerHTML = '🔊 Cartoon Bol Raha Hai...';

    // Highlight character card mouth
    const activeCard = document.querySelector('.character-card.active');
    const avatarEl = activeCard ? activeCard.querySelector('.char-avatar') : null;

    CharacterManager.speak(
      selectedCharacterId,
      text,
      (isMouthOpen) => {
        if (avatarEl) {
          const char = CharacterManager.get(selectedCharacterId);
          avatarEl.innerHTML = char.renderSvg(isMouthOpen);
        }
      },
      () => {
        testVoiceBtn.disabled = false;
        testVoiceBtn.innerHTML = '🔊 Test Cartoon Voice';
        if (avatarEl) {
          const char = CharacterManager.get(selectedCharacterId);
          avatarEl.innerHTML = char.renderSvg(false);
        }
      },
      sender
    );
  });

  // 7. Voice Type Toggle (Cartoon Speech vs Real Audio Note)
  voiceTypeRadios.forEach((r) => {
    r.addEventListener('change', () => {
      SoundFx.click();
      if (r.value === 'audio') {
        audioRecorderSection.style.display = 'block';
        testVoiceBtn.style.display = 'none';
      } else {
        audioRecorderSection.style.display = 'none';
        testVoiceBtn.style.display = 'inline-flex';
      }
    });
  });

  // 8. Audio Recording
  recordAudioBtn.addEventListener('click', async () => {
    SoundFx.init();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      mediaRecorder.onstop = () => {
        recordedAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        audioPreview.src = URL.createObjectURL(recordedAudioBlob);
        audioPreview.style.display = 'block';
      };

      mediaRecorder.start();
      recordAudioBtn.style.display = 'none';
      stopAudioBtn.style.display = 'inline-flex';
      recordSeconds = 0;
      recordingTimer.textContent = '0:00';
      recordingTimer.style.display = 'inline';

      recordInterval = setInterval(() => {
        recordSeconds++;
        const mins = Math.floor(recordSeconds / 60);
        const secs = recordSeconds % 60;
        recordingTimer.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (recordSeconds >= 30) {
          stopAudioBtn.click();
        }
      }, 1000);
    } catch (err) {
      AppUtils.showToast('Microphone permission denied.');
    }
  });

  stopAudioBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
    }
    clearInterval(recordInterval);
    recordAudioBtn.style.display = 'inline-flex';
    stopAudioBtn.style.display = 'none';
    SoundFx.boing();
    AppUtils.showToast('Audio note recorded! 🎤');
  });

  // 9. Submit Form
  wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    SoundFx.init();

    const senderName = senderNameInput.value.trim();
    if (!senderName) {
      AppUtils.showToast('Kripya apna naam enter karein!');
      senderNameInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Submitting Wish...';

    // Unselect sticker outline for clean export
    selectedStickerIndex = -1;
    drawCanvas();
    const finalSelfieBase64 = stickerCanvas.toDataURL('image/png');

    const selectedVoiceType = document.querySelector('input[name="voiceType"]:checked').value;

    const formData = new FormData();
    formData.append('partyId', partyId);
    formData.append('senderName', senderName);
    formData.append('relation', relationInput.value.trim() || 'Family');
    formData.append('message', messageInput.value.trim() || 'Happy Birthday!');
    formData.append('characterId', selectedCharacterId);
    formData.append('voiceType', selectedVoiceType);
    formData.append('selfieBase64', finalSelfieBase64);

    if (selectedVoiceType === 'audio' && recordedAudioBlob) {
      formData.append('audio', recordedAudioBlob, 'voice.webm');
    }

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        SoundFx.cheer();
        AppUtils.showerConfetti();
        successModal.style.display = 'flex';

        const origin = window.location.origin;
        const currentWishUrl = `${origin}/wish?party=${partyId}`;
        const kidName = partyKidNameEl ? partyKidNameEl.textContent : 'Kid';
        const modalShareText = `🎂 Namaste! Maine abhi pyare ${kidName} ki birthday wish submit ki hai! 🎉\nAap bhi apni selfie upload karein aur cute cartoon voice mein wish bhejein! 🎈👇`;

        const modalWhatsappShareBtn = document.getElementById('modalWhatsappShareBtn');
        const modalCopyLinkBtn = document.getElementById('modalCopyLinkBtn');
        if (modalWhatsappShareBtn) modalWhatsappShareBtn.href = AppUtils.getWhatsAppShareUrl(modalShareText, currentWishUrl);
        if (modalCopyLinkBtn) {
          modalCopyLinkBtn.onclick = async () => {
            if (navigator.share) {
              try {
                await navigator.share({ title: `${kidName}'s Birthday Wish`, text: modalShareText, url: currentWishUrl });
                return;
              } catch (e) {}
            }
            navigator.clipboard.writeText(currentWishUrl);
            SoundFx.click();
            AppUtils.showToast('Wish link copied to clipboard! 📋');
          };
        }

        viewShowtimeBtn.onclick = () => {
          window.location.href = `/showtime?party=${partyId}`;
        };
      } else {
        AppUtils.showToast('Error: ' + (data.error || 'Submission failed'));
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🚀 Submit My Birthday Wish!';
      }
    } catch (err) {
      console.error(err);
      AppUtils.showToast('Network error while submitting wish.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '🚀 Submit My Birthday Wish!';
    }
  });
});

