import { getMutationErrorMessage } from "./mutation-error-message";

describe("getMutationErrorMessage", () => {
  it("возвращает строку из data", () => {
    expect(getMutationErrorMessage({ status: 401, data: "Неверный email или пароль" })).toBe(
      "Неверный email или пароль",
    );
  });

  it("возвращает fallback для неизвестной ошибки", () => {
    expect(getMutationErrorMessage(null, "Ошибка")).toBe("Ошибка");
  });
});
