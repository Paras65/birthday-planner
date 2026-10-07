/**
 * Common utilities: Confetti, Toast, Particles, URL helpers
 */
const AppUtils = (() => {
  // Query param helper
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // Toast banner
  function showToast(message, duration = 2500) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast-banner';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Confetti Engine
  class ConfettiCannon {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'confetti-canvas';
      this.canvas.className = 'confetti-canvas';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 75) {
      const colors = ['#ff4d94', '#ffd166', '#06d6a0', '#118ab2', '#ffbe0b', '#8338ec', '#fb5607'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 15,
          gravity: 0.35,
          drag: 0.98,
          opacity: 1,
        });
      }
      if (!this.animId) this.loop();
    }

    shower(count = 120) {
      this.burst(window.innerWidth * 0.2, window.innerHeight * 0.3, count / 2);
      this.burst(window.innerWidth * 0.8, window.innerHeight * 0.3, count / 2);
    }

    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008;

        if (p.opacity <= 0 || p.y > this.canvas.height) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
      }
    }
  }

  let cannon = null;
  function shootConfetti(x, y) {
    if (!cannon) cannon = new ConfettiCannon();
    cannon.burst(x, y);
  }

  function showerConfetti() {
    if (!cannon) cannon = new ConfettiCannon();
    cannon.shower();
  }

  // Floating Kid Reaction Emoji Spark
  function spawnReactionEmoji(emoji, x, y) {
    const el = document.createElement('div');
    el.className = 'floating-reaction-emoji';
    el.textContent = emoji;
    el.style.left = `${x || window.innerWidth / 2}px`;
    el.style.top = `${y || window.innerHeight - 100}px`;
    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 1400);
  }

  // WhatsApp share link builder
  function getWhatsAppShareUrl(text, url) {
    const fullText = encodeURIComponent(`${text}\n👉 ${url}`);
    return `https://api.whatsapp.com/send?text=${fullText}`;
  }

  return {
    getQueryParam,
    showToast,
    shootConfetti,
    showerConfetti,
    spawnReactionEmoji,
    getWhatsAppShareUrl,
  };
})();

