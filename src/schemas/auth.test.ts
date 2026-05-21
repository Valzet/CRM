import { loginFormSchema, registerFormSchema } from "./auth";

describe("loginFormSchema", () => {
  it("требует корректный email и пароль", () => {
    const invalid = loginFormSchema.safeParse({ email: "not-email", password: "" });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      const messages = invalid.error.issues.map((i) => i.message);
      expect(messages).toContain("Введите корректный email");
      expect(messages).toContain("Введите пароль");
    }
  });

  it("нормализует пробелы в email", () => {
    const valid = loginFormSchema.safeParse({ email: "  user@mail.ru ", password: "secret" });
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.email).toBe("user@mail.ru");
    }
  });
});

describe("registerFormSchema", () => {
  it("сообщает о несовпадении паролей", () => {
    const result = registerFormSchema.safeParse({
      firstName: "Иван",
      lastName: "Иванов",
      email: "ivan@test.ru",
      username: "ivan",
      password: "12345678",
      confirmPassword: "87654321",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Пароли не совпадают")).toBe(true);
    }
  });
});
