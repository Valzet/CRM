import * as z from "zod";
import { collapseWhitespaceTrim } from "./normalize";

/** PATCH /users — имя одной строкой + логин. */
export type AccountProfilePatch = {
  name: string;
  email: string;
  username?: string;
};

export const accountSettingsSchema = z
  .object({
    firstName: z
      .string()
      .transform(collapseWhitespaceTrim)
      .pipe(z.string().min(1, "Введите имя")),
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
    existingPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const wantsChange =
      Boolean(data.newPassword) ||
      Boolean(data.confirmPassword) ||
      Boolean(data.existingPassword);
    if (!wantsChange) return;
    if (!data.existingPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Укажите текущий пароль",
        path: ["existingPassword"],
      });
    }
    if (data.newPassword && data.newPassword.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Минимум 8 символов",
        path: ["newPassword"],
      });
    }
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
      });
    }
  });

export type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>;
