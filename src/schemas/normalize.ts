/** Сжимает повторяющиеся пробелы и обрезает края — для текстовых полей форм. */
export function collapseWhitespaceTrim(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
