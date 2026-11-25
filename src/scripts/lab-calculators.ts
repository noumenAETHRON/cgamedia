import {
  compareDcaLump,
  parseReturnList,
  portfolioVolatility,
  positionSize,
  seriesStats,
  tokenizedYield,
} from '../lib/finance.ts';
import { euro, num, pct } from '../lib/format.ts';

function field(form: HTMLFormElement, name: string): string {
  const element = form.elements.namedItem(name);
  if (element instanceof RadioNodeList) return element.value;
  if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
    return element.value;
  }
  return '';
}

function optionalNumber(form: HTMLFormElement, name: string): number | null {
  const raw = field(form, name).trim().replace('%', '').replace(/\s/g, '');
  if (!raw) return null;
  const normalized = raw.includes(',') && !raw.includes('.') ? raw.replace(',', '.') : raw;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : Number.NaN;
}

function requiredNumber(form: HTMLFormElement, name: string): number {
  const value = optionalNumber(form, name);
  return value == null ? Number.NaN : value;
}

const messages: Record<string, string> = {
  invalid: 'Revisa las cifras. Hay un campo vacío o imposible.',
  'stop-side': 'En un largo el stop va por debajo de la entrada. En un corto, por encima.',
  'target-side': 'El objetivo tiene que quedar al otro lado de la entrada, no junto al stop.',
  weights: 'Los pesos de los activos que has rellenado tienen que sumar 100.',
};

function paint(form: HTMLFormElement, error: string | null, pairs: [string, string][], notes: string[] = []) {
  const errorNode = form.querySelector<HTMLElement>('[data-error]');
  const output = form.querySelector<HTMLElement>('[data-results]');
  if (errorNode) errorNode.textContent = error ?? '';
  if (!output) return;
  output.replaceChildren();
  if (error) return;
  const list = document.createElement('dl');
  for (const [label, value] of pairs) {
    const row = document.createElement('div');
    row.className = 'result-row';
    const term = document.createElement('dt');
    term.textContent = label;
    const definition = document.createElement('dd');
    definition.textContent = value;
    row.append(term, definition);
    list.append(row);
  }
  output.append(list);
  for (const note of notes) {
    const paragraph = document.createElement('p');
    paragraph.className = 'fine';
    paragraph.textContent = note;
    output.append(paragraph);
  }
}

function syncMethod(form: HTMLFormElement) {
  const method = field(form, 'method') || 'history';
  form.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.panel !== method;
  });
}

function run(form: HTMLFormElement) {
  const kind = form.dataset.labCalc;
  if (kind === 'position') {
    const target = optionalNumber(form, 'target');
    const win = optionalNumber(form, 'win');
    const side = field(form, 'side') === 'short' ? 'short' : 'long';
    const result = positionSize({
      equity: requiredNumber(form, 'equity'),
      riskPct: requiredNumber(form, 'risk') / 100,
      entry: requiredNumber(form, 'entry'),
      stop: requiredNumber(form, 'stop'),
      target,
      side,
      winRate: win == null ? null : win / 100,
    });
    if (!result.ok) return paint(form, messages[result.error] ?? messages.invalid, []);
    const value = result.value;
    const rows: [string, string][] = [
      ['Riesgo en euros', euro(value.riskAmount)],
      ['Distancia al stop', `${num(value.distance, 4)} (${pct(value.distancePct)})`],
      ['Unidades', num(value.units, 4)],
      ['Nocional', euro(value.notional)],
      ['Nocional / equity', num(value.leverage, 2) + '×'],
    ];
    if (value.rewardRisk != null) {
      rows.push(['R:R', num(value.rewardRisk, 2)]);
      rows.push(['Acierto de equilibrio', pct(value.breakevenWinRate ?? Number.NaN)]);
    }
    if (value.expectancy != null) rows.push(['Esperanza por operación, con tu acierto', euro(value.expectancy)]);
    const notes = ['Paper mode. Esto no dice que la operación deba hacerse.'];
    if (value.warnings.includes('risk-high')) {
      notes.push('El riesgo pasa del 2% del equity. Muchas mesas sistemáticas se quedan por debajo. No es una regla de CGA: es una señal para que mires el número.');
    }
    if (value.warnings.includes('leverage')) {
      notes.push('El nocional supera el equity. Hay apalancamiento aunque el riesgo al stop sea pequeño.');
    }
    paint(form, null, rows, notes);
  }

  if (kind === 'vol') {
    syncMethod(form);
    if (field(form, 'method') === 'model') {
      const assets = [1, 2, 3, 4].flatMap((index) => {
        const weight = optionalNumber(form, `w${index}`);
        const vol = optionalNumber(form, `v${index}`);
        if (weight == null && vol == null) return [];
        return [{ weight: (weight ?? Number.NaN) / 100, vol: (vol ?? Number.NaN) / 100 }];
      });
      const result = portfolioVolatility(assets, requiredNumber(form, 'corr'));
      if (!result.ok) return paint(form, messages[result.error] ?? messages.invalid, []);
      paint(
        form,
        null,
        [['Volatilidad anual del modelo', pct(result.value)]],
        [
          'Una sola correlación para todos los pares. Sirve para ver el efecto, no para sustituir una matriz de verdad.',
          'No es una previsión de pérdida.',
        ],
      );
      return;
    }
    const parsed = parseReturnList(field(form, 'series'));
    if (!parsed.ok) return paint(form, 'Necesito al menos dos rentabilidades, separadas por espacios.', []);
    const stats = seriesStats(parsed.value, requiredNumber(form, 'freq'), requiredNumber(form, 'rf') / 100);
    if (!stats.ok) return paint(form, messages.invalid, []);
    paint(
      form,
      null,
      [
        ['Observaciones', String(stats.value.count)],
        ['Media del periodo', pct(stats.value.mean)],
        ['Desviación del periodo', pct(stats.value.stdev)],
        ['Volatilidad anualizada', pct(stats.value.annualizedVol)],
        ['Media × periodos (aritmética)', pct(stats.value.annualizedMean)],
        ['Sharpe aproximado', stats.value.sharpe == null ? '—' : num(stats.value.sharpe, 2)],
        ['Drawdown máximo', pct(stats.value.maxDrawdown)],
        ['Capital final de 1', num(stats.value.wealth, 4)],
      ],
      [
        'La anualización por √k supone periodos independientes. El resultado compuesto es «capital final», no la media.',
        'El Sharpe resta el tipo sin riesgo que has escrito. No es una calificación del activo.',
      ],
    );
  }

  if (kind === 'dca') {
    const result = compareDcaLump({
      total: requiredNumber(form, 'total'),
      months: requiredNumber(form, 'months'),
      annualReturn: requiredNumber(form, 'rate') / 100,
      initialDrop: requiredNumber(form, 'drop') / 100,
    });
    if (!result.ok) return paint(form, 'Revisa el plazo (meses enteros) y el golpe, entre 0 y 99.', []);
    const diff = result.value.lump - result.value.dca;
    paint(
      form,
      null,
      [
        ['Lump sum', euro(result.value.lump)],
        ['DCA', euro(result.value.dca)],
        ['Diferencia (lump − DCA)', euro(diff)],
      ],
      [
        'Si el primer mes tiene golpe, ese mes sustituye al tipo, no se suma a él. El efectivo aún no invertido renta 0.',
        'Escenario de hoja de cálculo. No es una predicción ni un motivo para entrar.',
      ],
    );
  }

  if (kind === 'token') {
    const compound = field(form, 'compound') === 'yes';
    const result = tokenizedYield({
      capital: requiredNumber(form, 'capital'),
      grossApr: requiredNumber(form, 'gross') / 100,
      platformFee: requiredNumber(form, 'platform') / 100,
      protocolFee: requiredNumber(form, 'protocol') / 100,
      custodyFee: requiredNumber(form, 'custody') / 100,
      lossRate: requiredNumber(form, 'loss') / 100,
      fxDrag: requiredNumber(form, 'fx') / 100,
      years: requiredNumber(form, 'years'),
      compoundsPerYear: requiredNumber(form, 'frequency'),
      compound,
    });
    if (!result.ok) return paint(form, messages.invalid, []);
    const notes = [
      'Modelo de hoja de cálculo. No conoce al emisor, la liquidez, el smart contract ni el derecho que representa el token.',
    ];
    if (result.value.netApr < 0) notes.push('El neto es negativo: las fricciones que has escrito se comen el bruto.');
    paint(
      form,
      null,
      [
        ['Fees', pct(result.value.feePoints)],
        ['Pérdida supuesta', pct(result.value.lossPoints)],
        ['Divisa', pct(result.value.fxPoints)],
        ['Rendimiento neto', pct(result.value.netApr)],
        [compound ? 'Capital final capitalizado' : 'Capital más ingresos repartidos', euro(result.value.ending)],
        ['Generado en el modelo', euro(result.value.netIncome)],
      ],
      notes,
    );
  }
}

function bind(form: HTMLFormElement) {
  const update = () => run(form);
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
}

document.querySelectorAll<HTMLFormElement>('form[data-lab-calc]').forEach(bind);
