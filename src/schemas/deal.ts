import * as z from "zod";
import { collapseWhitespaceTrim } from "./normalize";

export const dealFormSchema = z.object({
  title: z
    .string()
    .transform(collapseWhitespaceTrim)
    .pipe(z.string().min(1, "Обязательное поле")),
  description: z.string().transform(collapseWhitespaceTrim),
  clientId: z
    .string()
    .transform(collapseWhitespaceTrim)
    .pipe(z.string().min(1, "Выберите клиента")),
  amount: z.number().positive("Сумма должна быть больше 0"),
  status: z.enum(["new", "in_progress", "completed", "cancelled"]),
});

export type DealFormValues = z.infer<typeof dealFormSchema>;
