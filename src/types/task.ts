export type TaskStatus = 'new' | 'in_progress' | 'completed'

export type Task = {
  id: string
  title: string
  description: string
  dealId: string
  assigneeId: string
  status: TaskStatus
  dueDate: string
  createdAt: string
  createdBy: string
}
