import { musicBox } from './musicBox';

type SceneHook = () => void;
const enterHooks = new Map<string, SceneHook[]>();
const leaveHooks = new Map<string, SceneHook[]>();
let currentScene = 'scene-card';

export function onSceneEnter(id: string, hook: SceneHook): void {
  enterHooks.set(id, [...(enterHooks.get(id) ?? []), hook]);
}

export function onSceneLeave(id: string, hook: SceneHook): void {
  leaveHooks.set(id, [...(leaveHooks.get(id) ?? []), hook]);
}

export function switchScene(targetId: string): void {
  if (targetId !== currentScene) {
    leaveHooks.get(currentScene)?.forEach((h) => h());
  }
  currentScene = targetId;

  document.querySelectorAll<HTMLElement>('.scene-container').forEach((s) => {
    s.classList.toggle('active', s.id === targetId);
  });
  document.querySelectorAll<HTMLElement>('.dock-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });

  enterHooks.get(targetId)?.forEach((h) => h());

  // Smoothly scroll stage to top when switching scenes
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Bottom dock mode switcher. */
export function initDock(): void {
  document.querySelectorAll<HTMLElement>('.dock-item').forEach((item) => {
    item.addEventListener('click', () => {
      musicBox.playBell(880, 0.4);
      if (item.dataset.target) switchScene(item.dataset.target);
    });
  });
}
