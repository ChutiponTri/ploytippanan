import { $ } from './dom';

interface Note {
  note: number;
  dur: number;
}

/** Procedural romantic music box (Web Audio API) — 100% offline. */
export class RomanticMusicBox {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private noteIndex = 0;
  private timer: number | undefined;

  // Romantic Arpeggio Notes (Pachelbel Canon in D / Romantic Lullaby)
  private readonly melody: Note[] = [
    { note: 74, dur: 0.6 }, { note: 78, dur: 0.6 }, { note: 81, dur: 0.6 }, { note: 86, dur: 1.2 },
    { note: 73, dur: 0.6 }, { note: 76, dur: 0.6 }, { note: 79, dur: 0.6 }, { note: 85, dur: 1.2 },
    { note: 71, dur: 0.6 }, { note: 74, dur: 0.6 }, { note: 78, dur: 0.6 }, { note: 83, dur: 1.2 },
    { note: 69, dur: 0.6 }, { note: 73, dur: 0.6 }, { note: 76, dur: 0.6 }, { note: 81, dur: 1.2 },
    { note: 67, dur: 0.6 }, { note: 71, dur: 0.6 }, { note: 74, dur: 0.6 }, { note: 79, dur: 1.2 },
    { note: 65, dur: 0.6 }, { note: 69, dur: 0.6 }, { note: 72, dur: 0.6 }, { note: 77, dur: 1.2 },
    { note: 67, dur: 0.6 }, { note: 71, dur: 0.6 }, { note: 74, dur: 0.6 }, { note: 79, dur: 1.2 },
    { note: 69, dur: 0.6 }, { note: 73, dur: 0.6 }, { note: 76, dur: 0.6 }, { note: 81, dur: 1.2 },
  ];

  init(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  private midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  playBell(freq: number, duration = 1.2): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const oscOver = this.ctx.createOscillator();
    const gainOver = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    oscOver.type = 'triangle';
    oscOver.frequency.setValueAtTime(freq * 2.01, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gainOver.gain.setValueAtTime(0, now);
    gainOver.gain.linearRampToValueAtTime(0.06, now + 0.015);
    gainOver.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

    osc.connect(gain);
    oscOver.connect(gainOver);
    gain.connect(this.ctx.destination);
    gainOver.connect(this.ctx.destination);

    osc.start(now);
    oscOver.start(now);
    osc.stop(now + duration + 0.1);
    oscOver.stop(now + duration + 0.1);
  }

  playChimeSound(): void {
    this.init();
    [81, 85, 88, 93].forEach((midi, idx) => {
      setTimeout(() => this.playBell(this.midiToFreq(midi), 1.5), idx * 100);
    });
  }

  start(): void {
    this.init();
    this.isPlaying = true;
    this.scheduleNext();
  }

  private scheduleNext(): void {
    if (!this.isPlaying) return;
    const item = this.melody[this.noteIndex];
    this.playBell(this.midiToFreq(item.note), item.dur * 1.5);
    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    this.timer = window.setTimeout(() => this.scheduleNext(), item.dur * 480);
  }

  stop(): void {
    this.isPlaying = false;
    clearTimeout(this.timer);
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    }
    this.start();
    return true;
  }
}

export const musicBox = new RomanticMusicBox();

export function initMusicControls(): void {
  const audioBtn = $<HTMLButtonElement>('audio-toggle-btn');
  const audioLabel = $('audio-label');

  audioBtn.addEventListener('click', () => {
    const active = musicBox.toggle();
    audioBtn.classList.toggle('playing', active);
    audioLabel.innerText = active ? 'Music: On' : 'Music: Off';
  });

  document.addEventListener('pointerdown', () => musicBox.init(), { once: true });
}
