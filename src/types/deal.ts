export type DealStatus = 'new' | 'in_progress' | 'completed' | 'cancelled'

export type Deal = {
  id: string
  title: string
  description: string
  clientId: string
  amount: number
  status: DealStatus
  createdAt: string
  completedAt?: string
  createdBy: string
}
