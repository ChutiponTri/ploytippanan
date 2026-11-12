import { $ } from './dom';

interface Star {
  x: number; y: number; radius: number; alpha: number; speed: number; phase: number;
}

interface Petal {
  x: number; y: number; size: number; speedY: number; speedX: number;
  angle: number; rotationSpeed: number; swayPhase: number; color: string;
}

const STAR_COUNT = 75;
const PETAL_COUNT = 26;

/** Background canvas: stardust, twinkles & rose petals. */
export function initBackgroundFx(): void {
  const canvas = $<HTMLCanvasElement>('fx-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const stars: Star[] = [];
  const petals: Petal[] = [];

  function initStars(): void {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function initPetals(): void {
    petals.length = 0;
    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 7,
        speedY: Math.random() * 1 + 0.5,
        speedX: Math.random() * 0.8 - 0.4,
        angle: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        swayPhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? 'rgba(255, 60, 110,' : 'rgba(255, 140, 170,',
      });
    }
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  initStars();
  initPetals();

  function render(): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (const s of stars) {
      s.phase += s.speed;
      const brightness = s.alpha * (0.6 + 0.4 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffb3c6';
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    for (const p of petals) {
      p.y += p.speedY;
      p.swayPhase += 0.02;
      p.x += Math.sin(p.swayPhase) * 0.7 + p.speedX;
      p.angle += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);

      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.45)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-p.size * 0.15, -p.size * 0.3, p.size * 0.25, 0, Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
