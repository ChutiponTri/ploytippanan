import { $ } from './dom';
import { musicBox } from './musicBox';
import { createExplosion } from './particles';
import { switchScene } from './scenes';
import { logMilestone } from './tracker';
import { yearsSinceAnniversary } from './anniversary';

/** 3D love letter & interactive proposal choice. */
export function initLetter(): void {
  const envelopeBox = $('envelope-box');
  const paperLetter = $('paper-letter');
  const btnSayYes = $<HTMLButtonElement>('btn-say-yes');
  const btnPlayfulNo = $<HTMLButtonElement>('btn-playful-no');
  const celebrationModal = $('celebration-modal');

  // Years in the letter follow the real calendar
  $('letter-years').textContent = String(yearsSinceAnniversary());

  envelopeBox.addEventListener('click', (e) => {
    musicBox.playChimeSound();
    createExplosion(e.clientX, e.clientY, 35, 1.5);

    envelopeBox.style.transform = 'scale(0.8) translateY(-30px)';
    envelopeBox.style.opacity = '0';

    setTimeout(() => {
      envelopeBox.style.display = 'none';
      paperLetter.style.display = 'block';
      void logMilestone('Letter Opened');
    }, 400);
  });

  let dodgeCount = 0;

  function handleYesChoice(): void {
    void logMilestone('Said YES to Ton', { dodgeCount });
    musicBox.playChimeSound();

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    createExplosion(cx, cy, 120, 3);
    setTimeout(() => createExplosion(cx, cy, 140, 5), 250);
    setTimeout(() => createExplosion(cx, cy, 160, 7), 500);

    celebrationModal.classList.add('active');
  }

  function dodgeNoButton(): void {
    dodgeCount++;
    if (dodgeCount > 3) {
      btnPlayfulNo.innerText = 'ยอมแล้ว รักต้นก็ได้! 🥰';
      btnPlayfulNo.style.background = 'linear-gradient(135deg, #ff2a6d, #f9a8d4)';
      btnPlayfulNo.style.color = '#fff';
      btnPlayfulNo.style.transform = '';
      btnPlayfulNo.removeEventListener('mouseenter', dodgeNoButton);
      btnPlayfulNo.removeEventListener('touchstart', onNoTouch);
      btnPlayfulNo.addEventListener('click', handleYesChoice);
      return;
    }

    const randX = (Math.random() - 0.5) * 160;
    const randY = (Math.random() - 0.5) * 80;
    btnPlayfulNo.style.transform = `translate(${randX}px, ${randY}px)`;
  }

  function onNoTouch(e: TouchEvent): void {
    e.preventDefault();
    dodgeNoButton();
  }

  btnPlayfulNo.addEventListener('mouseenter', dodgeNoButton);
  btnPlayfulNo.addEventListener('touchstart', onNoTouch);
  btnSayYes.addEventListener('click', handleYesChoice);

  $('close-celebration-btn').addEventListener('click', () => {
    celebrationModal.classList.remove('active');
    switchScene('scene-card');
  });

}
