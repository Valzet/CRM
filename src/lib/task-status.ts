import type { TaskStatus } from "../types/task";

export const TASK_STATUS_META: Record<TaskStatus, { label: string; color: string }> = {
  new: { label: "Новая", color: "default" },
  in_progress: { label: "В работе", color: "processing" },
  completed: { label: "Завершена", color: "success" },
};
