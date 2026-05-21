import { DEAL_STATUS_META } from "../deal-status";
import { formatDateRu } from "../format/date-ru";
import type { Client } from "../../types";
import type { Deal } from "../../types/deal";

export function dealMatchesQuery(deal: Deal, needle: string, clients: Client[]): boolean {
  const s = needle.trim().toLowerCase();
  if (!s) return true;
  const clientName = (clients.find((c) => c.id === deal.clientId)?.name ?? "—").toLowerCase();
  const statusLabel = (DEAL_STATUS_META[deal.status]?.label ?? deal.status).toLowerCase();
  const hay = [
    deal.title,
    deal.description,
    String(deal.amount),
    deal.status,
    statusLabel,
    clientName,
    deal.createdAt,
    formatDateRu(deal.createdAt),
    deal.completedAt ? formatDateRu(deal.completedAt) : "",
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(s);
}
