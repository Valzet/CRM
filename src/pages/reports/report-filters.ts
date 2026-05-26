import { endOfDay } from "../../lib/date/periods";
import type { Deal, DealStatus } from "../../types/deal";
import type { ReportFilters } from "../../types/reports";
import type { ReportPreset } from "./report-period";
import { rangeForPreset } from "./report-period";

export type ReportFilterValues = ReportFilters & {
  preset: ReportPreset;
};

export function formatDateForInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateInputStart(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

export function parseDateInputEnd(value: string): Date {
  return new Date(`${value}T23:59:59.999`);
}

export function defaultReportFilters(preset: ReportPreset = "week"): ReportFilterValues {
  const { start, end } = rangeForPreset(preset);
  return {
    preset,
    dateFrom: formatDateForInput(start),
    dateTo: formatDateForInput(end),
  };
}

export function resolveReportDateRange(filters: ReportFilterValues): { start: Date; end: Date } {
  if (filters.dateFrom || filters.dateTo) {
    return {
      start: filters.dateFrom ? parseDateInputStart(filters.dateFrom) : new Date(0),
      end: filters.dateTo ? parseDateInputEnd(filters.dateTo) : endOfDay(new Date()),
    };
  }
  return rangeForPreset(filters.preset);
}

export function applyPresetToFilters(
  filters: ReportFilterValues,
  preset: ReportPreset,
): ReportFilterValues {
  const { start, end } = rangeForPreset(preset);
  return {
    ...filters,
    preset,
    dateFrom: formatDateForInput(start),
    dateTo: formatDateForInput(end),
  };
}

export function matchesManagerId(entityCreatedBy: string, managerId?: string): boolean {
  return !managerId || entityCreatedBy === managerId;
}

export function matchesDealStatus(status: DealStatus, dealStatus?: DealStatus): boolean {
  return !dealStatus || status === dealStatus;
}

export function dealMatchesReportFilters(
  deal: Deal,
  filters: ReportFilters,
  options?: { defaultStatus?: DealStatus },
): boolean {
  if (!matchesManagerId(deal.createdBy, filters.managerId)) return false;
  const status = filters.dealStatus ?? options?.defaultStatus;
  if (status && deal.status !== status) return false;
  return true;
}
