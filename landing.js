// ── Canvas setup ──────────────────────────────────────────
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let W, H, stars = [], shooters = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); buildStars(); });

// ── Static twinkling stars ────────────────────────────────
function buildStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.7 + 0.2,
      phase: Math.random() * Math.PI * 2,
      spd:   Math.random() * 0.014 + 0.004,
      gold:  Math.random() < 0.12
    });
  }
}
buildStars();

// ── Shooting star factory ─────────────────────────────────
function spawnShooter() {
  shooters.push({
    x:     Math.random() * W * 0.55,
    y:     Math.random() * H * 0.38,
    len:   90 + Math.random() * 110,
    spd:   8  + Math.random() * 7,
    alpha: 1,
    angle: Math.PI / 5.2
  });
}
setInterval(() => { spawnShooter(); spawnShooter(); }, 2000);

// ── Draw loop ─────────────────────────────────────────────
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

  // Scattered ✦ sparkles
  const fixed = [
    [0.07,0.06,14],[0.28,0.09,10],[0.6,0.04,16],[0.88,0.08,11],
    [0.04,0.28,10],[0.94,0.22,13],[0.12,0.52,11],[0.9,0.58,10],
    [0.03,0.78,14],[0.5,0.93,10],[0.93,0.88,12],[0.48,0.14,10],
    [0.72,0.75,13],[0.18,0.88,11]
  ];
  fixed.forEach(([fx,fy,sz], i) => {
    const fl = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.018 + i * 0.7));
    ctx.save();
    ctx.globalAlpha = fl;
    ctx.fillStyle = '#f7e56b';
    ctx.font = `${sz}px serif`;
    ctx.fillText('✦', fx * W, fy * H);
    ctx.restore();
  });

  // Shooting stars with pink trail
  for (let i = shooters.length - 1; i >= 0; i--) {
    const s  = shooters[i];
    const dx = Math.cos(s.angle) * s.len;
    const dy = Math.sin(s.angle) * s.len;
    const g  = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
    g.addColorStop(0,   `rgba(255,160,210,${s.alpha})`);
    g.addColorStop(0.45,`rgba(255,100,185,${s.alpha * 0.45})`);
    g.addColorStop(1,   `rgba(255,80,165,0)`);

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - dx, s.y - dy);
    ctx.strokeStyle = g;
    ctx.lineWidth = 2.8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(s.x, s.y, 2.8, 0, Math.PI * 2);
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

// ── Duck click ────────────────────────────────────────────
const duck = document.getElementById('duckBtn');
const veil = document.getElementById('veil');

duck.addEventListener('click', handleEnter);
duck.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handleEnter(); });

function handleEnter() {
  burstParticles();
  veil.classList.add('active');
  setTimeout(() => { window.location.href = 'main.html'; }, 1100);
}

function burstParticles() {
  const r  = duck.getBoundingClientRect();
  const cx = r.left + r.width  / 2;
  const cy = r.top  + r.height / 2;
  const symbols = ['✦', '★', '✦', '♡', '✦'];

  for (let i = 0; i < 36; i++) {
    const el    = document.createElement('span');
    const angle = (i / 36) * Math.PI * 2;
    const dist  = 70 + Math.random() * 130;
    const sym   = symbols[Math.floor(Math.random() * symbols.length)];
    const color = Math.random() > 0.45 ? '#f7e56b' : '#ffb3d9';
    const size  = 10 + Math.random() * 16;

    el.textContent = sym;
    el.style.cssText = `
      position:fixed;
      left:${cx}px; top:${cy}px;
      font-size:${size}px;
      color:${color};
      pointer-events:none;
      z-index:1000;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(el);

    el.animate([
      { transform: 'translate(-50%,-50%) scale(1.2)', opacity: 1 },
      {
        transform: `translate(calc(-50% + ${Math.cos(angle)*dist}px),
                               calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`,
        opacity: 0
      }
    ], { duration: 650 + Math.random() * 450, easing: 'ease-out', fill: 'forwards' });

    setTimeout(() => el.remove(), 1200);
  }
}
