import {
  applyPresetToFilters,
  defaultReportFilters,
  formatDateForInput,
  matchesDealStatus,
  matchesManagerId,
  resolveReportDateRange,
} from "./report-filters";

describe("report-filters", () => {
  const fixedNow = new Date(2024, 5, 15, 12, 0, 0);

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("defaultReportFilters заполняет диапазон дат по пресету", () => {
    const filters = defaultReportFilters("week");
    expect(filters.dateFrom).toBeTruthy();
    expect(filters.dateTo).toBe(formatDateForInput(fixedNow));
  });

  it("resolveReportDateRange использует произвольные даты", () => {
    const range = resolveReportDateRange({
      preset: "week",
      dateFrom: "2024-01-01",
      dateTo: "2024-01-31",
    });
    expect(range.start).toEqual(new Date("2024-01-01T00:00:00"));
    expect(range.end).toEqual(new Date("2024-01-31T23:59:59.999"));
  });

  it("applyPresetToFilters обновляет даты при смене пресета", () => {
    const next = applyPresetToFilters(defaultReportFilters("week"), "all");
    expect(next.preset).toBe("all");
    expect(next.dateFrom).toBe(formatDateForInput(new Date(0)));
  });

  it("matchesManagerId и matchesDealStatus пропускают пустой фильтр", () => {
    expect(matchesManagerId("u1")).toBe(true);
    expect(matchesManagerId("u1", "u1")).toBe(true);
    expect(matchesManagerId("u1", "u2")).toBe(false);
    expect(matchesDealStatus("new")).toBe(true);
    expect(matchesDealStatus("new", "completed")).toBe(false);
  });
});
