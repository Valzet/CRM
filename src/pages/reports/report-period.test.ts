import { isoInPreset, rangeForPreset } from "./report-period";

describe("report-period", () => {
  const fixedNow = new Date(2024, 5, 15, 12, 0, 0);

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("preset all охватывает всю историю до конца сегодня", () => {
    const { start, end } = rangeForPreset("all");
    expect(start.getTime()).toBe(0);
    expect(end.getDate()).toBe(15);
    expect(end.getHours()).toBe(23);
  });

  it("isoInPreset отсекает даты вне недели", () => {
    const inWeek = "2024-06-12T10:00:00.000Z";
    const beforeWeek = "2024-06-01T10:00:00.000Z";
    expect(isoInPreset(inWeek, "week")).toBe(true);
    expect(isoInPreset(beforeWeek, "week")).toBe(false);
  });
});
