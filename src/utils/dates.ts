export function today(): string {
  return formatISO(new Date());
}

export function formatISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function weekStart(date: string, startDay: number = 1): string {
  const d = parseDate(date);
  const day = d.getDay();
  const diff = (day - startDay + 7) % 7;
  d.setDate(d.getDate() - diff);
  return formatISO(d);
}

export function weekEnd(date: string, startDay: number = 1): string {
  const start = parseDate(weekStart(date, startDay));
  start.setDate(start.getDate() + 6);
  return formatISO(start);
}

export function monthStart(date: string): string {
  const d = parseDate(date);
  return formatISO(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function monthEnd(date: string): string {
  const d = parseDate(date);
  return formatISO(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

export function yearStart(date: string): string {
  const d = parseDate(date);
  return `${d.getFullYear()}-01-01`;
}

export function yearEnd(date: string): string {
  const d = parseDate(date);
  return `${d.getFullYear()}-12-31`;
}

export function daysBetween(start: string, end: string): number {
  const s = parseDate(start).getTime();
  const e = parseDate(end).getTime();
  return Math.round((e - s) / (1000 * 60 * 60 * 24));
}

export function addDays(date: string, days: number): string {
  const d = parseDate(date);
  d.setDate(d.getDate() + days);
  return formatISO(d);
}

export function dateRange(start: string, end: string): string[] {
  const result: string[] = [];
  let current = start;
  while (current <= end) {
    result.push(current);
    current = addDays(current, 1);
  }
  return result;
}

export function formatDisplay(date: string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = parseDate(date);
  if (format === 'short') {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  if (format === 'long') {
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
  const now = new Date();
  const diff = daysBetween(date, formatISO(now));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
