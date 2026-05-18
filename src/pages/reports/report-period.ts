import {
  boundsMonthToToday,
  boundsQuarterToToday,
  boundsWeekToToday,
  endOfDay,
  isoTimestampInRange,
} from '../../lib/date/periods'

export type ReportPreset = 'all' | 'week' | 'month' | 'quarter'

export function rangeForPreset(preset: ReportPreset) {
  const now = new Date()
  switch (preset) {
    case 'week':
      return boundsWeekToToday(now)
    case 'month':
      return boundsMonthToToday(now)
    case 'quarter':
      return boundsQuarterToToday(now)
    default:
      return { start: new Date(0), end: endOfDay(now) }
  }
}

export function isoInPreset(iso: string, preset: ReportPreset): boolean {
  const { start, end } = rangeForPreset(preset)
  return isoTimestampInRange(iso, start, end)
}
