import { formatDateRu } from "../format/date-ru";
import { TASK_STATUS_META } from "../task-status";
import type { Task } from "../../types";

export function taskMatchesQuery(
  task: Task,
  needle: string,
  dealTitle: string,
  assigneeName: string,
): boolean {
  const n = needle.trim().toLowerCase();
  if (!n) return true;
  const statusLabel = (TASK_STATUS_META[task.status]?.label ?? task.status).toLowerCase();
  const hay = [
    task.title,
    task.description,
    dealTitle,
    assigneeName,
    task.status,
    statusLabel,
    task.dueDate,
    formatDateRu(task.dueDate),
    task.createdAt,
    formatDateRu(task.createdAt),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}
