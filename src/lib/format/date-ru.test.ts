import { formatDateRu } from "./date-ru";

describe("formatDateRu", () => {
  it("форматирует ISO-дату по-русски", () => {
    const formatted = formatDateRu("2024-02-01T12:00:00.000Z");
    expect(formatted).toMatch(/2024/);
    expect(formatted.toLowerCase()).toMatch(/феврал/);
  });
});
