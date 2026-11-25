import { vary, type AudienceCopy } from '../i18n/types.ts';

export type GameMeta = {
  slug: string;
  title: AudienceCopy;
  summary: AudienceCopy;
};

export const games: GameMeta[] = [
  {
    slug: 'mision-ahorro',
    title: vary({
      ninos: 'Misión Ahorro',
      estudiantes: 'Misión Ahorro',
      padres: 'Misión Ahorro',
      abuelos: 'El cohete',
      todos: 'Misión Ahorro',
    }),
    summary: vary({
      ninos: 'El combustible del cohete es lo que no te gastas. La comida ya está pagada.',
      estudiantes: 'Seis meses, ingreso fijo y un gasto necesario. El margen se ahorra o se consume.',
      padres: 'Un juego corto para ver que el capricho sale del mismo sitio que el ahorro.',
      abuelos: 'Guardas o gastas. El cohete sube si guardas.',
      todos: 'El gasto necesario se descuenta solo. Lo que haces con el margen llena o no el depósito.',
    }),
  },
  {
    slug: 'necesidades-deseos',
    title: vary({
      ninos: '¿Lo necesito o lo deseo?',
      estudiantes: 'Necesidades y deseos',
      padres: 'Necesidades y deseos',
      abuelos: 'Necesito o quiero',
      todos: 'Necesidades y deseos',
    }),
    summary: vary({
      ninos: 'Ocho tarjetas. Tú dices si hace falta o si apetece.',
      estudiantes: 'Clasifica gastos claros. Los casos dudosos, a propósito, no están.',
      padres: 'Para jugar en la mesa y luego hablar de los gastos que sí son dudosos.',
      abuelos: 'Un botón para lo necesario y otro para el gusto.',
      todos: 'Ocho casos nítidos. La vida real tiene más grises: el juego no los esconde, los deja fuera.',
    }),
  },
  {
    slug: 'planeta-compuesto',
    title: vary({
      ninos: 'El planeta que crece',
      estudiantes: 'Planeta compuesto',
      padres: 'Planeta compuesto',
      abuelos: 'El planeta',
      todos: 'Planeta compuesto',
    }),
    summary: vary({
      ninos: 'Si dejas las monedas, el planeta engorda. Si te las gastas, no queda planeta.',
      estudiantes: 'Cien monedas y un tipo de ejemplo. Compara no tocarlo con gastarlo hoy.',
      padres: 'Una imagen para la frase «el tiempo hace parte del trabajo».',
      abuelos: 'Mueves los años y ves el número.',
      todos: 'Interés compuesto visual, con un tipo que eliges como ejemplo. No es una rentabilidad ofrecida.',
    }),
  },
];

export function getGame(slug: string): GameMeta | undefined {
  return games.find((game) => game.slug === slug);
}
