import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  amortizingPayment,
  budget503020,
  compareDcaLump,
  compoundFutureValue,
  debtPayoff,
  emergencyPlan,
  firePlan,
  futureCost,
  maxDrawdown,
  parseReturnList,
  portfolioVolatility,
  positionSize,
  purchasingPower,
  sampleStdev,
  savingsPayment,
  seriesStats,
  tokenizedYield,
} from './finance.ts';

test('interés compuesto sin tipo ni aportación no se mueve', () => {
  const result = compoundFutureValue({
    principal: 1000,
    annualRate: 0,
    years: 10,
    compoundsPerYear: 1,
    contribution: 0,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.futureValue, 1000);
  assert.equal(result.value.interest, 0);
});

test('un año al 10% anual sin aportación', () => {
  const result = compoundFutureValue({
    principal: 1000,
    annualRate: 0.1,
    years: 1,
    compoundsPerYear: 1,
    contribution: 0,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.ok(Math.abs(result.value.futureValue - 1100) < 1e-9);
});

test('la cuota de la meta llega al objetivo', () => {
  const payment = savingsPayment({
    target: 10000,
    principal: 1000,
    annualRate: 0.03,
    years: 5,
    periodsPerYear: 12,
  });
  assert.equal(payment.ok, true);
  if (!payment.ok) return;
  const future = compoundFutureValue({
    principal: 1000,
    annualRate: 0.03,
    years: 5,
    compoundsPerYear: 12,
    contribution: payment.value,
  });
  assert.equal(future.ok, true);
  if (!future.ok) return;
  assert.ok(Math.abs(future.value.futureValue - 10000) < 1);
});

test('fondo de emergencia', () => {
  const result = emergencyPlan({
    monthlyEssentials: 1200,
    months: 6,
    alreadySaved: 1000,
    monthlySavings: 200,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.target, 7200);
  assert.equal(result.value.gap, 6200);
  assert.equal(result.value.monthsToFill, 31);
});

test('presupuesto 50/30/20', () => {
  const result = budget503020(2000);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.needs, 1000);
  assert.equal(result.value.wants, 600);
  assert.equal(result.value.savings, 400);
});

test('inflación y poder de compra', () => {
  const cost = futureCost(100, 0.1, 1);
  const power = purchasingPower(110, 0.1, 1);
  assert.equal(cost.ok && power.ok, true);
  if (!cost.ok || !power.ok) return;
  assert.ok(Math.abs(cost.value - 110) < 1e-9);
  assert.ok(Math.abs(power.value - 100) < 1e-9);
});

test('deuda a tipo cero', () => {
  const result = debtPayoff({ balance: 1000, annualRate: 0, monthlyPayment: 100 });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.feasible, true);
  assert.equal(result.value.months, 10);
  assert.equal(result.value.totalInterest, 0);
});

test('cuota que no cubre el interés', () => {
  const result = debtPayoff({ balance: 1000, annualRate: 0.12, monthlyPayment: 1 });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.feasible, false);
});

test('la cuota francesa liquida el plazo', () => {
  const payment = amortizingPayment(1000, 0.12, 12);
  assert.equal(payment.ok, true);
  if (!payment.ok) return;
  const payoff = debtPayoff({ balance: 1000, annualRate: 0.12, monthlyPayment: payment.value });
  assert.equal(payoff.ok, true);
  if (!payoff.ok) return;
  assert.equal(payoff.value.feasible, true);
  assert.equal(payoff.value.months, 12);
});

test('número FIRE y años', () => {
  const result = firePlan({
    annualExpenses: 40000,
    withdrawalRate: 0.04,
    current: 0,
    annualSavings: 0,
    annualReturn: 0.05,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.number, 1_000_000);
  assert.equal(result.value.years, null);

  const reached = firePlan({
    annualExpenses: 10000,
    withdrawalRate: 0.04,
    current: 250000,
    annualSavings: 0,
    annualReturn: 0,
  });
  assert.equal(reached.ok, true);
  if (!reached.ok) return;
  assert.equal(reached.value.years, 0);
});

test('tamaño de posición largo 1% y R:R 2', () => {
  const result = positionSize({
    equity: 10000,
    riskPct: 0.01,
    entry: 100,
    stop: 95,
    target: 110,
    side: 'long',
    winRate: 0.5,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.riskAmount, 100);
  assert.equal(result.value.units, 20);
  assert.equal(result.value.notional, 2000);
  assert.equal(result.value.rewardRisk, 2);
  assert.ok(Math.abs((result.value.breakevenWinRate ?? 0) - 1 / 3) < 1e-12);
  assert.equal(result.value.expectancy, 50);
  assert.deepEqual(result.value.warnings, []);
});

test('stop del lado incorrecto', () => {
  const result = positionSize({
    equity: 10000,
    riskPct: 0.01,
    entry: 100,
    stop: 105,
    target: 110,
    side: 'long',
    winRate: null,
  });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error, 'stop-side');
});

test('drawdown y volatilidad de cartera', () => {
  assert.equal(maxDrawdown([0.1, -0.5, 0.1]), 0.5);
  assert.equal(sampleStdev([0.1, 0.1]), 0);
  const vol = portfolioVolatility(
    [
      { weight: 0.5, vol: 0.1 },
      { weight: 0.5, vol: 0.2 },
    ],
    1,
  );
  assert.equal(vol.ok, true);
  if (!vol.ok) return;
  assert.ok(Math.abs(vol.value - 0.15) < 1e-12);
});

test('estadísticos de una serie', () => {
  const parsed = parseReturnList('10  -10; 10');
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  const stats = seriesStats(parsed.value, 1, 0);
  assert.equal(stats.ok, true);
  if (!stats.ok) return;
  assert.equal(stats.value.count, 3);
  assert.ok(stats.value.maxDrawdown > 0);
});

test('DCA y lump sum', () => {
  const flat = compareDcaLump({ total: 1200, months: 12, annualReturn: 0, initialDrop: 0 });
  assert.equal(flat.ok, true);
  if (!flat.ok) return;
  assert.ok(Math.abs(flat.value.lump - 1200) < 1e-6);
  assert.ok(Math.abs(flat.value.dca - flat.value.lump) < 1e-6);

  const up = compareDcaLump({ total: 1200, months: 12, annualReturn: 0.08, initialDrop: 0 });
  assert.equal(up.ok, true);
  if (!up.ok) return;
  assert.ok(up.value.lump > up.value.dca);

  const shock = compareDcaLump({ total: 1200, months: 12, annualReturn: 0, initialDrop: 0.5 });
  assert.equal(shock.ok, true);
  if (!shock.ok) return;
  assert.ok(shock.value.dca > shock.value.lump);
});

test('rendimiento tokenizado simple y capitalizado a un año', () => {
  const simple = tokenizedYield({
    capital: 1000,
    grossApr: 0.1,
    platformFee: 0.01,
    protocolFee: 0,
    custodyFee: 0,
    lossRate: 0,
    fxDrag: 0,
    years: 1,
    compoundsPerYear: 1,
    compound: false,
  });
  const compounded = tokenizedYield({
    capital: 1000,
    grossApr: 0.1,
    platformFee: 0.01,
    protocolFee: 0,
    custodyFee: 0,
    lossRate: 0,
    fxDrag: 0,
    years: 1,
    compoundsPerYear: 1,
    compound: true,
  });
  assert.equal(simple.ok && compounded.ok, true);
  if (!simple.ok || !compounded.ok) return;
  assert.ok(Math.abs(simple.value.netApr - 0.09) < 1e-12);
  assert.ok(Math.abs(simple.value.ending - 1090) < 1e-9);
  assert.ok(Math.abs(compounded.value.ending - 1090) < 1e-9);
});
