export function startOfWeekMonday(date = new Date()): Date {
  const x = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dow = x.getDay();
  const delta = dow === 0 ? -6 : 1 - dow;
  x.setDate(x.getDate() + delta);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function startOfMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

export function startOfQuarter(date = new Date()): Date {
  const m = Math.floor(date.getMonth() / 3) * 3;
  return new Date(date.getFullYear(), m, 1, 0, 0, 0, 0);
}

export function boundsWeekToToday(now = new Date()) {
  return { start: startOfWeekMonday(now), end: endOfDay(now) };
}

export function boundsMonthToToday(now = new Date()) {
  return { start: startOfMonth(now), end: endOfDay(now) };
}

export function boundsQuarterToToday(now = new Date()) {
  return { start: startOfQuarter(now), end: endOfDay(now) };
}

export function boundsToday(now = new Date()) {
  const s = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  return { start: s, end: endOfDay(now) };
}

export function isoTimestampInRange(iso: string, start: Date, end: Date): boolean {
  const t = Date.parse(iso);
  return t >= start.getTime() && t <= end.getTime();
}
