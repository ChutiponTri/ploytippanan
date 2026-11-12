import { $ } from './dom';

let hideTimer: number | undefined;

export function showToast(msg: string): void {
  const toast = $('bear-toast');
  $('toast-message').innerText = msg;
  toast.classList.add('show');
  clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => toast.classList.remove('show'), 3200);
}
