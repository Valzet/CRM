import { clearStoredUserId, readStoredUserId, writeStoredUserId } from "./auth-storage";

describe("auth-storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("сохраняет и читает id пользователя", () => {
    writeStoredUserId("user-42");
    expect(readStoredUserId()).toBe("user-42");
  });

  it("clearStoredUserId удаляет сохранённый id", () => {
    writeStoredUserId("user-42");
    clearStoredUserId();
    expect(readStoredUserId()).toBeNull();
  });
});
