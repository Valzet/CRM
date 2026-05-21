import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DealCreateModal } from "./deal-create-modal";
import { renderWithProviders } from "../../test/render-with-providers";
import type { Client } from "../../types";

const mockCreateDeal = jest.fn();
const mockOnClose = jest.fn();

const clients: Client[] = [
  {
    id: "c1",
    name: "Альфа",
    phone: "",
    email: "",
    company: "Альфа ООО",
    website: "",
    comment: "",
    createdAt: "2024-01-01T00:00:00.000Z",
    deleted: false,
    createdBy: "u1",
  },
];

jest.mock("../../store/api", () => ({
  useCreateDealMutation: () => [mockCreateDeal, { isLoading: false }],
  useGetClientsQuery: () => ({
    data: clients,
    isLoading: false,
  }),
}));

describe("DealCreateModal", () => {
  beforeEach(() => {
    mockCreateDeal.mockReset();
    mockOnClose.mockClear();
    mockCreateDeal.mockReturnValue({ unwrap: async () => ({ id: "new-deal" }) });
  });

  it("не вызывает создание при пустой отправке", async () => {
    const user = userEvent.setup();

    renderWithProviders(<DealCreateModal open onClose={mockOnClose} />);

    await user.click(screen.getByRole("button", { name: "Создать сделку" }));

    expect(mockCreateDeal).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("создаёт сделку с заполненными полями", async () => {
    const user = userEvent.setup();

    renderWithProviders(<DealCreateModal open onClose={mockOnClose} />);

    const [titleInput] = screen.getAllByRole("textbox");
    await user.type(titleInput, "Новая поставка");

    const [clientSelect] = screen.getAllByRole("combobox");
    fireEvent.mouseDown(clientSelect);
    await user.click(await screen.findByText("Альфа"));

    await user.click(screen.getByRole("button", { name: "Создать сделку" }));

    await waitFor(() => {
      expect(mockCreateDeal).toHaveBeenCalledWith({
        title: "Новая поставка",
        description: "",
        clientId: "c1",
        amount: 1,
        status: "new",
      });
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
