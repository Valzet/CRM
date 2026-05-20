export function collapseWhitespaceTrim(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
