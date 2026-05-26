import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

const DEFAULT_MESSAGE = "Что-то пошло не так. Попробуйте ещё раз.";

function readDataMessage(data: unknown): string | undefined {
  if (typeof data === "string") {
    const trimmed = data.trim();
    return trimmed || undefined;
  }
  if (typeof data === "object" && data !== null && "message" in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === "string") {
      const trimmed = msg.trim();
      return trimmed || undefined;
    }
  }
  return undefined;
}

/** Текст ошибки из `.unwrap()` RTK Query mutation. */
export function getMutationErrorMessage(
  error: unknown,
  fallback = DEFAULT_MESSAGE,
): string {
  if (!error || typeof error !== "object") return fallback;

  if ("data" in error) {
    const fromData = readDataMessage((error as FetchBaseQueryError).data);
    if (fromData) return fromData;
  }

  if ("message" in error) {
    const msg = (error as SerializedError).message;
    if (typeof msg === "string" && msg.trim()) return msg.trim();
  }

  return fallback;
}
