import { formatPhoneRu } from "./phone-ru";

describe("formatPhoneRu", () => {
  it("возвращает тире для пустого значения", () => {
    expect(formatPhoneRu(null)).toBe("—");
    expect(formatPhoneRu("   ")).toBe("—");
  });

  it("форматирует 11 цифр с ведущей 7", () => {
    expect(formatPhoneRu("+7 (999) 123-45-67")).toBe("+7 999 123-45-67");
  });

  it("форматирует 10 цифр без кода страны", () => {
    expect(formatPhoneRu("9991234567")).toBe("+7 999 123-45-67");
  });

  it("оставляет нестандартный номер как есть", () => {
    expect(formatPhoneRu("123")).toBe("123");
  });
});
