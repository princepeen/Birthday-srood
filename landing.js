const duck = document.getElementById('duckBtn');
const veil = document.getElementById('veil');

duck.addEventListener('click', handleEnter);

function handleEnter() {
  burstParticles();
  veil.classList.add('active');
  setTimeout(() => { window.location.href = 'main.html'; }, 1100);
}

function burstParticles() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.58;
  const symbols = ['✦', '★', '✦', '♡', '✦'];

  for (let i = 0; i < 36; i++) {
    const el    = document.createElement('span');
    const angle = (i / 36) * Math.PI * 2;
    const dist  = 70 + Math.random() * 130;
    const color = Math.random() > 0.45 ? '#f7e56b' : '#ffb3d9';
    const size  = 10 + Math.random() * 16;

    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      font-size: ${size}px;
      color: ${color};
      pointer-events: none;
      z-index: 1000;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(el);

    el.animate([
      { transform: 'translate(-50%,-50%) scale(1.2)', opacity: 1 },
      {
        transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px),
                               calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`,
        opacity: 0
      }
    ], { duration: 650 + Math.random() * 450, easing: 'ease-out', fill: 'forwards' });

    setTimeout(() => el.remove(), 1200);
  }
}
