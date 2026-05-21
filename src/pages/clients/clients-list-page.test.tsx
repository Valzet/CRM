import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientsListPage } from "./clients-list-page";
import { renderWithProviders } from "../../test/render-with-providers";
import type { Client } from "../../types";

const mockClients: Client[] = [
  {
    id: "c1",
    name: "Альфа",
    phone: "79991111111",
    email: "a@test.ru",
    company: "Альфа ООО",
    website: "",
    comment: "",
    createdAt: "2024-01-01T00:00:00.000Z",
    deleted: false,
    createdBy: "u1",
  },
  {
    id: "c2",
    name: "Бета",
    phone: "79992222222",
    email: "b@test.ru",
    company: "Бета ООО",
    website: "",
    comment: "",
    createdAt: "2024-02-01T00:00:00.000Z",
    deleted: false,
    createdBy: "u1",
  },
];

jest.mock("../../hooks", () => ({
  ...jest.requireActual("../../hooks"),
  useIsMobile: jest.fn(() => false),
}));

jest.mock("../../store/api", () => ({
  useGetClientsQuery: () => ({
    data: mockClients,
    isLoading: false,
    isError: false,
    error: undefined,
    refetch: jest.fn(),
  }),
  useGetClientByIdQuery: () => ({
    data: undefined,
    isFetching: false,
  }),
  useUpdateClientMutation: () => [jest.fn(), { isLoading: false }],
  useSoftDeleteClientMutation: () => [jest.fn(), { isLoading: false }],
  useCreateClientMutation: () => [jest.fn(), { isLoading: false }],
}));

describe("ClientsListPage", () => {
  it("фильтрует список по поисковому запросу", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ClientsListPage />, {
      auth: { userId: "u1" },
      router: { initialEntries: ["/clients"] },
    });

    expect(screen.getByText("Альфа")).toBeInTheDocument();
    expect(screen.getByText("Бета")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Искать"), "альфа");

    expect(screen.getByText("Альфа")).toBeInTheDocument();
    expect(screen.queryByText("Бета")).not.toBeInTheDocument();
  });
});
