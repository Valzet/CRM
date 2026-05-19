import * as z from "zod";
import { collapseWhitespaceTrim } from "./normalize";

export const clientFormSchema = z.object({
  name: z.string().transform(collapseWhitespaceTrim).pipe(z.string().min(1, "Обязательное поле")),
  phone: z.string().transform(collapseWhitespaceTrim),
  email: z
    .string()
    .transform(collapseWhitespaceTrim)
    .pipe(z.union([z.literal(""), z.string().email("Некорректный email")])),
  company: z.string().transform(collapseWhitespaceTrim),
  website: z
    .string()
    .transform(collapseWhitespaceTrim)
    .pipe(z.union([z.literal(""), z.string().url("Некорректный URL")])),
  comment: z.string().transform(collapseWhitespaceTrim),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
