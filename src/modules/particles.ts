const colors = ['#ff2a6d', '#ff7597', '#ffd3e2', '#f9d976', '#ffffff', '#ff0055'];
const shapes = ['❤', '✨', '✦', '🌸', '💍'];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

let lastTrail = 0;
function spawnTrail(x: number, y: number): void {
  const now = Date.now();
  if (now - lastTrail < 28) return;
  lastTrail = now;

  const trail = document.createElement('div');
  trail.className = 'particle cursor-trail';
  trail.textContent = pick(shapes);
  trail.style.color = pick(colors);
  trail.style.left = `${x - 8}px`;
  trail.style.top = `${y - 8}px`;
  trail.style.fontSize = `${Math.random() * 0.8 + 0.6}rem`;

  document.body.appendChild(trail);
  setTimeout(() => trail.remove(), 900);
}

export function createExplosion(x: number, y: number, count = 25, multiplier = 1): void {
  const ripple = document.createElement('div');
  ripple.className = 'shockwave-ripple';
  ripple.style.setProperty('--x', `${x}px`);
  ripple.style.setProperty('--y', `${y}px`);
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1000);

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle burst-particle';
    p.textContent = pick(shapes);
    p.style.color = pick(colors);
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = (Math.random() * 120 + 60) * multiplier;
    p.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
    p.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
    p.style.setProperty('--s', String(Math.random() * 1.4 + 0.6));
    p.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
    p.style.fontSize = `${Math.random() * 1.2 + 0.7}rem`;

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

export function initParticles(): void {
  window.addEventListener('pointermove', (e) => spawnTrail(e.clientX, e.clientY));

  document.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    if (target?.closest('button, label, .quest-bear, .bottom-dock, .whisper-box, .loop-log')) return;
    createExplosion(e.clientX, e.clientY, 14, 1);
  });
}
