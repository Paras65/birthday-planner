/**
 * ReelEngine: High-End 9:16 WhatsApp Birthday Video Reel Canvas Renderer & Video Exporter
 */

const ReelEngine = (() => {
  let canvas = null;
  let ctx = null;
  let party = null;
  let wishes = [];
  let isPlaying = false;
  let isRecording = false;
  let mediaRecorder = null;
  let recordedChunks = [];

  // Timeline & State
  let currentSceneIndex = 0;
  let sceneProgress = 0; // 0.0 to 1.0
  let sceneDurationMs = 4500; // 4.5 seconds per family wish
  let lastFrameTime = 0;
  let animFrameId = null;

  // Cached preloaded images
  const imageCache = {};

  // Particle systems
  const confettiParticles = [];
  const bokehParticles = [];

  function init(canvasEl, partyData, wishesData) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    party = partyData;
    wishes = wishesData || [];

    // Set 9:16 portrait resolution
    canvas.width = 720;
    canvas.height = 1280;

    initParticles();
    preloadImages();
  }

  function initParticles() {
    confettiParticles.length = 0;
    bokehParticles.length = 0;

    const colors = ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6', '#f43f5e', '#fef08a'];
    for (let i = 0; i < 70; i++) {
      confettiParticles.push({
        x: Math.random() * 720,
        y: Math.random() * 1280,
        w: 6 + Math.random() * 8,
        h: 10 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1.5 + Math.random() * 3,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 6,
      });
    }

    for (let i = 0; i < 25; i++) {
      bokehParticles.push({
        x: Math.random() * 720,
        y: Math.random() * 1280,
        r: 15 + Math.random() * 40,
        vy: -0.4 - Math.random() * 0.8,
        alpha: 0.1 + Math.random() * 0.25,
      });
    }
  }

  function preloadImages() {
    const urls = [party.kidPhotoUrl];
    wishes.forEach((w) => urls.push(w.photoUrl));

    urls.forEach((url) => {
      if (url && !imageCache[url]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        img.onload = () => {
          imageCache[url] = img;
        };
      }
    });
  }

  function getImage(url) {
    return imageCache[url] || null;
  }

  // Total Scenes: Scene 0 (Kid Intro) + N (Wishes) + Scene N+1 (Grand Finale)
  function getTotalScenes() {
    return 1 + (wishes ? wishes.length : 0) + 1;
  }

  // Main Render Loop
  function startPlayback() {
    if (isPlaying) return;
    isPlaying = true;
    PartyBeats.startPartyLoop();
    lastFrameTime = performance.now();
    animFrameId = requestAnimationFrame(renderLoop);
  }

  function pausePlayback() {
    isPlaying = false;
    PartyBeats.stopPartyLoop();
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function resetPlayback() {
    currentSceneIndex = 0;
    sceneProgress = 0;
    lastFrameTime = performance.now();
  }

  function nextScene() {
    if (currentSceneIndex < getTotalScenes() - 1) {
      currentSceneIndex++;
      sceneProgress = 0;
    } else {
      currentSceneIndex = 0;
      sceneProgress = 0;
    }
  }

  function prevScene() {
    if (currentSceneIndex > 0) {
      currentSceneIndex--;
      sceneProgress = 0;
    }
  }

  function renderLoop(now) {
    if (!isPlaying && !isRecording) return;

    const delta = now - lastFrameTime;
    lastFrameTime = now;

    // Advance scene progress
    sceneProgress += delta / sceneDurationMs;
    if (sceneProgress >= 1.0) {
      sceneProgress = 0;
      currentSceneIndex++;
      if (currentSceneIndex >= getTotalScenes()) {
        if (isRecording) {
          stopRecording();
          return;
        }
        currentSceneIndex = 0; // loop reel
      }
    }

    // Clear and draw scene
    renderCurrentFrame();

    animFrameId = requestAnimationFrame(renderLoop);
  }

  function renderCurrentFrame() {
    ctx.clearRect(0, 0, 720, 1280);

    // 1. Draw Festive Animated Background
    drawFestiveBackground();

    // 2. Draw Floating Bokeh & Confetti
    drawBokeh();
    drawConfetti();

    // 3. Draw Scene Content
    if (currentSceneIndex === 0) {
      drawIntroScene();
    } else if (currentSceneIndex <= wishes.length) {
      drawWishScene(wishes[currentSceneIndex - 1]);
    } else {
      drawFinaleScene();
    }

    // 4. Draw Segmented Story Progress Bar (Instagram / WhatsApp Reels style)
    drawProgressBars();
  }

  // Background Gradient & Aura
  function drawFestiveBackground() {
    const grad = ctx.createLinearGradient(0, 0, 720, 1280);
    grad.addColorStop(0, '#1e1b4b'); // Deep Royal Indigo
    grad.addColorStop(0.4, '#4c0519'); // Rich Festive Crimson
    grad.addColorStop(0.8, '#831843'); // Warm Rose
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 720, 1280);

    // Center Golden Radial Spotlight
    const rad = ctx.createRadialGradient(360, 520, 50, 360, 520, 480);
    rad.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 720, 1280);
  }

  function drawBokeh() {
    bokehParticles.forEach((b) => {
      b.y += b.vy;
      if (b.y < -50) b.y = 1330;

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253, 224, 71, ${b.alpha})`;
      ctx.fill();
    });
  }

  function drawConfetti() {
    confettiParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vRot;
      if (p.y > 1300) p.y = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
  }

  // ==========================================
  // SCENE 0: KID SPOTLIGHT INTRO
  // ==========================================
  function drawIntroScene() {
    // Zoom factor for smooth Ken Burns motion (1.0 to 1.08)
    const zoom = 1.0 + sceneProgress * 0.08;

    // Header Badge
    ctx.save();
    ctx.textAlign = 'center';

    // "HAPPY BIRTHDAY" Top Banner
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.fillText('✨ CELEBRATION REEL ✨', 360, 160);

    // Giant Kid Photo Frame with Golden Border
    ctx.save();
    ctx.translate(360, 480);
    ctx.scale(zoom, zoom);

    // Glowing Frame Shadow
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 35;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(-210, -210, 420, 420, 32);
    ctx.fill();

    // Kid Photo Clip
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-195, -195, 390, 390, 24);
    ctx.clip();

    const img = getImage(party.kidPhotoUrl);
    if (img) {
      ctx.drawImage(img, -195, -195, 390, 390);
    } else {
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(-195, -195, 390, 390);
      ctx.font = '100px sans-serif';
      ctx.fillStyle = '#991b1b';
      ctx.fillText('🎂', 0, 30);
    }
    ctx.restore();
    ctx.restore(); // end photo zoom

    // Kid's Name Title
    ctx.font = '900 68px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 20;
    ctx.fillText(party.kidName, 360, 780);

    // Subtitle: "[Age]th Birthday Celebration!"
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.fillText(`Turns ${party.kidAge} Today! 👑🎈`, 360, 850);

    // Family blessings prompt
    ctx.font = '600 28px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowBlur = 0;
    ctx.fillText('With blessings & wishes from whole family ❤️', 360, 930);

    ctx.restore();
  }

  // ==========================================
  // SCENES 1..N: FAMILY WISH CARD
  // ==========================================
  function drawWishScene(wish) {
    if (!wish) return;

    // Smooth entry slide-in
    const slideOffset = Math.max(0, (1.0 - Math.min(1.0, sceneProgress * 4.0)) * 40);

    ctx.save();
    ctx.textAlign = 'center';

    // Header tag
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.fillText('💌 FAMILY WISH & BLESSING', 360, 160);

    // Main Card Box (Glassmorphic White Card)
    ctx.save();
    ctx.translate(360, 560 + slideOffset);

    // Card Glow
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(-290, -320, 580, 640, 36);
    ctx.fill();

    // Family Member Photo Circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, -170, 110, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, -170, 102, 0, Math.PI * 2);
    ctx.clip();

    const img = getImage(wish.photoUrl);
    if (img) {
      ctx.drawImage(img, -102, -272, 204, 204);
    } else {
      ctx.fillStyle = '#fecdd3';
      ctx.fillRect(-102, -272, 204, 204);
      ctx.font = '70px sans-serif';
      ctx.fillStyle = '#e11d48';
      ctx.fillText('👤', 0, -145);
    }
    ctx.restore();
    ctx.restore(); // end photo circle

    // Sender Name
    ctx.font = '900 46px sans-serif';
    ctx.fillStyle = '#1e1b4b';
    ctx.shadowBlur = 0;
    ctx.fillText(wish.senderName, 0, -20);

    // Relation Badge (Pill)
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(-90, 8, 180, 44, 22);
    ctx.fill();
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(wish.relation || 'Family', 0, 38);

    // Heartfelt Comment / Message
    ctx.font = 'italic 700 32px sans-serif';
    ctx.fillStyle = '#334155';
    wrapText(ctx, `“${wish.comment}”`, 0, 120, 480, 42);

    ctx.restore(); // end card translate
    ctx.restore();
  }

  // ==========================================
  // SCENE N+1: GRAND CELEBRATION FINALE
  // ==========================================
  function drawFinaleScene() {
    ctx.save();
    ctx.textAlign = 'center';

    // Top Header
    ctx.font = '900 64px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 25;
    ctx.fillText('WE ALL LOVE YOU! ❤️', 360, 220);

    ctx.font = 'bold 42px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.fillText(`Happy Birthday, ${party.kidName}!`, 360, 290);

    // Giant Cake
    ctx.font = '160px sans-serif';
    ctx.fillText('🎂', 360, 520);

    // Floating Collage of Family Avatars around the cake
    const radius = 240;
    const count = Math.min(8, wishes.length);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = 360 + Math.cos(angle) * radius;
      const y = 780 + Math.sin(angle) * (radius * 0.7);

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 46, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 15;
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.clip();

      const img = getImage(wishes[i].photoUrl);
      if (img) {
        ctx.drawImage(img, x - 40, y - 40, 80, 80);
      } else {
        ctx.fillStyle = '#fecdd3';
        ctx.fillRect(x - 40, y - 40, 80, 80);
        ctx.font = '32px sans-serif';
        ctx.fillText('❤️', x, y + 10);
      }
      ctx.restore();
      ctx.restore();
    }

    // Bottom Closing Banner
    ctx.font = '900 36px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 15;
    ctx.fillText('🎉 May All Your Dreams Come True! 🌟', 360, 1140);

    ctx.restore();
  }

  // Multi-line Text Wrap
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, currY);
  }

  // Segmented Progress Bar (Reel Stories Style)
  function drawProgressBars() {
    const total = getTotalScenes();
    const margin = 20;
    const gap = 8;
    const barWidth = (720 - margin * 2 - gap * (total - 1)) / total;
    const barHeight = 6;
    const y = 40;

    for (let i = 0; i < total; i++) {
      const x = margin + i * (barWidth + gap);

      // Track background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 3);
      ctx.fill();

      // Filled progress
      let fillRatio = 0;
      if (i < currentSceneIndex) fillRatio = 1.0;
      else if (i === currentSceneIndex) fillRatio = sceneProgress;

      if (fillRatio > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth * fillRatio, barHeight, 3);
        ctx.fill();
      }
    }
  }

  // ==========================================
  // REAL VIDEO RECORDER & EXPORTER (MP4/WebM)
  // ==========================================
  async function recordVideo(onProgress, onComplete) {
    if (isRecording) return;
    isRecording = true;
    recordedChunks = [];

    // Ensure audio and canvas are ready
    PartyBeats.init();
    const canvasStream = canvas.captureStream(30); // 30 fps
    const audioStream = PartyBeats.getAudioStream();

    // Merge audio tracks into canvas stream
    const combinedStream = new MediaStream();
    canvasStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track));
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));
    }

    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 3500000, // High quality 3.5 Mbps
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      isRecording = false;
      PartyBeats.stopPartyLoop();
      pausePlayback();

      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      if (onComplete) onComplete(blob);
    };

    // Reset and start recording from Scene 0
    resetPlayback();
    PartyBeats.startPartyLoop();
    mediaRecorder.start();

    // Render loop drives the recording
    lastFrameTime = performance.now();
    animFrameId = requestAnimationFrame(renderLoop);
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }

  return {
    init,
    startPlayback,
    pausePlayback,
    resetPlayback,
    nextScene,
    prevScene,
    recordVideo,
    stopRecording,
    getTotalScenes,
    getCurrentSceneIndex: () => currentSceneIndex,
  };
})();
