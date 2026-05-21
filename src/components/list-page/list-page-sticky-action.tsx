import { Button } from "antd";
import { StickyFooterSpacer, StickyListAction } from "./mobile-list.styled";

type Props = {
  label: string;
  onClick: () => void;
};

export function ListPageStickyAction({ label, onClick }: Props) {
  return (
    <>
      <StickyFooterSpacer aria-hidden />
      <StickyListAction>
        <Button type="primary" block onClick={onClick}>
          {label}
        </Button>
      </StickyListAction>
    </>
  );
}
