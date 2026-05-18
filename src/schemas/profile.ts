import * as z from "zod";
import { collapseWhitespaceTrim } from "./normalize";

export const profileFormSchema = z.object({
  name: z
    .string()
    .transform(collapseWhitespaceTrim)
    .pipe(z.string().min(1, "Обязательное поле")),
  email: z
    .string()
    .transform(collapseWhitespaceTrim)
    .pipe(z.string().email("Некорректный email")),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
