import {
  budget503020,
  compoundFutureValue,
  debtPayoff,
  emergencyPlan,
  firePlan,
  futureCost,
  purchasingPower,
  savingsPayment,
  amortizingPayment,
} from '../lib/finance.ts';
import { euro, monthsLabel, monthYear, pct } from '../lib/format.ts';

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

function plain(): boolean {
  const mode = document.documentElement.dataset.audience || 'todos';
  return mode === 'ninos' || mode === 'abuelos';
}

function paint(form: HTMLFormElement, error: string | null, pairs: [string, string][], note?: string) {
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
  if (note) {
    const paragraph = document.createElement('p');
    paragraph.className = 'fine';
    paragraph.textContent = note;
    output.append(paragraph);
  }
}

const invalid = 'Revisa los números. Hacen falta cifras válidas.';

function run(form: HTMLFormElement) {
  const kind = form.dataset.calc;
  const kid = plain();
  if (kind === 'compound') {
    const result = compoundFutureValue({
      principal: requiredNumber(form, 'principal'),
      annualRate: requiredNumber(form, 'rate') / 100,
      years: requiredNumber(form, 'years'),
      compoundsPerYear: requiredNumber(form, 'frequency'),
      contribution: requiredNumber(form, 'contribution'),
    });
    if (!result.ok) return paint(form, invalid, []);
    paint(
      form,
      null,
      [
        [kid ? 'Dinero al final' : 'Valor futuro', euro(result.value.futureValue)],
        [kid ? 'Lo que pusiste' : 'Capital aportado', euro(result.value.contributed)],
        [kid ? 'Lo que creció de más' : 'Intereses del supuesto', euro(result.value.interest)],
      ],
      'La aportación entra al final de cada periodo. El tipo no es una previsión.',
    );
  }

  if (kind === 'goal') {
    const payment = savingsPayment({
      target: requiredNumber(form, 'target'),
      principal: requiredNumber(form, 'principal'),
      annualRate: requiredNumber(form, 'rate') / 100,
      years: requiredNumber(form, 'years'),
      periodsPerYear: requiredNumber(form, 'frequency'),
    });
    if (!payment.ok) return paint(form, invalid, []);
    paint(
      form,
      null,
      [[kid ? 'Aparta cada vez' : 'Cuota por periodo', euro(payment.value)]],
      payment.value === 0
        ? 'Con el dinero inicial y ese tipo, la meta ya se cubre sin cuota.'
        : 'Cuota al final de cada periodo. Si el tipo real es menor, hará falta más.',
    );
  }

  if (kind === 'emergency') {
    const result = emergencyPlan({
      monthlyEssentials: requiredNumber(form, 'essentials'),
      months: requiredNumber(form, 'months'),
      alreadySaved: requiredNumber(form, 'saved'),
      monthlySavings: requiredNumber(form, 'monthly'),
    });
    if (!result.ok) return paint(form, invalid, []);
    const rows: [string, string][] = [
      [kid ? 'Colchón' : 'Objetivo', euro(result.value.target)],
      [kid ? 'Todavía falta' : 'Hueco', euro(result.value.gap)],
    ];
    if (result.value.monthsToFill == null) {
      rows.push(['Tiempo', 'Con 0 al mes, el hueco no se llena.']);
    } else {
      rows.push([kid ? 'Tardarás' : 'Plazo al ritmo actual', monthsLabel(result.value.monthsToFill)]);
    }
    paint(form, null, rows, 'Cuenta solo gastos que no puedes quitar: casa, comida, suministros, transporte necesario.');
  }

  if (kind === 'budget') {
    const income = requiredNumber(form, 'income');
    const split = budget503020(income);
    if (!split.ok) return paint(form, invalid, []);
    const rows: [string, string][] = [
      [kid ? 'Lo que hace falta (50%)' : 'Necesidades, 50%', euro(split.value.needs)],
      [kid ? 'Gustos (30%)' : 'Deseos, 30%', euro(split.value.wants)],
      [kid ? 'Guardar (20%)' : 'Ahorro, 20%', euro(split.value.savings)],
    ];
    const actual = ['needs', 'wants', 'savings'].map((name) => optionalNumber(form, name));
    if (actual.every((value) => value != null && Number.isFinite(value))) {
      const [needs, wants, savings] = actual as number[];
      const used = needs + wants + savings;
      rows.push(
        ['Ahora, necesidades', euro(needs)],
        ['Ahora, deseos', euro(wants)],
        ['Ahora, ahorro', euro(savings)],
        [used > income ? 'Te pasas del ingreso en' : 'Sin asignar', euro(Math.abs(income - used))],
      );
    }
    paint(form, null, rows, 'Es una regla para conversar, no un techo. Un alquiler caro puede pasar del 50%.');
  }

  if (kind === 'inflation') {
    const price = requiredNumber(form, 'price');
    const rate = requiredNumber(form, 'rate') / 100;
    const years = requiredNumber(form, 'years');
    const cash = optionalNumber(form, 'cash') ?? price;
    const cost = futureCost(price, rate, years);
    const power = purchasingPower(cash, rate, years);
    if (!cost.ok || !power.ok) return paint(form, invalid, []);
    paint(
      form,
      null,
      [
        [kid ? 'Eso costaría' : 'Coste dentro del plazo', euro(cost.value)],
        [kid ? 'Tu dinero quieto compraría como' : 'Poder de compra del dinero quieto', euro(power.value)],
      ],
      'La inflación se supone constante. La de verdad no lo es. Mírala en el INE.',
    );
  }

  if (kind === 'debt') {
    const balance = requiredNumber(form, 'balance');
    const rate = requiredNumber(form, 'rate') / 100;
    const payment = requiredNumber(form, 'payment');
    const extra = optionalNumber(form, 'extra') ?? 0;
    const base = debtPayoff({ balance, annualRate: rate, monthlyPayment: payment });
    const faster = debtPayoff({ balance, annualRate: rate, monthlyPayment: payment + extra });
    if (!base.ok || !faster.ok) return paint(form, invalid, []);
    if (!base.value.feasible) {
      return paint(form, 'Con esa cuota el interés se come el pago y la deuda no baja.', []);
    }
    const rows: [string, string][] = [
      [kid ? 'Meses' : 'Plazo con la cuota actual', monthsLabel(base.value.months)],
      ['Intereses del camino', euro(base.value.totalInterest)],
      ['Acabarías hacia', monthYear(addMonths(new Date(), base.value.months))],
    ];
    if (extra > 0) {
      if (!faster.value.feasible) {
        rows.push(['Con el extra', 'Sigue sin cubrir el interés.']);
      } else {
        rows.push(
          ['Plazo con el extra', monthsLabel(faster.value.months)],
          ['Intereses con el extra', euro(faster.value.totalInterest)],
          ['Intereses que te ahorras', euro(Math.max(0, base.value.totalInterest - faster.value.totalInterest))],
        );
      }
    }
    const horizon = optionalNumber(form, 'horizon');
    if (horizon && horizon > 0) {
      const french = amortizingPayment(balance, rate, horizon);
      if (french.ok) rows.push(['Cuota para ese plazo', euro(french.value)]);
    }
    paint(form, null, rows, 'Sin comisiones ni cambios de tipo. El interés del mes se redondea al céntimo.');
  }

  if (kind === 'fire') {
    const result = firePlan({
      annualExpenses: requiredNumber(form, 'expenses'),
      withdrawalRate: requiredNumber(form, 'withdrawal') / 100,
      current: requiredNumber(form, 'current'),
      annualSavings: requiredNumber(form, 'savings'),
      annualReturn: requiredNumber(form, 'rate') / 100,
    });
    if (!result.ok) return paint(form, invalid, []);
    const years =
      result.value.years == null
        ? 'Con estos números no se llega en 80 años.'
        : result.value.years === 0
          ? 'El capital actual ya cubre el número.'
          : monthsLabel(result.value.years * 12);
    paint(
      form,
      null,
      [
        [kid ? 'El montón' : 'Número', euro(result.value.number)],
        [kid ? 'Falta' : 'Hueco respecto a hoy', euro(result.value.gap)],
        [kid ? 'Tiempo de ejemplo' : 'Años con tipo constante', years],
      ],
      'El 4% es una regla de pulgar famosa, no una garantía. Este cálculo no mira impuestos ni una racha mala al principio.',
    );
  }
}

function addMonths(from: Date, months: number): Date {
  const copy = new Date(from.getTime());
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function bind(form: HTMLFormElement) {
  const update = () => run(form);
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  document.addEventListener('cga-audience', update);
  update();
}

document.querySelectorAll<HTMLFormElement>('form[data-calc]').forEach(bind);
