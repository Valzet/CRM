import { collapseWhitespaceTrim } from "./normalize";

describe("collapseWhitespaceTrim", () => {
  it("схлопывает пробелы и обрезает края", () => {
    expect(collapseWhitespaceTrim("  Иван   Петров  ")).toBe("Иван Петров");
  });

  it("возвращает пустую строку для одних пробелов", () => {
    expect(collapseWhitespaceTrim("   \t\n  ")).toBe("");
  });
});
