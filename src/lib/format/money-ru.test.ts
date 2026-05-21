import { formatMoneyRu } from "./money-ru";

describe("formatMoneyRu", () => {
  it("форматирует сумму с разделителем тысяч и символом рубля", () => {
    expect(formatMoneyRu(150000)).toMatch(/150[\s\u00a0]?000\s*₽/);
  });

  it("форматирует ноль", () => {
    expect(formatMoneyRu(0)).toMatch(/0\s*₽/);
  });
});
