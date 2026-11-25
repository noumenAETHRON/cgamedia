export type LabTool = {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  formula: string;
  formulaNote: string;
};

export const labTools: LabTool[] = [
  {
    slug: 'tamano-posicion',
    name: 'Tamaño de posición',
    kicker: 'Riesgo fijo · R:R',
    summary:
      'Cuántas unidades caben si arriesgas un porcentaje fijo del equity hasta el stop, y qué R:R sale hasta el objetivo. Es aritmética de una operación de papel. No es una orden.',
    formula: 'Unidades = (equity × riesgo %) / |entrada − stop| ; R = |objetivo − entrada| / |entrada − stop|',
    formulaNote:
      'La tasa de acierto de equilibrio es 1 / (1 + R). La esperanza usa esa R y una tasa de acierto que escribes tú. No sale de un histórico.',
  },
  {
    slug: 'volatilidad-drawdown',
    name: 'Volatilidad y drawdown',
    kicker: 'Serie o modelo',
    summary:
      'Con una serie de rentabilidades: desviación, volatilidad anualizada, drawdown máximo y un Sharpe aproximado. Con pesos y volatilidades: volatilidad de cartera bajo una correlación media.',
    formula: 'σ_cartera = √(w′ Σ w) , con Σ_ij = ρ · σ_i · σ_j (ρ = 1 en la diagonal)',
    formulaNote:
      'Anualizar multiplicando la desviación por √k supone periodos independientes. El drawdown recorre la curva compuesta de la serie, de pico a valle.',
  },
  {
    slug: 'dca-vs-lump-sum',
    name: 'DCA frente a lump sum',
    kicker: 'Escenario, no predicción',
    summary:
      'El mismo capital, de una vez o a partes iguales. Puedes poner un golpe en el primer mes. En un camino que sube, entrar de una vez suele acabar con más. El DCA cambia el arrepentimiento, no la dirección del mercado.',
    formula: 'Cada mes el saldo invertido se multiplica por (1 + r_mes). El mes 1 puede ser −golpe en lugar de r_mes.',
    formulaNote:
      'r_mes = (1 + r_anual)^(1/12) − 1. El efectivo que aún no se ha invertido renta cero en este modelo.',
  },
  {
    slug: 'rendimiento-tokenizado',
    name: 'Rendimiento tokenizado',
    kicker: 'Hoja de cálculo · RWA',
    summary:
      'Parte un rendimiento bruto en comisiones, una tasa de pérdida y un coste de divisa. Lo que queda se reparte o se capitaliza. No valora un token, no conoce al emisor y no resta el riesgo que no hayas escrito.',
    formula: 'Neto = bruto − fees − pérdida − divisa. Final simple = capital × (1 + neto × años).',
    formulaNote:
      'Si capitalizas, el neto se trata como tipo nominal repartido en la frecuencia elegida. Los puntos de drag no se suman otra vez en euros al capital final.',
  },
];

export function getLabTool(slug: string): LabTool | undefined {
  return labTools.find((tool) => tool.slug === slug);
}
