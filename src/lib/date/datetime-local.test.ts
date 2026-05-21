import { isoToDatetimeLocalValue } from "./datetime-local";

describe("isoToDatetimeLocalValue", () => {
  it("преобразует ISO в значение для input datetime-local", () => {
    const iso = "2024-06-15T10:05:00.000Z";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    const expected = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    expect(isoToDatetimeLocalValue(iso)).toBe(expected);
  });
});
