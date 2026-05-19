import { Spin } from "antd";

export function ModalBodyLoading() {
  return (
    <div style={{ textAlign: "center", padding: 24 }}>
      <Spin />
    </div>
  );
}
