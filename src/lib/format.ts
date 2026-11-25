const euroFmt = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});

export function euro(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return euroFmt.format(value);
}

export function num(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function pct(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function monthsLabel(months: number): string {
  if (!Number.isFinite(months)) return '—';
  const total = Math.max(0, Math.ceil(months));
  const years = Math.floor(total / 12);
  const rest = total % 12;
  if (years === 0) return total === 1 ? '1 mes' : `${total} meses`;
  const yearLabel = years === 1 ? '1 año' : `${years} años`;
  if (rest === 0) return yearLabel;
  const monthLabel = rest === 1 ? '1 mes' : `${rest} meses`;
  return `${yearLabel} y ${monthLabel}`;
}

export function monthYear(date: Date): string {
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}
