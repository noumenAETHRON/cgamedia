import type { Audience } from '../i18n/types.ts';
import {
  missionArrived,
  missionFuel,
  missionGoal,
  missionMonths,
  planetBalance,
  planetStart,
  sortCorrect,
  sortItems,
  type MissionChoice,
  type SortKind,
} from '../lib/games.ts';

const audiences: Audience[] = ['ninos', 'estudiantes', 'padres', 'abuelos', 'todos'];

function mode(): Audience {
  const value = document.documentElement.dataset.audience;
  return audiences.includes(value as Audience) ? (value as Audience) : 'todos';
}

const missionCopy = {
  win: {
    ninos: 'El cohete llega. Guardaste combustible.',
    estudiantes: 'Has cubierto el objetivo. El margen que no se gastó es el que despega.',
    padres: 'La misión sale. Lo que no se fue en caprichos es combustible.',
    abuelos: 'Llegas. El ahorro era el combustible.',
    todos: 'Objetivo cubierto. El gasto necesario ya estaba pagado; el resto es lo que decidió el viaje.',
  },
  short: {
    ninos: 'Te quedaste corto. El cohete no llega. Puedes probar otra vez.',
    estudiantes: 'No llegas a 24. Guardar solo la mitad seis meses da 18: se queda corto a propósito.',
    padres: 'Faltó combustible. No es un castigo: es ver qué pasa cuando el capricho se queda una parte.',
    abuelos: 'No llegas. Prueba a guardar más.',
    todos: 'Por debajo de 24. Guardarlo todo suma 36; la mitad, 18. El juego está calibrado para que el gasto se note.',
  },
} as const;

const sortCopy = {
  yes: {
    ninos: 'Bien.',
    estudiantes: 'Correcto.',
    padres: 'Esa es la casilla.',
    abuelos: 'Bien.',
    todos: 'Correcto.',
  },
  no: {
    ninos: 'Casi. Mira por qué.',
    estudiantes: 'No es esa casilla.',
    padres: 'Otra casilla. La explicación está debajo.',
    abuelos: 'Era la otra.',
    todos: 'Era la otra casilla.',
  },
  done: {
    ninos: 'Se acabaron las tarjetas.',
    estudiantes: 'Ronda completa.',
    padres: 'Fin de la ronda. Algunas cosas de casa no son tan claras: aquí elegimos las que sí lo son.',
    abuelos: 'Terminaste.',
    todos: 'Ronda completa. A propósito no hay casos ambiguos: en casa sí los hay, y se hablan.',
  },
} as const;

function setText(node: HTMLElement | null, text: string) {
  if (node) node.textContent = text;
}

function bindMission(root: HTMLElement) {
  let month = 1;
  let fuel = 0;
  const fuelNode = root.querySelector<HTMLElement>('[data-fuel]');
  const monthNode = root.querySelector<HTMLElement>('[data-month]');
  const message = root.querySelector<HTMLElement>('[data-message]');
  const rocket = root.querySelector<HTMLElement>('[data-rocket]');
  const choices = root.querySelector<HTMLElement>('[data-choices]');
  const again = root.querySelector<HTMLButtonElement>('[data-again]');

  const paint = () => {
    setText(fuelNode, `${fuel} / ${missionGoal}`);
    setText(monthNode, month > missionMonths ? 'Fin' : `${month} de ${missionMonths}`);
    if (rocket) rocket.style.setProperty('--p', `${Math.min(100, (fuel / missionGoal) * 100)}%`);
  };

  const finish = () => {
    if (choices) choices.hidden = true;
    if (again) again.hidden = false;
    const key = missionArrived(fuel) ? 'win' : 'short';
    setText(message, missionCopy[key][mode()]);
    paint();
  };

  root.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      if (month > missionMonths) return;
      const choice = button.dataset.choice as MissionChoice;
      fuel += missionFuel(choice);
      month += 1;
      paint();
      if (month > missionMonths) finish();
    });
  });

  again?.addEventListener('click', () => {
    month = 1;
    fuel = 0;
    if (choices) choices.hidden = false;
    again.hidden = true;
    setText(message, '');
    paint();
  });

  document.addEventListener('cga-audience', () => {
    if (month > missionMonths) finish();
  });
  paint();
}

function bindSort(root: HTMLElement) {
  let index = 0;
  let score = 0;
  const label = root.querySelector<HTMLElement>('[data-label]');
  const progress = root.querySelector<HTMLElement>('[data-progress]');
  const why = root.querySelector<HTMLElement>('[data-why]');
  const scoreNode = root.querySelector<HTMLElement>('[data-score]');
  const actions = root.querySelector<HTMLElement>('[data-actions]');
  const again = root.querySelector<HTMLButtonElement>('[data-again]');

  const show = () => {
    const item = sortItems[index];
    if (!item) return;
    setText(label, item.label);
    setText(progress, `Tarjeta ${index + 1} de ${sortItems.length}`);
  };

  const finish = () => {
    if (actions) actions.hidden = true;
    if (again) again.hidden = false;
    setText(label, sortCopy.done[mode()]);
    setText(progress, 'Fin');
    setText(scoreNode, `${score} / ${sortItems.length}`);
  };

  root.querySelectorAll<HTMLButtonElement>('[data-kind]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = sortItems[index];
      if (!item) return;
      const choice = button.dataset.kind as SortKind;
      const correct = sortCorrect(item.kind, choice);
      if (correct) score += 1;
      setText(why, `${correct ? sortCopy.yes[mode()] : sortCopy.no[mode()]} ${item.why[mode()]}`);
      setText(scoreNode, `${score} / ${sortItems.length}`);
      index += 1;
      if (index >= sortItems.length) finish();
      else show();
    });
  });

  again?.addEventListener('click', () => {
    index = 0;
    score = 0;
    if (actions) actions.hidden = false;
    again.hidden = true;
    setText(scoreNode, `0 / ${sortItems.length}`);
    setText(why, '');
    show();
  });

  show();
}

function bindPlanet(root: HTMLElement) {
  const years = root.querySelector<HTMLInputElement>('[data-years]');
  const rate = root.querySelector<HTMLSelectElement>('[data-rate]');
  const kept = root.querySelector<HTMLElement>('[data-kept]');
  const spent = root.querySelector<HTMLElement>('[data-spent]');
  const keptPlanet = root.querySelector<HTMLElement>('[data-kept-planet]');
  const yearLabel = root.querySelector<HTMLElement>('[data-year-label]');
  const table = root.querySelector<HTMLElement>('[data-table]');

  const paint = () => {
    const n = Number(years?.value || 10);
    const r = Number(rate?.value || 0.1);
    const balance = planetBalance(n, r);
    setText(yearLabel, String(n));
    setText(kept, balance.toLocaleString('es-ES', { maximumFractionDigits: 0 }));
    setText(spent, '0');
    if (keptPlanet) {
      const scale = Math.min(1.65, 0.45 + Math.log2(balance / planetStart + 1) * 0.28);
      keptPlanet.style.setProperty('--s', scale.toFixed(3));
    }
    if (table) {
      table.replaceChildren();
      const head = document.createElement('tr');
      for (const title of ['Año', 'Si lo dejas', 'Si te lo gastas']) {
        const cell = document.createElement('th');
        cell.textContent = title;
        head.append(cell);
      }
      table.append(head);
      for (let year = 0; year <= n; year += 1) {
        const row = document.createElement('tr');
        const values = [
          String(year),
          planetBalance(year, r).toLocaleString('es-ES', { maximumFractionDigits: 0 }),
          year === 0 ? String(planetStart) : '0',
        ];
        for (const value of values) {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        }
        table.append(row);
      }
    }
  };

  years?.addEventListener('input', paint);
  rate?.addEventListener('change', paint);
  paint();
}

document.querySelectorAll<HTMLElement>('[data-game="mission"]').forEach(bindMission);
document.querySelectorAll<HTMLElement>('[data-game="sort"]').forEach(bindSort);
document.querySelectorAll<HTMLElement>('[data-game="planet"]').forEach(bindPlanet);
