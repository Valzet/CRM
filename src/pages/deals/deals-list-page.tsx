import { PlusOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Input,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DEAL_STATUS_META } from "../../lib/deal-status";
import { formatDateRu } from "../../lib/format/date-ru";
import { path } from "../../lib/constants/navigation";
import { useGetClientsQuery, useGetDealsQuery } from "../../store/api";
import type { Deal } from "../../types";
import { DealEditModal } from "./deal-edit-modal";

export function DealsListPage() {
  const {
    data: deals = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDealsQuery();
  const { data: clients = [] } = useGetClientsQuery({ includeDeleted: true });
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return deals;
    return deals.filter((d) => {
      const cn = (
        clients.find((c) => c.id === d.clientId)?.name ?? "—"
      ).toLowerCase();
      const statusLabel = (
        DEAL_STATUS_META[d.status]?.label ?? d.status
      ).toLowerCase();
      const hay = [
        d.title,
        d.description,
        String(d.amount),
        d.status,
        statusLabel,
        cn,
        d.createdAt,
        formatDateRu(d.createdAt),
        d.completedAt ? formatDateRu(d.completedAt) : "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(s);
    });
  }, [deals, q, clients]);

  const nameByClientId = (id: string) =>
    clients.find((c) => c.id === id)?.name ?? "—";

  if (isLoading) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  if (isError) {
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          Сделки
        </Typography.Title>
        <Alert
          type="warning"
          showIcon
          message="Не удалось загрузить сделки"
          description={
            error && "status" in error
              ? "Запустите json-server: npm run server"
              : "Проверьте сеть."
          }
        />
        <Button onClick={() => refetch()}>Повторить</Button>
      </Space>
    );
  }

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Сделки
      </Typography.Title>
      <Space wrap style={{ marginBottom: 16, width: "100%" }} align="start">
        <Link to={`${path.deals}/new`}>
          <Button type="primary" icon={<PlusOutlined />}>
            Новая сделка
          </Button>
        </Link>
        <Input.Search
          allowClear
          placeholder="Поиск по всем полям"
          onSearch={setQ}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 420, minWidth: 200 }}
          enterButton
        />
      </Space>
      <Table<Deal>
        rowKey="id"
        size="middle"
        pagination={{ pageSize: 12, showSizeChanger: true }}
        dataSource={filtered}
        onRow={(record) => ({
          onClick: () => setEditId(record.id),
          style: { cursor: "pointer" },
        })}
        columns={[
          {
            title: "Название",
            dataIndex: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (t: string, row) => (
              <Link
                to={`${path.deals}/${row.id}/edit`}
                onClick={(e) => e.stopPropagation()}
              >
                {t}
              </Link>
            ),
          },
          {
            title: "Клиент",
            key: "client",
            sorter: (a, b) =>
              nameByClientId(a.clientId).localeCompare(
                nameByClientId(b.clientId),
              ),
            render: (_, row) => nameByClientId(row.clientId),
          },
          {
            title: "Описание",
            dataIndex: "description",
            ellipsis: true,
            sorter: (a, b) => a.description.localeCompare(b.description),
          },
          {
            title: "Этап (статус)",
            dataIndex: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (s: Deal["status"]) => {
              const m = DEAL_STATUS_META[s];
              return <Tag color={m.color}>{m.label}</Tag>;
            },
          },
          {
            title: "Сумма",
            dataIndex: "amount",
            sorter: (a, b) => a.amount - b.amount,
            render: (v: number) => `${v.toLocaleString("ru-RU")} ₽`,
          },
          {
            title: "Дата создания",
            dataIndex: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (v: string) => formatDateRu(v),
          },
          {
            title: "Дата завершения",
            dataIndex: "completedAt",
            sorter: (a, b) =>
              (a.completedAt ?? "").localeCompare(b.completedAt ?? ""),
            render: (v: string | undefined) => (v ? formatDateRu(v) : "—"),
          },
        ]}
      />

      <DealEditModal
        dealId={editId}
        open={editId !== null}
        onClose={() => setEditId(null)}
      />
    </div>
  );
}
