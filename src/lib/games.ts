import type { AudienceCopy } from '../i18n/types.ts';

export const missionMonths = 6;
export const missionGoal = 24;
export const missionIncome = 10;
export const missionNeed = 4;

export type MissionChoice = 'save' | 'half' | 'spend';

export function missionFuel(choice: MissionChoice): number {
  if (choice === 'save') return missionIncome - missionNeed;
  if (choice === 'half') return (missionIncome - missionNeed) / 2;
  return 0;
}

export function missionArrived(fuel: number): boolean {
  return fuel >= missionGoal;
}

export type SortKind = 'need' | 'want';

export type SortItem = {
  id: string;
  label: string;
  kind: SortKind;
  why: AudienceCopy;
};

export const sortItems: SortItem[] = [
  {
    id: 'alquiler',
    label: 'El alquiler de la casa',
    kind: 'need',
    why: {
      ninos: 'Sin casa no hay un sitio para dormir. Eso se necesita.',
      estudiantes: 'La vivienda es un gasto básico. En un presupuesto cae del lado de las necesidades.',
      padres: 'El techo de la familia no es un capricho. Se paga antes que los extras.',
      abuelos: 'La casa es necesaria. Se paga primero.',
      todos: 'La vivienda es una necesidad. Va antes que los gastos discrecionales.',
    },
  },
  {
    id: 'comida',
    label: 'La comida de la semana',
    kind: 'need',
    why: {
      ninos: 'Comer es necesario. Los dulces de más, no.',
      estudiantes: 'La alimentación básica es una necesidad. El formato de lujo ya sería un deseo.',
      padres: 'La cesta de la semana sostiene la casa.',
      abuelos: 'La comida es necesaria.',
      todos: 'Comer es una necesidad. Otra cosa es elegir siempre lo más caro.',
    },
  },
  {
    id: 'bus',
    label: 'El billete para ir al colegio',
    kind: 'need',
    why: {
      ninos: 'Sirve para llegar al cole. Es necesario.',
      estudiantes: 'El transporte para una obligación (estudiar) cuenta como necesidad.',
      padres: 'Llegar al colegio o al trabajo no es un extra.',
      abuelos: 'El transporte necesario se paga.',
      todos: 'El transporte ligado a una obligación es una necesidad.',
    },
  },
  {
    id: 'medicina',
    label: 'La medicina que manda el médico',
    kind: 'need',
    why: {
      ninos: 'Si el médico la manda, hace falta.',
      estudiantes: 'Un tratamiento prescrito no es ocio.',
      padres: 'La salud de casa se atiende antes que los gustos.',
      abuelos: 'La medicina mandada es necesaria.',
      todos: 'Un tratamiento prescrito es una necesidad.',
    },
  },
  {
    id: 'luz',
    label: 'La luz de casa',
    kind: 'need',
    why: {
      ninos: 'Sin luz no se vive bien en casa. Hace falta.',
      estudiantes: 'Los suministros del hogar son necesidades.',
      padres: 'Luz, agua y un techo van en el mismo cajón.',
      abuelos: 'La luz es necesaria.',
      todos: 'Los suministros del hogar son necesidades.',
    },
  },
  {
    id: 'juguete',
    label: 'Un juguete nuevo, teniendo ya varios',
    kind: 'want',
    why: {
      ninos: 'Puede apetecer mucho, y se puede esperar. Es un deseo.',
      estudiantes: 'Un gusto adicional, no un gasto básico.',
      padres: 'Se puede querer de verdad y seguir siendo un deseo.',
      abuelos: 'Es un gusto, no una necesidad.',
      todos: 'Querido no es lo mismo que necesario.',
    },
  },
  {
    id: 'videojuego',
    label: 'Otro videojuego',
    kind: 'want',
    why: {
      ninos: 'Diviene, y no hace falta para vivir. Es un deseo.',
      estudiantes: 'Ocio: deseo, aunque el precio sea pequeño.',
      padres: 'El ocio tiene sitio, después de lo básico.',
      abuelos: 'Es un entretenimiento. Es un deseo.',
      todos: 'El ocio es un deseo. Puede presupuestarse, no esconderse como si fuera un recibo.',
    },
  },
  {
    id: 'chuches',
    label: 'Chuches todos los días',
    kind: 'want',
    why: {
      ninos: 'Están ricas. No hacen falta cada día. Es un deseo.',
      estudiantes: 'Un consumo repetido de ocio sigue siendo deseo.',
      padres: 'Lo pequeño, cada día, también suma.',
      abuelos: 'Es un gusto de cada día, no una necesidad.',
      todos: 'La frecuencia no convierte un gusto en una necesidad.',
    },
  },
];

export function sortCorrect(kind: SortKind, choice: SortKind): boolean {
  return kind === choice;
}

export const planetStart = 100;

export function planetBalance(years: number, annualRate: number): number {
  return planetStart * Math.pow(1 + annualRate, years);
}
