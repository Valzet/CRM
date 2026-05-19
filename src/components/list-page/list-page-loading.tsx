import { Spin } from "antd";
import { PageRoot } from "./list-page-layout.styled";

export function ListPageLoading() {
  return (
    <PageRoot>
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin />
      </div>
    </PageRoot>
  );
}
