import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "./login-page";
import { renderWithProviders } from "../../test/render-with-providers";

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks", () => ({
  ...jest.requireActual("../../hooks"),
  useIsMobile: jest.fn(() => false),
}));

jest.mock("../../store/api", () => ({
  useLoginMutation: () => [mockLogin, { isLoading: false }],
}));

const { useIsMobile } = jest.requireMock("../../hooks") as { useIsMobile: jest.Mock };

describe("LoginPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockReset();
    useIsMobile.mockReturnValue(false);
    mockLogin.mockReturnValue({ unwrap: async () => ({ userId: "u99" }) });
  });

  it("показывает ошибки валидации при пустой отправке", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, {
      router: { initialEntries: ["/login"], initialIndex: 0 },
    });

    await user.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByText("Введите корректный email")).toBeInTheDocument();
    expect(screen.getByText("Введите пароль")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("на мобильном без showForm показывает лендинг", () => {
    useIsMobile.mockReturnValue(true);

    renderWithProviders(<LoginPage />, {
      router: { initialEntries: ["/login"] },
    });

    expect(screen.getByRole("button", { name: "Войти" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Вход в аккаунт" })).not.toBeInTheDocument();
  });

  it("после успешного входа сохраняет сессию и переходит на welcome", async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(<LoginPage />, {
      router: { initialEntries: ["/login"], initialIndex: 0 },
    });

    await user.type(screen.getByPlaceholderText("ivanov@yandex.ru"), "user@test.ru");
    await user.type(screen.getByPlaceholderText("••••••"), "password1");
    await user.click(screen.getByRole("button", { name: "Войти" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "user@test.ru",
        password: "password1",
      });
    });

    await waitFor(() => {
      expect(store.getState().auth.userId).toBe("u99");
      expect(mockNavigate).toHaveBeenCalledWith("/welcome", { replace: true });
    });
  });
});
