// ── Stars + shooting stars for main.html ──────────────────
const canvas = document.getElementById('mainCanvas');
const ctx    = canvas.getContext('2d');
let W, H, stars = [], shooters = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); buildStars(); });

function buildStars() {
  stars = [];
  for (let i = 0; i < 210; i++) {
    stars.push({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
      spd:   Math.random() * 0.013 + 0.004,
      gold:  Math.random() < 0.13
    });
  }
}
buildStars();

function spawnShooter() {
  shooters.push({
    x:     Math.random() * W * 0.55,
    y:     Math.random() * H * 0.38,
    len:   90 + Math.random() * 115,
    spd:   8  + Math.random() * 7,
    alpha: 1,
    angle: Math.PI / 5.2
  });
}
setInterval(() => { spawnShooter(); spawnShooter(); }, 2000);

function draw(t) {
  ctx.clearRect(0, 0, W, H);

  // Twinkling stars
  stars.forEach(s => {
    const a = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(t * s.spd + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.gold
      ? `rgba(247,229,107,${a})`
      : `rgba(207,240,220,${a})`;
    ctx.fill();
  });

  // Fixed ✦ sparkles around screen edges
  const fixed = [
    [0.06,0.05,13],[0.27,0.08,9],[0.62,0.04,15],[0.89,0.07,11],
    [0.03,0.27,10],[0.96,0.21,12],[0.11,0.51,10],[0.92,0.57,11],
    [0.04,0.79,13],[0.5,0.94,10],[0.94,0.87,12],[0.46,0.13,9],
    [0.73,0.76,12],[0.17,0.87,10],[0.35,0.96,9],[0.8,0.92,11]
  ];
  fixed.forEach(([fx,fy,sz], i) => {
    const fl = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.017 + i * 0.65));
    ctx.save();
    ctx.globalAlpha = fl;
    ctx.fillStyle = '#f7e56b';
    ctx.font = `${sz}px serif`;
    ctx.fillText('✦', fx * W, fy * H);
    ctx.restore();
  });

  // Shooting stars — pink light trail
  for (let i = shooters.length - 1; i >= 0; i--) {
    const s  = shooters[i];
    const dx = Math.cos(s.angle) * s.len;
    const dy = Math.sin(s.angle) * s.len;

    const g = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
    g.addColorStop(0,    `rgba(255,160,210,${s.alpha})`);
    g.addColorStop(0.4,  `rgba(255,100,185,${s.alpha * 0.45})`);
    g.addColorStop(1,    `rgba(255,80,165,0)`);

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - dx, s.y - dy);
    ctx.strokeStyle = g;
    ctx.lineWidth   = 2.8;
    ctx.stroke();

    // Head glow dot
    ctx.beginPath();
    ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,215,240,${s.alpha})`;
    ctx.fill();

    s.x     += Math.cos(s.angle) * s.spd;
    s.y     += Math.sin(s.angle) * s.spd;
    s.alpha -= 0.011;
    if (s.alpha <= 0) shooters.splice(i, 1);
  }

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// ── PDF fallback: if iframe errors, show open-link button ──
window.addEventListener('load', () => {
  const frame    = document.getElementById('pdfFrame');
  const fallback = document.querySelector('.pdf-fallback');
  if (!frame || !fallback) return;
  frame.addEventListener('error', () => {
    frame.style.display = 'none';
    fallback.classList.add('show');
  });
});
