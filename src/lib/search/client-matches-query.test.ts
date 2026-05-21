import type { Client } from "../../types";
import { clientMatchesQuery } from "./client-matches-query";

const baseClient: Client = {
  id: "1",
  name: "ООО Ромашка",
  phone: "79991234567",
  email: "info@romashka.ru",
  company: "Ромашка",
  website: "https://romashka.ru",
  comment: "VIP",
  createdAt: "2024-01-15T10:00:00.000Z",
  deleted: false,
  createdBy: "u1",
};

describe("clientMatchesQuery", () => {
  it("пропускает всех при пустом запросе", () => {
    expect(clientMatchesQuery(baseClient, "")).toBe(true);
    expect(clientMatchesQuery(baseClient, "   ")).toBe(true);
  });

  it("находит по имени без учёта регистра", () => {
    expect(clientMatchesQuery(baseClient, "ромашка")).toBe(true);
    expect(clientMatchesQuery(baseClient, "лилии")).toBe(false);
  });

  it("находит по отформатированному телефону", () => {
    expect(clientMatchesQuery(baseClient, "999 123")).toBe(true);
  });
});
