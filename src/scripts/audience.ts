import { audienceNames } from '../i18n/es.ts';

const modes = ['ninos', 'estudiantes', 'padres', 'abuelos', 'todos'] as const;
type Mode = (typeof modes)[number];
const storageKey = 'cga-audience';

function isMode(value: string | null): value is Mode {
  return modes.includes(value as Mode);
}

function apply(mode: Mode) {
  document.documentElement.dataset.audience = mode;
  document.querySelectorAll<HTMLButtonElement>('[data-audience-set]').forEach((button) => {
    const on = button.dataset.audienceSet === mode;
    button.setAttribute('aria-checked', on ? 'true' : 'false');
    button.tabIndex = on ? 0 : -1;
  });
  const live = document.getElementById('audience-live');
  if (live) live.textContent = `Modo de lectura: ${audienceNames[mode]}`;
  document.dispatchEvent(new CustomEvent('cga-audience', { detail: mode }));
}

const group = document.getElementById('audience-switch');
const current = document.documentElement.dataset.audience;
apply(isMode(current ?? null) ? current : 'todos');

group?.querySelectorAll<HTMLButtonElement>('[data-audience-set]').forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.audienceSet ?? 'todos';
    if (!isMode(mode)) return;
    try {
      localStorage.setItem(storageKey, mode);
    } catch {
      /* preferencia solo de esta visita */
    }
    apply(mode);
  });
});

group?.addEventListener('keydown', (event) => {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  const buttons = [...group.querySelectorAll<HTMLButtonElement>('[data-audience-set]')];
  const index = buttons.findIndex((button) => button.getAttribute('aria-checked') === 'true');
  const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
  const next = buttons[(index + direction + buttons.length) % buttons.length];
  event.preventDefault();
  next?.focus();
  next?.click();
});
