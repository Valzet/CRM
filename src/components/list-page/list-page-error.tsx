import { Alert, Button, Space } from "antd";
import type { ReactNode } from "react";
import { PageHeading, PageRoot } from "./list-page-layout.styled";

type Props = {
  title: string;
  message?: string;
  description?: ReactNode;
  onRetry: () => void;
};

export function ListPageError(props: Props) {
  const { title, message = "Не удалось загрузить данные", description, onRetry } = props;

  return (
    <PageRoot>
      <Space direction="vertical" style={{ width: "100%" }}>
        <PageHeading>{title}</PageHeading>
        <Alert type="warning" showIcon message={message} description={description} />
        <Button onClick={onRetry}>Повторить</Button>
      </Space>
    </PageRoot>
  );
}
