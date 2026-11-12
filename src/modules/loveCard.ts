import { $ } from './dom';
import { musicBox } from './musicBox';
import { createExplosion } from './particles';
import { showToast } from './toast';
import { anniversaryDate, yearsSinceAnniversary } from './anniversary';


const whispers = [
  'รักรอยยิ้มของเบ๊บที่สุดเลยค้าบ ✨',
  'เบ๊บคือของขวัญที่ดีที่สุดในชีวิตเค้าค้าบ 🎁',
  'ขอบคุณที่คอยอยู่ข้างๆ กันนะคนดี 💖',
  'วันนี้เบ๊บน่ารักกว่าเมื่อวานอีกนะรู้ไหมค้าบ 😊',
  'เค้าจะเป็นเซฟโซนให้เบ๊บเสมอและตลอดไปค้าบ 🏡',
  'อยากกอดเบ๊บแน่นๆ ทุกวันเลยค้าบ 🧸',
  'คิดถึงเบ๊บทุกลมหายใจเลยค้าบ 🌸',
  `ชอบเบ๊บมาตั้งแต่ 15 พ.ค. 2553 (${yearsSinceAnniversary()} ปีแล้ว) และจะรักตลอดไปค้าบ ❤️`,
];

function updateLoveTimer(timerText: HTMLElement): void {
  const now = new Date();

  let years = now.getFullYear() - anniversaryDate.getFullYear();
  let months = now.getMonth() - anniversaryDate.getMonth();
  let days = now.getDate() - anniversaryDate.getDate();
  let hours = now.getHours() - anniversaryDate.getHours();
  let minutes = now.getMinutes() - anniversaryDate.getMinutes();
  let seconds = now.getSeconds() - anniversaryDate.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }

  const totalDays = Math.floor((now.getTime() - anniversaryDate.getTime()) / 86_400_000);

  timerText.innerHTML = `
    <span class="time-badge">${totalDays.toLocaleString()} วัน</span>
    <span class="time-badge">${years} ปี ${months} เดือน ${days} วัน</span>
    <span class="time-badge">${hours} ชม. ${minutes} นาที ${seconds} วิ</span>
  `;
}

export function initLoveCard(): void {
  const timerText = $('counter-time-text');
  updateLoveTimer(timerText);
  setInterval(() => updateLoveTimer(timerText), 1000);

  // Sweet whispers
  let whisperIndex = 0;
  const whisperBtn = $('whisper-btn');
  const whisperText = $('whisper-text');

  whisperBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    whisperIndex = (whisperIndex + 1) % whispers.length;
    whisperText.innerText = whispers[whisperIndex];
    whisperBtn.style.borderColor = '#ff2a6d';
    whisperBtn.style.transform = 'scale(1.03)';
    setTimeout(() => (whisperBtn.style.transform = 'scale(1)'), 250);
    createExplosion(e.clientX, e.clientY, 18, 1.2);
    musicBox.playBell(880, 0.8);
  });

  // Mega heart
  $('mega-heart-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    musicBox.playChimeSound();
    createExplosion(cx, cy, 80, 2.5);
    setTimeout(() => createExplosion(cx, cy, 60, 4), 180);
    setTimeout(() => createExplosion(cx, cy, 90, 6), 360);

    const flash = document.createElement('div');
    Object.assign(flash.style, {
      position: 'fixed',
      inset: '0',
      background: 'radial-gradient(circle, rgba(255, 42, 109, 0.45) 0%, transparent 80%)',
      zIndex: '350',
      pointerEvents: 'none',
      transition: 'opacity 0.8s ease-out',
    });
    document.body.appendChild(flash);
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 800);
    }, 50);

    showToast('เค้ารักเบ๊บทุกลมหายใจนะค้าบ ❤️');
  });
}
