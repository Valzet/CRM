import {
  boundsMonthToToday,
  boundsWeekToToday,
  endOfDay,
  isoTimestampInRange,
  startOfWeekMonday,
} from "./periods";

describe("date periods", () => {
  const now = new Date(2024, 5, 15, 14, 30, 0);

  it("startOfWeekMonday возвращает понедельник той же недели", () => {
    const monday = startOfWeekMonday(now);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(10);
    expect(monday.getMonth()).toBe(5);
  });

  it("boundsWeekToToday ограничивает конец текущим днём", () => {
    const { start, end } = boundsWeekToToday(now);
    expect(start.getTime()).toBe(startOfWeekMonday(now).getTime());
    expect(end.getHours()).toBe(23);
    expect(end.getDate()).toBe(15);
  });

  it("boundsMonthToToday начинается с первого числа месяца", () => {
    const { start } = boundsMonthToToday(now);
    expect(start.getDate()).toBe(1);
    expect(start.getMonth()).toBe(5);
  });

  it("isoTimestampInRange проверяет границы включительно", () => {
    const start = new Date(2024, 0, 1, 0, 0, 0, 0);
    const end = endOfDay(new Date(2024, 0, 31));
    const inside = new Date(2024, 0, 15, 12, 0, 0).toISOString();
    const outside = new Date(2023, 11, 15, 12, 0, 0).toISOString();
    expect(isoTimestampInRange(inside, start, end)).toBe(true);
    expect(isoTimestampInRange(outside, start, end)).toBe(false);
  });
});
