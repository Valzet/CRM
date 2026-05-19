export function formatMoneyRu(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}
