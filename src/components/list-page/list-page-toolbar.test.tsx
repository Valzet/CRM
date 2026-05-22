import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { ListPageToolbar } from "./list-page-toolbar";

function ToolbarWithSearchState() {
  const [searchValue, setSearchValue] = useState("");
  return (
    <ListPageToolbar
      createLabel="Создать"
      onCreate={jest.fn()}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
    />
  );
}
describe("ListPageToolbar", () => {
  it("вызывает onCreate по клику на кнопку создания", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn();

    render(
      <ListPageToolbar
        createLabel="Добавить клиента"
        onCreate={onCreate}
        searchValue=""
        onSearchChange={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Добавить клиента" }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it("отображает введённый текст в поле поиска", async () => {
    const user = userEvent.setup();
    render(<ToolbarWithSearchState />);

    const search = screen.getByPlaceholderText("Искать");
    await user.type(search, "альфа");

    expect(search).toHaveValue("альфа");
  });
});
