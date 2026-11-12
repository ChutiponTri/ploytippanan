import { $ } from './dom';
import { musicBox } from './musicBox';
import { createExplosion } from './particles';
import { showToast } from './toast';
import { switchScene } from './scenes';
import { logMilestone } from './tracker';

const TARGET_BEARS = 7;
const bearPhrases = [
  '🧸 ตัวที่ 1: เบ๊บน่ารักที่สุดในสายตาเค้าเสมอค้าบ',
  '🧸 ตัวที่ 2: รอยยิ้มของเบ๊บคือพลังใจของเค้าในทุกๆ วัน',
  '🧸 ตัวที่ 3: ขอบคุณที่ทำให้ทุกวันมีความหมายนะงับ',
  '🧸 ตัวที่ 4: ชอบเวลาเบ๊บหัวเราะมากที่สุดเลยค้าบ',
  '🧸 ตัวที่ 5: กอดของเบ๊บอุ่นที่สุดในโลกเลย',
  '🧸 ตัวที่ 6: เค้าจะคอยซัพพอร์ตเบ๊บทุกเรื่องนะค้าบ',
  '🧸 ตัวที่ 7: เค้ารักเบ๊บที่สุดในหัวใจเลยย!',
];

export function initBearQuest(): void {
  let bearsFound = 0;
  const bearCountText = $('bear-count-text');
  const bearProgressBar = $('bear-progress-bar');
  const bearStatusDesc = $('bear-status-desc');

  function onAllBearsCompleted(): void {
    void logMilestone('Bears Completed', { count: TARGET_BEARS });
    showToast('🎉 ยอดเยี่ยมมาก! เบ๊บจับหมีครบ 7 ตัวแล้วค้าบ ❤️');

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    musicBox.playChimeSound();
    createExplosion(cx, cy, 100, 3);
    setTimeout(() => createExplosion(cx, cy, 120, 5), 300);

    setTimeout(() => {
      switchScene('scene-letter');
      showToast('📜 มีจดหมายพิเศษที่เค้าเขียนให้เบ๊บค้าบบ!');
    }, 1200);
  }

  function spawnQuestBear(): void {
    if (bearsFound >= TARGET_BEARS) return;

    const bearEl = document.createElement('div');
    bearEl.className = 'quest-bear';
    bearEl.textContent = '🧸';

    const padding = 70;
    bearEl.style.left = `${Math.random() * (window.innerWidth - padding * 2) + padding}px`;
    bearEl.style.top = `${Math.random() * (window.innerHeight - padding * 2) + padding}px`;
    document.body.appendChild(bearEl);

    bearEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bearsFound >= TARGET_BEARS) return;
      bearsFound++;
      musicBox.playBell(700 + bearsFound * 60, 0.8);

      bearCountText.innerText = `จับเจ้าหมีได้ ${bearsFound} / ${TARGET_BEARS} ตัว`;
      bearProgressBar.style.width = `${(bearsFound / TARGET_BEARS) * 100}%`;

      const phrase = bearPhrases[bearsFound - 1];
      bearStatusDesc.innerText = phrase;
      showToast(phrase);

      createExplosion(e.clientX, e.clientY, 35, 1.8);
      bearEl.remove();

      if (bearsFound === TARGET_BEARS) onAllBearsCompleted();
    });

    setTimeout(() => bearEl.remove(), 4300);
  }

  $('summon-bear-btn').addEventListener('click', () => {
    spawnQuestBear();
    showToast('🧸 เจ้าหมีกำลังวิ่งเล่นอยู่รอบๆ จิ้มให้ทันนะค้าบ!');
  });

  setInterval(() => {
    if (bearsFound < TARGET_BEARS && Math.random() > 0.45) spawnQuestBear();
  }, 3200);
}
