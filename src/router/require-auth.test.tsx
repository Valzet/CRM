import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { Page } from "../lib/constants/navigation";
import { renderWithProviders } from "../test/render-with-providers";
import { RequireAuth } from "./require-auth";

jest.mock("../hooks", () => ({
  ...jest.requireActual("../hooks"),
  useIsMobile: jest.fn(() => false),
}));

const { useIsMobile } = jest.requireMock("../hooks") as { useIsMobile: jest.Mock };

describe("RequireAuth", () => {
  beforeEach(() => {
    useIsMobile.mockReturnValue(false);
  });

  it("показывает дочерний контент авторизованному пользователю", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/private"
          element={
            <RequireAuth>
              <p>Секретная зона</p>
            </RequireAuth>
          }
        />
      </Routes>,
      { auth: { userId: "u1" }, router: { initialEntries: ["/private"] } },
    );

    expect(screen.getByText("Секретная зона")).toBeInTheDocument();
  });

  it("перенаправляет на логин без сессии (desktop)", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/private"
          element={
            <RequireAuth>
              <p>Секретная зона</p>
            </RequireAuth>
          }
        />
        <Route path={Page.LOGIN} element={<p>Страница входа</p>} />
      </Routes>,
      { auth: { userId: null }, router: { initialEntries: ["/private"] } },
    );

    expect(screen.getByText("Страница входа")).toBeInTheDocument();
    expect(screen.queryByText("Секретная зона")).not.toBeInTheDocument();
  });

  it("перенаправляет на главную на мобильном без сессии", () => {
    useIsMobile.mockReturnValue(true);

    renderWithProviders(
      <Routes>
        <Route
          path="/private"
          element={
            <RequireAuth>
              <p>Секретная зона</p>
            </RequireAuth>
          }
        />
        <Route path={Page.MAIN} element={<p>Лендинг</p>} />
      </Routes>,
      { auth: { userId: null }, router: { initialEntries: ["/private"] } },
    );

    expect(screen.getByText("Лендинг")).toBeInTheDocument();
  });
});
