import * as z from "zod";
import { collapseWhitespaceTrim } from "./normalize";

export const taskFormSchema = z.object({
  title: z.string().transform(collapseWhitespaceTrim).pipe(z.string().min(1, "Обязательное поле")),
  description: z.string().transform(collapseWhitespaceTrim),
  dealId: z.string().transform(collapseWhitespaceTrim).pipe(z.string().min(1, "Выберите сделку")),
  assigneeId: z
    .string()
    .transform(collapseWhitespaceTrim)
    .pipe(z.string().min(1, "Выберите исполнителя")),
  status: z.enum(["new", "in_progress", "completed"]),
  dueDateLocal: z
    .string()
    .transform(collapseWhitespaceTrim)
    .pipe(z.string().min(1, "Укажите срок выполнения")),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
