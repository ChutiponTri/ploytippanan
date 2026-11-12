import { $ } from './dom';
import { musicBox } from './musicBox';
import { createExplosion } from './particles';
import { showToast } from './toast';
import { onSceneEnter } from './scenes';

interface RawPoint { x: number; y: number; group: number }
interface StarPoint { x: number; y: number; group: number; size: number }

// P L O Y + heart (from ploy.cpp spirit), on a 480x260 design grid
const RAW: RawPoint[] = [
  // P
  { x: 60, y: 70, group: 1 }, { x: 60, y: 190, group: 1 },
  { x: 100, y: 70, group: 1 }, { x: 115, y: 100, group: 1 }, { x: 60, y: 130, group: 1 },
  // L
  { x: 145, y: 70, group: 2 }, { x: 145, y: 190, group: 2 }, { x: 185, y: 190, group: 2 },
  // O
  { x: 230, y: 80, group: 3 }, { x: 260, y: 80, group: 3 },
  { x: 275, y: 130, group: 3 }, { x: 260, y: 180, group: 3 },
  { x: 230, y: 180, group: 3 }, { x: 215, y: 130, group: 3 },
  // Y
  { x: 305, y: 70, group: 4 }, { x: 330, y: 125, group: 4 },
  { x: 355, y: 70, group: 4 }, { x: 330, y: 190, group: 4 },
  // Glowing Heart
  { x: 410, y: 105, group: 5 }, { x: 425, y: 85, group: 5 },
  { x: 440, y: 105, group: 5 }, { x: 425, y: 140, group: 5 },
  { x: 395, y: 85, group: 5 },
];

export function initConstellation(): void {
  const skyCanvas = $<HTMLCanvasElement>('constellation-canvas');
  const skyCtx = skyCanvas.getContext('2d');
  if (!skyCtx) return;
  const ctx = skyCtx;

  function draw(): void {
    const w = skyCanvas.width;
    const h = skyCanvas.height;
    if (!w || !h) return;
    const scaleX = w / 480;
    const scaleY = h / 260;

    const points: StarPoint[] = RAW.map((pt) => ({
      x: pt.x * scaleX,
      y: pt.y * scaleY,
      group: pt.group,
      size: Math.random() * 2 + 3,
    }));

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(249, 217, 118, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffd700';

    for (let g = 1; g <= 5; g++) {
      const pts = points.filter((p) => p.group === g);
      if (pts.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      if (g === 1) ctx.lineTo(pts[0].x, pts[4].y);
      if (g === 3) ctx.closePath();
      if (g === 5) {
        ctx.lineTo(pts[0].x, pts[0].y);
        ctx.strokeStyle = 'rgba(255, 42, 109, 0.7)';
        ctx.shadowColor = '#ff2a6d';
      }
      ctx.stroke();
    }

    for (const pt of points) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fillStyle = pt.group === 5 ? '#ff2a6d' : '#f9d976';
      ctx.shadowBlur = 12;
      ctx.shadowColor = pt.group === 5 ? '#ff0055' : '#ffd700';
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function resize(): void {
    const parent = skyCanvas.parentElement;
    if (!parent) return;
    skyCanvas.width = parent.clientWidth;
    skyCanvas.height = parent.clientHeight;
    draw();
  }

  window.addEventListener('resize', resize);
  onSceneEnter('scene-constellation', () => setTimeout(resize, 100));

  $('redraw-stars-btn').addEventListener('click', () => {
    musicBox.playChimeSound();
    draw();
    showToast('✨ กลุ่มดาว P L O Y ส่องสว่างเพื่อเบ๊บ');
  });

  $('heart-pulse-constellation-btn').addEventListener('click', () => {
    musicBox.playBell(1046.5, 1.5);
    createExplosion(window.innerWidth / 2, window.innerHeight / 2, 50, 3);
    showToast('💖 หัวใจของเค้าเชื่อมโยงกับดาวของเบ๊บแล้วง้าบบ');
  });
}
