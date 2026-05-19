import type { TaskFormValues } from "../../../schemas";

export const taskFormDefaultValues: TaskFormValues = {
  title: "",
  description: "",
  dealId: "",
  assigneeId: "",
  status: "new",
  dueDateLocal: "",
};
