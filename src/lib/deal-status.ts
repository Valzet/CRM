import type { DealStatus } from '../types/deal'

export const DEAL_STATUS_META: Record<
  DealStatus,
  { label: string; color: string }
> = {
  new: { label: 'Новая', color: 'default' },
  in_progress: { label: 'В работе', color: 'processing' },
  completed: { label: 'Завершена', color: 'success' },
  cancelled: { label: 'Отменена', color: 'warning' },
}
