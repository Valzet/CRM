import type { Task } from "../../types";
import { taskMatchesQuery } from "./task-matches-query";

const task: Task = {
  id: "t1",
  title: "Согласовать договор",
  description: "Срочно до пятницы",
  dealId: "d1",
  assigneeId: "u1",
  status: "in_progress",
  dueDate: "2024-03-15T10:00:00.000Z",
  createdAt: "2024-03-01T09:00:00.000Z",
  createdBy: "u2",
};

describe("taskMatchesQuery", () => {
  it("пропускает всех при пустом запросе", () => {
    expect(taskMatchesQuery(task, "", "Сделка А", "Иван")).toBe(true);
    expect(taskMatchesQuery(task, "  ", "Сделка А", "Иван")).toBe(true);
  });

  it("находит по названию и статусу на русском", () => {
    expect(taskMatchesQuery(task, "договор", "Сделка А", "Иван")).toBe(true);
    expect(taskMatchesQuery(task, "в работе", "Сделка А", "Иван")).toBe(true);
    expect(taskMatchesQuery(task, "завершена", "Сделка А", "Иван")).toBe(false);
  });

  it("находит по сделке и исполнителю", () => {
    expect(taskMatchesQuery(task, "сделка а", "Сделка А", "Иван")).toBe(true);
    expect(taskMatchesQuery(task, "петров", "Сделка А", "Иван")).toBe(false);
    expect(taskMatchesQuery(task, "иван", "Сделка А", "Иван Петров")).toBe(true);
  });
});
