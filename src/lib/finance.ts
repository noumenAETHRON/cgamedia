export type Ok<T> = { ok: true; value: T };
export type Err = { ok: false; error: string };
export type Result<T> = Ok<T> | Err;

function fail(error: string): Err {
  return { ok: false, error };
}

function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export type CompoundInput = {
  principal: number;
  annualRate: number;
  years: number;
  compoundsPerYear: number;
  contribution: number;
};

export type CompoundValue = {
  futureValue: number;
  contributed: number;
  interest: number;
  periods: number;
};

export function compoundFutureValue(input: CompoundInput): Result<CompoundValue> {
  const { principal, annualRate, years, compoundsPerYear, contribution } = input;
  if (
    ![principal, annualRate, years, compoundsPerYear, contribution].every(Number.isFinite) ||
    principal < 0 ||
    contribution < 0 ||
    years < 0 ||
    compoundsPerYear < 1 ||
    annualRate <= -1
  ) {
    return fail('invalid');
  }

  const periods = years * compoundsPerYear;
  const contributed = principal + contribution * periods;
  if (Math.abs(annualRate) < 1e-12) {
    return ok({ futureValue: contributed, contributed, interest: contributed - principal - contribution * periods, periods });
  }

  const rate = annualRate / compoundsPerYear;
  const growth = Math.pow(1 + rate, periods);
  const futureValue = principal * growth + contribution * ((growth - 1) / rate);
  return ok({
    futureValue,
    contributed,
    interest: futureValue - contributed,
    periods,
  });
}

export type SavingsInput = {
  target: number;
  principal: number;
  annualRate: number;
  years: number;
  periodsPerYear: number;
};

export function savingsPayment(input: SavingsInput): Result<number> {
  const { target, principal, annualRate, years, periodsPerYear } = input;
  if (
    ![target, principal, annualRate, years, periodsPerYear].every(Number.isFinite) ||
    target < 0 ||
    principal < 0 ||
    years <= 0 ||
    periodsPerYear < 1 ||
    annualRate <= -1
  ) {
    return fail('invalid');
  }

  const periods = years * periodsPerYear;
  const rate = annualRate / periodsPerYear;
  const grown = principal * Math.pow(1 + rate, periods);
  if (grown >= target) return ok(0);
  const need = target - grown;
  if (Math.abs(rate) < 1e-12) return ok(need / periods);
  return ok(need * (rate / (Math.pow(1 + rate, periods) - 1)));
}

export type EmergencyInput = {
  monthlyEssentials: number;
  months: number;
  alreadySaved: number;
  monthlySavings: number;
};

export type EmergencyValue = {
  target: number;
  gap: number;
  monthsToFill: number | null;
};

export function emergencyPlan(input: EmergencyInput): Result<EmergencyValue> {
  const { monthlyEssentials, months, alreadySaved, monthlySavings } = input;
  if (
    ![monthlyEssentials, months, alreadySaved, monthlySavings].every(Number.isFinite) ||
    monthlyEssentials < 0 ||
    months <= 0 ||
    months > 36 ||
    alreadySaved < 0 ||
    monthlySavings < 0
  ) {
    return fail('invalid');
  }
  const target = monthlyEssentials * months;
  const gap = Math.max(0, target - alreadySaved);
  const monthsToFill = gap === 0 ? 0 : monthlySavings > 0 ? Math.ceil(gap / monthlySavings) : null;
  return ok({ target, gap, monthsToFill });
}

export function budget503020(income: number): Result<{ needs: number; wants: number; savings: number }> {
  if (!Number.isFinite(income) || income < 0) return fail('invalid');
  return ok({ needs: income * 0.5, wants: income * 0.3, savings: income * 0.2 });
}

export function futureCost(present: number, annualInflation: number, years: number): Result<number> {
  if (![present, annualInflation, years].every(Number.isFinite) || present < 0 || years < 0 || annualInflation <= -1) {
    return fail('invalid');
  }
  return ok(present * Math.pow(1 + annualInflation, years));
}

export function purchasingPower(amount: number, annualInflation: number, years: number): Result<number> {
  const future = futureCost(amount, annualInflation, years);
  if (!future.ok) return future;
  if (future.value === 0) return ok(0);
  return ok(amount / Math.pow(1 + annualInflation, years));
}

export type DebtInput = {
  balance: number;
  annualRate: number;
  monthlyPayment: number;
};

export type DebtValue = {
  months: number;
  totalInterest: number;
  feasible: boolean;
};

export function amortizingPayment(principal: number, annualRate: number, months: number): Result<number> {
  if (![principal, annualRate, months].every(Number.isFinite) || principal < 0 || annualRate < 0 || months <= 0) {
    return fail('invalid');
  }
  if (annualRate === 0) return ok(principal / months);
  const rate = annualRate / 12;
  const factor = Math.pow(1 + rate, months);
  return ok((principal * rate * factor) / (factor - 1));
}

export function debtPayoff(input: DebtInput): Result<DebtValue> {
  const { balance, annualRate, monthlyPayment } = input;
  if (![balance, annualRate, monthlyPayment].every(Number.isFinite) || balance < 0 || annualRate < 0 || monthlyPayment < 0) {
    return fail('invalid');
  }
  if (balance === 0) return ok({ months: 0, totalInterest: 0, feasible: true });

  const rate = annualRate / 12;
  const firstInterest = round2(balance * rate);
  const dueNow = round2(balance + firstInterest);
  if (monthlyPayment <= firstInterest && monthlyPayment < dueNow) {
    return ok({ months: Infinity, totalInterest: Infinity, feasible: false });
  }

  let remaining = round2(balance);
  let months = 0;
  let totalInterest = 0;
  while (remaining > 0 && months < 1200) {
    const interest = round2(remaining * rate);
    const due = round2(remaining + interest);
    const paid = Math.min(monthlyPayment, due);
    totalInterest = round2(totalInterest + interest);
    remaining = round2(due - paid);
    months += 1;
  }

  return ok({
    months,
    totalInterest,
    feasible: remaining <= 0,
  });
}

export type FireInput = {
  annualExpenses: number;
  withdrawalRate: number;
  current: number;
  annualSavings: number;
  annualReturn: number;
};

export type FireValue = {
  number: number;
  gap: number;
  years: number | null;
};

export function firePlan(input: FireInput): Result<FireValue> {
  const { annualExpenses, withdrawalRate, current, annualSavings, annualReturn } = input;
  if (
    ![annualExpenses, withdrawalRate, current, annualSavings, annualReturn].every(Number.isFinite) ||
    annualExpenses < 0 ||
    withdrawalRate <= 0 ||
    withdrawalRate >= 1 ||
    current < 0 ||
    annualSavings < 0 ||
    annualReturn <= -1
  ) {
    return fail('invalid');
  }

  const number = annualExpenses / withdrawalRate;
  const gap = Math.max(0, number - current);
  if (current >= number) return ok({ number, gap: 0, years: 0 });

  let portfolio = current;
  for (let year = 1; year <= 80; year += 1) {
    portfolio = portfolio * (1 + annualReturn) + annualSavings;
    if (portfolio >= number) return ok({ number, gap, years: year });
  }
  return ok({ number, gap, years: null });
}

export type PositionInput = {
  equity: number;
  riskPct: number;
  entry: number;
  stop: number;
  target: number | null;
  side: 'long' | 'short';
  winRate: number | null;
};

export type PositionValue = {
  riskAmount: number;
  distance: number;
  distancePct: number;
  units: number;
  notional: number;
  leverage: number;
  rewardRisk: number | null;
  breakevenWinRate: number | null;
  expectancy: number | null;
  warnings: string[];
};

export function positionSize(input: PositionInput): Result<PositionValue> {
  const { equity, riskPct, entry, stop, target, side, winRate } = input;
  if (
    ![equity, riskPct, entry, stop].every(Number.isFinite) ||
    equity <= 0 ||
    entry <= 0 ||
    stop <= 0 ||
    riskPct <= 0 ||
    riskPct > 1 ||
    (side !== 'long' && side !== 'short')
  ) {
    return fail('invalid');
  }
  if (side === 'long' && stop >= entry) return fail('stop-side');
  if (side === 'short' && stop <= entry) return fail('stop-side');

  const distance = Math.abs(entry - stop);
  const riskAmount = equity * riskPct;
  const units = riskAmount / distance;
  const notional = units * entry;
  const warnings: string[] = [];
  if (riskPct > 0.02) warnings.push('risk-high');
  if (notional > equity + 0.01) warnings.push('leverage');

  let rewardRisk: number | null = null;
  let breakevenWinRate: number | null = null;
  let expectancy: number | null = null;
  if (target != null) {
    if (!Number.isFinite(target) || target <= 0) return fail('invalid');
    if (side === 'long' && target <= entry) return fail('target-side');
    if (side === 'short' && target >= entry) return fail('target-side');
    const reward = Math.abs(target - entry);
    rewardRisk = reward / distance;
    breakevenWinRate = 1 / (1 + rewardRisk);
    if (winRate != null) {
      if (!Number.isFinite(winRate) || winRate < 0 || winRate > 1) return fail('invalid');
      expectancy = winRate * reward * units - (1 - winRate) * riskAmount;
    }
  }

  return ok({
    riskAmount,
    distance,
    distancePct: distance / entry,
    units,
    notional,
    leverage: notional / equity,
    rewardRisk,
    breakevenWinRate,
    expectancy,
    warnings,
  });
}

export function sampleStdev(values: number[]): number {
  const n = values.length;
  if (n < 2) return Number.NaN;
  const mean = values.reduce((sum, value) => sum + value, 0) / n;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (n - 1);
  return Math.sqrt(variance);
}

export function maxDrawdown(returns: number[]): number {
  let equity = 1;
  let peak = 1;
  let worst = 0;
  for (const change of returns) {
    equity *= 1 + change;
    if (equity > peak) peak = equity;
    const drawdown = peak === 0 ? 0 : (peak - equity) / peak;
    if (drawdown > worst) worst = drawdown;
  }
  return worst;
}

export type SeriesStats = {
  count: number;
  mean: number;
  stdev: number;
  annualizedVol: number;
  annualizedMean: number;
  sharpe: number | null;
  maxDrawdown: number;
  wealth: number;
};

export function seriesStats(returns: number[], periodsPerYear: number, riskFreeAnnual: number): Result<SeriesStats> {
  if (
    returns.length < 2 ||
    !returns.every(Number.isFinite) ||
    !Number.isFinite(periodsPerYear) ||
    periodsPerYear < 1 ||
    !Number.isFinite(riskFreeAnnual)
  ) {
    return fail('invalid');
  }
  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const stdev = sampleStdev(returns);
  const excess = mean - riskFreeAnnual / periodsPerYear;
  const sharpe = stdev === 0 ? null : (excess / stdev) * Math.sqrt(periodsPerYear);
  let wealth = 1;
  for (const change of returns) wealth *= 1 + change;
  return ok({
    count: returns.length,
    mean,
    stdev,
    annualizedVol: stdev * Math.sqrt(periodsPerYear),
    annualizedMean: mean * periodsPerYear,
    sharpe,
    maxDrawdown: maxDrawdown(returns),
    wealth,
  });
}

export function portfolioVolatility(
  assets: { weight: number; vol: number }[],
  correlation: number,
): Result<number> {
  if (assets.length < 2 || !Number.isFinite(correlation) || correlation < -1 || correlation > 1) {
    return fail('invalid');
  }
  const weightSum = assets.reduce((sum, asset) => sum + asset.weight, 0);
  if (Math.abs(weightSum - 1) > 0.005) return fail('weights');
  if (assets.some((asset) => !Number.isFinite(asset.weight) || !Number.isFinite(asset.vol) || asset.weight < 0 || asset.vol < 0)) {
    return fail('invalid');
  }

  let variance = 0;
  for (let i = 0; i < assets.length; i += 1) {
    for (let j = 0; j < assets.length; j += 1) {
      const corr = i === j ? 1 : correlation;
      const left = assets[i];
      const right = assets[j];
      if (!left || !right) return fail('invalid');
      variance += left.weight * right.weight * left.vol * right.vol * corr;
    }
  }
  return ok(Math.sqrt(Math.max(0, variance)));
}

export type DcaInput = {
  total: number;
  months: number;
  annualReturn: number;
  initialDrop: number;
};

export function compareDcaLump(input: DcaInput): Result<{ lump: number; dca: number }> {
  const { total, months, annualReturn, initialDrop } = input;
  if (
    ![total, months, annualReturn, initialDrop].every(Number.isFinite) ||
    total < 0 ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 600 ||
    annualReturn <= -1 ||
    initialDrop < 0 ||
    initialDrop >= 1
  ) {
    return fail('invalid');
  }

  const monthly = Math.pow(1 + annualReturn, 1 / 12) - 1;
  const tranche = total / months;

  const run = (mode: 'lump' | 'dca') => {
    let invested = 0;
    let cash = total;
    for (let month = 0; month < months; month += 1) {
      if (mode === 'lump' && month === 0) {
        invested += cash;
        cash = 0;
      }
      if (mode === 'dca') {
        const add = Math.min(cash, tranche);
        invested += add;
        cash -= add;
      }
      const change = initialDrop > 0 && month === 0 ? -initialDrop : monthly;
      invested *= 1 + change;
    }
    return invested + cash;
  };

  return ok({ lump: run('lump'), dca: run('dca') });
}

export type TokenYieldInput = {
  capital: number;
  grossApr: number;
  platformFee: number;
  protocolFee: number;
  custodyFee: number;
  lossRate: number;
  fxDrag: number;
  years: number;
  compoundsPerYear: number;
  compound: boolean;
};

export type TokenYieldValue = {
  netApr: number;
  feePoints: number;
  lossPoints: number;
  fxPoints: number;
  ending: number;
  netIncome: number;
};

export function tokenizedYield(input: TokenYieldInput): Result<TokenYieldValue> {
  const {
    capital,
    grossApr,
    platformFee,
    protocolFee,
    custodyFee,
    lossRate,
    fxDrag,
    years,
    compoundsPerYear,
    compound,
  } = input;
  const numbers = [capital, grossApr, platformFee, protocolFee, custodyFee, lossRate, fxDrag, years, compoundsPerYear];
  if (
    !numbers.every(Number.isFinite) ||
    capital < 0 ||
    years < 0 ||
    platformFee < 0 ||
    protocolFee < 0 ||
    custodyFee < 0 ||
    lossRate < 0 ||
    fxDrag < 0 ||
    compoundsPerYear < 1
  ) {
    return fail('invalid');
  }

  const feePoints = platformFee + protocolFee + custodyFee;
  const netApr = grossApr - feePoints - lossRate - fxDrag;
  if (!compound) {
    const netIncome = capital * netApr * years;
    return ok({
      netApr,
      feePoints,
      lossPoints: lossRate,
      fxPoints: fxDrag,
      ending: capital + netIncome,
      netIncome,
    });
  }

  const periodRate = netApr / compoundsPerYear;
  const periods = years * compoundsPerYear;
  const ending = capital * Math.pow(1 + periodRate, periods);
  return ok({
    netApr,
    feePoints,
    lossPoints: lossRate,
    fxPoints: fxDrag,
    ending,
    netIncome: ending - capital,
  });
}

export function parseReturnList(input: string): Result<number[]> {
  const tokens = input
    .split(/[\s;]+/)
    .map((token) => token.trim())
    .filter(Boolean);
  if (tokens.length === 0) return fail('invalid');
  const values: number[] = [];
  for (const token of tokens) {
    const cleaned = token.replace('%', '');
    const normalized = cleaned.includes(',') && !cleaned.includes('.') ? cleaned.replace(',', '.') : cleaned;
    const value = Number(normalized);
    if (!Number.isFinite(value)) return fail('invalid');
    values.push(value / 100);
  }
  return ok(values);
}
