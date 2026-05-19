import { Typography } from "antd";
import type { ReactNode } from "react";

type PlaceholderPageProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PlaceholderPage(props: PlaceholderPageProps) {
  const { title, description, children } = props;

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        {title}
      </Typography.Title>
      {description ? (
        <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
      ) : null}
      {children}
    </div>
  );
}
