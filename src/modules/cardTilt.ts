import { $ } from './dom';

/** 3D gyro / mouse tilt for the luxury card. */
export function initCardTilt(): void {
  const cardWrapper = $('card-3d-wrapper');

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const xOffset = (window.innerWidth / 2 - e.clientX) / 24;
    const yOffset = (window.innerHeight / 2 - e.clientY) / 24;
    cardWrapper.style.transform = `rotateY(${-xOffset}deg) rotateX(${yOffset}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    cardWrapper.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}
