import { formatDateRu } from "../format/date-ru";
import { formatPhoneRu } from "../format/phone-ru";
import type { Client } from "../../types";

export function clientMatchesQuery(client: Client, needle: string): boolean {
  const n = needle.trim().toLowerCase();
  if (!n) return true;
  const hay = [
    client.name,
    client.phone ?? "",
    formatPhoneRu(client.phone),
    client.email ?? "",
    client.company ?? "",
    client.website ?? "",
    client.comment ?? "",
    client.createdAt ?? "",
    formatDateRu(client.createdAt),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}
