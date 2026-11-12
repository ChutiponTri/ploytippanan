import { $ } from './dom';
import { musicBox } from './musicBox';
import { createExplosion } from './particles';
import { showToast } from './toast';
import { logMilestone } from './tracker';

/**
 * Million Love Loop:
 *   for (let i = 1; i <= 1_000_000; i++) say(`เค้ารักเบ๊บนะ ${i}`)
 *
 * Counts STEP_PER_FRAME lines every animation frame (~60 fps),
 * so 1M takes about 1,000,000 / (STEP_PER_FRAME * 60) seconds.
 * Progress is remembered in localStorage so it can resume later.
 */
const TOTAL = 1_000_000;
const PHRASE = 'เค้ารักเบ๊บนะ';
const STORAGE_KEY = 'ploy_love_loop_i';
const LOG_LIMIT = 40;
const STEP_PER_FRAME = 100; // ≈ 6,000 / sec → 1M in ~3 min

const fmt = (n: number) => n.toLocaleString('en-US');

function loadProgress(): number {
  try {
    const v = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(v) && v > 0 && v <= TOTAL ? Math.floor(v) : 0;
  } catch {
    return 0;
  }
}

function saveProgress(i: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(i));
  } catch {
    /* storage unavailable — fine */
  }
}

export function initLoveLoop(): void {
  const currentEl = $('loop-current');
  const progressBar = $('loop-progress-bar');
  const progressText = $('loop-progress-text');
  const runBtn = $<HTMLButtonElement>('loop-run-btn');
  const runIcon = $('loop-run-icon');
  const runLabel = $('loop-run-label');
  const resetBtn = $<HTMLButtonElement>('loop-reset-btn');
  const logEl = $('loop-log');

  let i = loadProgress();
  let frameId: number | null = null;

  function appendLog(n: number): void {
    const line = document.createElement('div');
    line.className = 'loop-log-line';
    line.textContent = `${PHRASE} ${fmt(n)}`;
    logEl.prepend(line);
    while (logEl.childElementCount > LOG_LIMIT) logEl.lastElementChild?.remove();
  }

  function render(): void {
    currentEl.textContent = `${PHRASE} ${fmt(i)}`;
    progressBar.style.width = `${(i / TOTAL) * 100}%`;
    progressText.textContent = `${fmt(i)} / ${fmt(TOTAL)}`;
  }

  function setRunningUi(on: boolean): void {
    runBtn.classList.toggle('is-running', on);
    runIcon.textContent = on ? '⏸' : '▶';
    runLabel.textContent = on ? 'Pause' : i > 0 && i < TOTAL ? 'Resume' : 'Run';
  }

  function finish(): void {
    stop();
    void logMilestone('Million Love Loop Completed');
    musicBox.playChimeSound();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    createExplosion(cx, cy, 120, 3);
    setTimeout(() => createExplosion(cx, cy, 160, 6), 300);
    showToast(`🎉 เค้ารักเบ๊บครบ ${fmt(TOTAL)} ครั้งแล้วค้าบ ❤️ (และจะรักต่อไปอีกเรื่อยๆ)`);
  }

  function tick(): void {
    const next = Math.min(TOTAL, i + STEP_PER_FRAME);
    // Every number is counted — only the last few of each frame are drawn in the log
    for (let n = Math.max(i + 1, next - 2); n <= next; n++) appendLog(n);
    i = next;
    render();
    saveProgress(i);

    if (i >= TOTAL) {
      finish();
      return;
    }
    frameId = requestAnimationFrame(tick);
  }

  function start(): void {
    if (i >= TOTAL) {
      i = 0;
      logEl.replaceChildren();
    }
    setRunningUi(true);
    frameId = requestAnimationFrame(tick);
  }

  function stop(): void {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    setRunningUi(false);
  }

  runBtn.addEventListener('click', () => {
    const running = frameId !== null;
    musicBox.playBell(running ? 660 : 990, 0.4);
    if (running) stop();
    else start();
  });

  resetBtn.addEventListener('click', () => {
    stop();
    i = 0;
    saveProgress(0);
    logEl.replaceChildren();
    render();
    setRunningUi(false);
  });

  render();
  setRunningUi(false);
}
