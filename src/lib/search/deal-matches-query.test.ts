import type { Client } from "../../types";
import type { Deal } from "../../types/deal";
import { dealMatchesQuery } from "./deal-matches-query";

const clients: Client[] = [
  {
    id: "c1",
    name: "Альфа",
    phone: "",
    email: "",
    company: "",
    website: "",
    comment: "",
    createdAt: "2024-01-01T00:00:00.000Z",
    deleted: false,
    createdBy: "u1",
  },
];

const deal: Deal = {
  id: "d1",
  title: "Поставка оборудования",
  description: "Срочно",
  clientId: "c1",
  amount: 150000,
  status: "in_progress",
  createdAt: "2024-02-01T12:00:00.000Z",
  createdBy: "u1",
};

describe("dealMatchesQuery", () => {
  it("находит по названию и статусу на русском", () => {
    expect(dealMatchesQuery(deal, "поставка", clients)).toBe(true);
    expect(dealMatchesQuery(deal, "в работе", clients)).toBe(true);
    expect(dealMatchesQuery(deal, "завершена", clients)).toBe(false);
  });

  it("находит по имени клиента", () => {
    expect(dealMatchesQuery(deal, "альфа", clients)).toBe(true);
  });
});
