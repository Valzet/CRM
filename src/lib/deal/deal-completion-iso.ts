import type { Deal } from "../../types/deal";

export function dealCompletionIso(deal: Deal): string {
  return deal.completedAt ?? deal.createdAt;
}
