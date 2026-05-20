import { Button } from "antd";
import { StickyListAction } from "./mobile-list.styled";

type Props = {
  label: string;
  onClick: () => void;
};

export function ListPageStickyAction({ label, onClick }: Props) {
  return (
    <StickyListAction>
      <Button type="primary" block onClick={onClick}>
        {label}
      </Button>
    </StickyListAction>
  );
}
