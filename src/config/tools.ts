import { vary, type AudienceCopy } from '../i18n/types.ts';

export type PublicTool = {
  slug: string;
  name: AudienceCopy;
  summary: AudienceCopy;
  formula: string;
  formulaNote: string;
};

export const tools: PublicTool[] = [
  {
    slug: 'interes-compuesto',
    name: vary({
      ninos: 'La bola de nieve',
      estudiantes: 'Interés compuesto',
      padres: 'Interés compuesto',
      abuelos: 'Cómo crece un ahorro',
      todos: 'Interés compuesto',
    }),
    summary: vary({
      ninos: 'Si guardas dinero y ese dinero también gana un poquito, con los años se hace más grande. El número que pones es un ejemplo, no una promesa.',
      estudiantes: 'El tipo se aplica sobre el capital y sobre los intereses ya generados. La aportación entra al final de cada periodo.',
      padres: 'Sirve para ver un ahorro mensual durante varios años. El tipo lo elegís vosotros: es un supuesto.',
      abuelos: 'Mira cuánto puede crecer un ahorro si cada año se suma un interés. Es un ejemplo.',
      todos: 'Proyección con aportaciones y capitalización. El tipo es un supuesto, no una previsión de mercado.',
    }),
    formula: 'VF = C₀ (1 + r/n)^(nt) + A · [((1 + r/n)^(nt) − 1) / (r/n)]',
    formulaNote:
      'C₀ es el capital inicial, r el tipo anual, n las capitalizaciones al año, t los años y A la aportación al final de cada periodo. Si r es 0, el valor futuro es la suma de lo aportado.',
  },
  {
    slug: 'meta-ahorro',
    name: vary({
      ninos: 'La hucha con fecha',
      estudiantes: 'Meta de ahorro',
      padres: 'Meta de ahorro',
      abuelos: 'Cuánto apartar',
      todos: 'Meta de ahorro',
    }),
    summary: vary({
      ninos: 'Dices cuánto quieres juntar y cuándo. La cuenta dice cuánto apartar cada vez.',
      estudiantes: 'Despeja la cuota de una anualidad para llegar a un capital objetivo.',
      padres: 'Útil para un viaje, un colchón o una entrada. El tipo sigue siendo un supuesto.',
      abuelos: 'Escribes la meta y los años. Abajo sale la cuota.',
      todos: 'Cuota periódica para llegar a un objetivo, con un capital inicial y un tipo supuesto.',
    }),
    formula: 'A = (M − C₀ (1 + r/n)^(nt)) · (r/n) / ((1 + r/n)^(nt) − 1)',
    formulaNote: 'M es la meta. Si el capital inicial ya crece por encima de la meta, la cuota sale cero.',
  },
  {
    slug: 'fondo-emergencia',
    name: vary({
      ninos: 'El colchón',
      estudiantes: 'Fondo de emergencia',
      padres: 'Fondo de emergencia',
      abuelos: 'Dinero para un susto',
      todos: 'Fondo de emergencia',
    }),
    summary: vary({
      ninos: 'Es dinero quieto para un susto: que se estropee algo o que falte un sueldo. No es para caprichos.',
      estudiantes: 'Gastos imprescindibles multiplicados por los meses que quieras cubrir. Separado del dinero que inviertes.',
      padres: 'Tres meses es poco si solo entra un sueldo. Seis es un punto de partida habitual. Doce, si los ingresos van a rachas.',
      abuelos: 'Gastos de un mes, por los meses que quieras tener guardados.',
      todos: 'Objetivo = gastos imprescindibles × meses. No incluye caprichos ni la cuota de inversión.',
    }),
    formula: 'Objetivo = gastos imprescindibles mensuales × meses',
    formulaNote: 'Si ya hay algo ahorrado, se resta. Los meses para llenarlo son el hueco dividido por lo que puedes apartar.',
  },
  {
    slug: 'presupuesto-50-30-20',
    name: vary({
      ninos: 'Tres botes',
      estudiantes: 'Presupuesto 50/30/20',
      padres: 'Presupuesto 50/30/20',
      abuelos: 'Repartir el sueldo',
      todos: 'Presupuesto 50/30/20',
    }),
    summary: vary({
      ninos: 'Un bote para lo que hace falta, otro para lo que apetece y otro para guardar. Los números son una idea, no una ley.',
      estudiantes: 'Regla mnemotécnica: 50% necesidades, 30% deseos, 20% ahorro. Un alquiler alto puede romper el 50 sin que hayas fallado tú.',
      padres: 'Sirve para ver el sueldo en tres montones. Si la vivienda se come el 50, el fallo no es vuestro: es el punto de partida.',
      abuelos: 'La mitad para lo necesario, un trozo para gustos y otro para guardar.',
      todos: 'Regla de tres montones. Es una guía de conversación, no un techo moral. Compara con lo que ya gastas.',
    }),
    formula: 'Necesidades = 0,50 · ingreso; deseos = 0,30 · ingreso; ahorro = 0,20 · ingreso',
    formulaNote: 'Popularizada en la educación financiera doméstica. No sale de una ley ni de un producto.',
  },
  {
    slug: 'inflacion',
    name: vary({
      ninos: 'Cuando las cosas cuestan más',
      estudiantes: 'Impacto de la inflación',
      padres: 'Inflación',
      abuelos: 'Lo que suben los precios',
      todos: 'Impacto de la inflación',
    }),
    summary: vary({
      ninos: 'A veces el mismo billete compra menos porque las cosas cuestan más. Esta cuenta lo enseña con un ejemplo.',
      estudiantes: 'Coste futuro = coste hoy × (1 + i)^t. También mira qué compra después un billete que no se mueve.',
      padres: 'Para no comparar un sueldo de hoy con precios de dentro de diez años como si fueran la misma cosa.',
      abuelos: 'Mira cuánto puede costar algo si los precios suben un poco cada año.',
      todos: 'Dos lecturas del mismo tipo: lo que costará un gasto y lo que podrá comprar un dinero quieto.',
    }),
    formula: 'Coste futuro = coste × (1 + i)^t ; poder de compra = importe / (1 + i)^t',
    formulaNote: 'i es la inflación anual supuesta, constante. La inflación real no es una recta.',
  },
  {
    slug: 'deudas',
    name: vary({
      ninos: 'Devolver dinero',
      estudiantes: 'Amortización de una deuda',
      padres: 'Deudas',
      abuelos: 'Quitar una deuda',
      todos: 'Plan de deuda',
    }),
    summary: vary({
      ninos: 'Si debes dinero, cada mes pagas un poco. Esta cuenta dice cuántos meses faltan si pagas una cantidad.',
      estudiantes: 'Simulación mes a mes, con intereses redondeados al céntimo. Si la cuota no cubre el interés, la deuda no baja.',
      padres: 'Comparad la cuota de ahora con una cuota un poco mayor. El extra se va al capital.',
      abuelos: 'Escribes lo que debes y lo que pagas al mes. Abajo salen los meses.',
      todos: 'Calendario de amortización simplificado. No incluye comisiones, carencia ni un cambio de tipo a mitad de camino.',
    }),
    formula: 'Interés del mes ≈ saldo × tipo mensual, redondeado al céntimo. Cuota francesa: C = P · i(1+i)^n / ((1+i)^n − 1)',
    formulaNote: 'El tipo mensual es el anual dividido entre 12. Es el convenio habitual de estas cuentas, no el de todos los contratos.',
  },
  {
    slug: 'independencia-financiera',
    name: vary({
      ninos: 'Cuando el ahorro trabaja',
      estudiantes: 'Número de independencia',
      padres: 'Independencia financiera',
      abuelos: 'Un número grande, explicado',
      todos: 'Número FIRE',
    }),
    summary: vary({
      ninos: 'Hay gente que guarda tanto que luego puede vivir de una parte pequeña de ese montón. El número es muy grande. Es solo una cuenta.',
      estudiantes: 'Gasto anual / tasa de retirada. El 4% es una regla de pulgar histórica, no una garantía, y menos fuera de su estudio original.',
      padres: 'Orden de magnitud: cuánto capital haría falta para cubrir el gasto de la casa con una retirada pequeña. No es un plan de jubilación.',
      abuelos: 'Divide lo que gastas al año entre un porcentaje pequeño. Sale un número grande. Es un ejemplo.',
      todos: 'Capital = gasto anual / tasa de retirada. Los años hasta llegar usan un tipo constante. No modelan una racha mala al principio ni los impuestos.',
    }),
    formula: 'Capital = gasto anual / tasa de retirada',
    formulaNote:
      'La regla del 4% viene de estudios sobre carteras y horizontes concretos (a menudo citados como Bengen y el estudio Trinity). No es una promesa de que una cartera sobreviva 30 años.',
  },
];

export function getTool(slug: string): PublicTool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
