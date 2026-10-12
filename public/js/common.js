/**
 * Common App Utilities - ToonWish
 */

const AppUtils = (() => {
  // 1. Toast Notification
  function showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.9)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // 2. Query param
  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  // 3. WhatsApp Share URL
  function getWhatsAppShareUrl(text, url) {
    const full = `${text}\n${url || ''}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(full)}`;
  }

  // 4. Confetti Shower
  function showerConfetti() {
    let canvas = document.getElementById('confettiCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confettiCanvas';
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99998';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#f43f5e', '#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#fef08a'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 200,
        w: 8 + Math.random() * 6,
        h: 12 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: 3 + Math.random() * 4,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
      });
    }

    let frames = 0;
    function render() {
      frames++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (frames < 160) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    render();
  }

  return {
    showToast,
    getQueryParam,
    getWhatsAppShareUrl,
    showerConfetti,
  };
})();
