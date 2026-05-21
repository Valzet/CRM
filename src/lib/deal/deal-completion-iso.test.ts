import type { Deal } from "../../types/deal";
import { dealCompletionIso } from "./deal-completion-iso";

const base: Deal = {
  id: "d1",
  title: "Test",
  description: "",
  clientId: "c1",
  amount: 100,
  status: "new",
  createdAt: "2024-01-10T08:00:00.000Z",
  createdBy: "u1",
};

describe("dealCompletionIso", () => {
  it("возвращает completedAt, если сделка завершена", () => {
    const deal: Deal = {
      ...base,
      status: "completed",
      completedAt: "2024-02-20T15:00:00.000Z",
    };
    expect(dealCompletionIso(deal)).toBe("2024-02-20T15:00:00.000Z");
  });

  it("возвращает createdAt, если completedAt нет", () => {
    expect(dealCompletionIso(base)).toBe("2024-01-10T08:00:00.000Z");
  });
});
