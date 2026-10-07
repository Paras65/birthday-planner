/**
 * StickerManager - Interactive canvas decorator for family selfies
 */
const StickerManager = (() => {
  const stickerDefs = [
    {
      id: 'party-hat',
      name: 'Party Hat',
      emoji: '🥳',
      draw: (ctx, x, y, size) => {
        ctx.save();
        ctx.translate(x, y);
        // Triangle hat
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(-size / 2.5, size / 2);
        ctx.lineTo(size / 2.5, size / 2);
        ctx.closePath();
        ctx.fillStyle = '#ff4081';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#c2185b';
        ctx.stroke();

        // Stripes
        ctx.beginPath();
        ctx.moveTo(-size / 5, -size / 10);
        ctx.lineTo(size / 5, -size / 10);
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-size / 3.2, size / 4);
        ctx.lineTo(size / 3.2, size / 4);
        ctx.strokeStyle = '#06d6a0';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Pom pom on top
        ctx.beginPath();
        ctx.arc(0, -size / 2, size / 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd166';
        ctx.fill();
        ctx.restore();
      },
    },
    {
      id: 'sunglasses',
      name: 'Cool Goggles',
      emoji: '🕶️',
      draw: (ctx, x, y, size) => {
        ctx.save();
        ctx.translate(x, y);
        const w = size * 0.9;
        const h = size * 0.35;
        // Frames
        ctx.fillStyle = '#1e293b';
        // Left lens
        roundRect(ctx, -w / 2, -h / 2, w * 0.42, h, 8);
        ctx.fill();
        // Right lens
        roundRect(ctx, w * 0.08, -h / 2, w * 0.42, h, 8);
        ctx.fill();
        // Bridge
        ctx.fillRect(-w * 0.08, -h * 0.2, w * 0.16, h * 0.25);
        // Glare shine
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-w * 0.4, -h * 0.2);
        ctx.lineTo(-w * 0.18, h * 0.2);
        ctx.moveTo(w * 0.18, -h * 0.2);
        ctx.lineTo(w * 0.4, h * 0.2);
        ctx.stroke();
        ctx.restore();
      },
    },
    {
      id: 'crown',
      name: 'Golden Crown',
      emoji: '👑',
      draw: (ctx, x, y, size) => {
        ctx.save();
        ctx.translate(x, y);
        const w = size * 0.85;
        const h = size * 0.55;
        ctx.beginPath();
        ctx.moveTo(-w / 2, h / 2);
        ctx.lineTo(-w / 2, -h / 4);
        ctx.lineTo(-w / 4, 0);
        ctx.lineTo(0, -h / 2);
        ctx.lineTo(w / 4, 0);
        ctx.lineTo(w / 2, -h / 4);
        ctx.lineTo(w / 2, h / 2);
        ctx.closePath();
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#b45309';
        ctx.stroke();

        // Jewels
        [-w / 2, 0, w / 2].forEach((jx, idx) => {
          ctx.beginPath();
          ctx.arc(jx, idx === 1 ? -h / 2 : -h / 4, 5, 0, Math.PI * 2);
          ctx.fillStyle = idx === 1 ? '#ef4444' : '#3b82f6';
          ctx.fill();
        });
        ctx.restore();
      },
    },
    {
      id: 'hero-mask',
      name: 'Hero Mask',
      emoji: '🦸',
      draw: (ctx, x, y, size) => {
        ctx.save();
        ctx.translate(x, y);
        const w = size * 0.95;
        const h = size * 0.4;
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.ellipse(-w * 0.25, 0, w * 0.25, h * 0.5, -0.1, 0, Math.PI * 2);
        ctx.ellipse(w * 0.25, 0, w * 0.25, h * 0.5, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Eye cutouts
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(-w * 0.25, 0, w * 0.12, h * 0.28, 0, 0, Math.PI * 2);
        ctx.ellipse(w * 0.25, 0, w * 0.12, h * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
    },
    {
      id: 'bunny-ears',
      name: 'Bunny Ears',
      emoji: '🐰',
      draw: (ctx, x, y, size) => {
        ctx.save();
        ctx.translate(x, y);
        const h = size * 0.8;
        // Left outer ear
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(-size * 0.25, -h * 0.35, size * 0.15, h * 0.45, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Left inner pink
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.ellipse(-size * 0.25, -h * 0.35, size * 0.08, h * 0.3, -0.15, 0, Math.PI * 2);
        ctx.fill();

        // Right outer ear
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(size * 0.25, -h * 0.35, size * 0.15, h * 0.45, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Right inner pink
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.ellipse(size * 0.25, -h * 0.35, size * 0.08, h * 0.3, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
    },
    {
      id: 'clown-nose',
      name: 'Clown Nose',
      emoji: '🤡',
      draw: (ctx, x, y, size) => {
        ctx.save();
        ctx.translate(x, y);
        const r = size * 0.25;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        // Highlight
        ctx.beginPath();
        ctx.arc(-r * 0.3, -r * 0.3, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        ctx.restore();
      },
    },
    {
      id: 'bowtie',
      name: 'Party Bowtie',
      emoji: '🎀',
      draw: (ctx, x, y, size) => {
        ctx.save();
        ctx.translate(x, y);
        const w = size * 0.7;
        const h = size * 0.35;
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-w / 2, -h / 2);
        ctx.lineTo(-w / 2, h / 2);
        ctx.closePath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w / 2, -h / 2);
        ctx.lineTo(w / 2, h / 2);
        ctx.closePath();
        ctx.fill();
        // Center knot
        ctx.beginPath();
        ctx.arc(0, 0, h * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd166';
        ctx.fill();
        ctx.restore();
      },
    },
  ];

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function getStickers() {
    return stickerDefs;
  }

  function getSticker(id) {
    return stickerDefs.find((s) => s.id === id) || stickerDefs[0];
  }

  return {
    getStickers,
    getSticker,
  };
})();

