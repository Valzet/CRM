import * as z from "zod";
import { collapseWhitespaceTrim } from "./normalize";

export const loginFormSchema = z.object({
  email: z
    .string()
    .transform(collapseWhitespaceTrim)
    .pipe(z.string().email("Введите корректный email")),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    firstName: z.string().transform(collapseWhitespaceTrim).pipe(z.string().min(1, "Введите имя")),
    lastName: z
      .string()
      .transform(collapseWhitespaceTrim)
      .pipe(z.string().min(1, "Введите фамилию")),
    email: z
      .string()
      .transform(collapseWhitespaceTrim)
      .pipe(z.string().email("Некорректный email")),
    username: z
      .string()
      .transform(collapseWhitespaceTrim)
      .pipe(z.string().min(1, "Введите имя аккаунта")),
    password: z.string().min(8, "Минимум 8 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const passwordRecoveryFormSchema = z.object({
  email: z.string().transform(collapseWhitespaceTrim).pipe(z.string().email("Некорректный email")),
});

export type PasswordRecoveryFormValues = z.infer<typeof passwordRecoveryFormSchema>;

export const emailConfirmFormSchema = z.object({
  confirmationLink: z
    .string()
    .transform(collapseWhitespaceTrim)
    .pipe(z.string().min(1, "Вставьте ссылку из письма"))
    .pipe(z.string().url("Укажите корректную ссылку")),
});

export type EmailConfirmFormValues = z.infer<typeof emailConfirmFormSchema>;
