import { UiButton } from "../ui/button";
import { SearchField, SearchIcon, Toolbar } from "./list-page-layout.styled";

type Props = {
  createLabel: string;
  onCreate: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function ListPageToolbar(props: Props) {
  const { createLabel, onCreate, searchValue, onSearchChange } = props;

  return (
    <Toolbar>
      <UiButton type="primary" onClick={onCreate}>
        {createLabel}
      </UiButton>
      <SearchField
        allowClear
        placeholder="Искать"
        prefixIcon={<SearchIcon />}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Toolbar>
  );
}
