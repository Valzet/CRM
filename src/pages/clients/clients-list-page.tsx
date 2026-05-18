import { Alert, Button, Input, Space, Spin, Table, Typography } from "antd";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatDateRu } from "../../lib/format/date-ru";
import { path } from "../../lib/constants/navigation";
import { useGetClientsQuery } from "../../store/api";
import type { Client } from "../../types";
import { ClientEditModal } from "./client-edit-modal";

function clientMatchesQuery(c: Client, needle: string) {
  const n = needle.trim().toLowerCase();
  if (!n) return true;
  const hay = [
    c.name,
    c.phone ?? "",
    c.email ?? "",
    c.company ?? "",
    c.website ?? "",
    c.comment ?? "",
    c.createdAt ?? "",
    formatDateRu(c.createdAt),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

export function ClientsListPage() {
  const {
    data: clients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClientsQuery();
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const filtered = useMemo(
    () => clients.filter((c) => clientMatchesQuery(c, q)),
    [clients, q],
  );

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
          Клиенты
        </Typography.Title>
        <Alert
          type="warning"
          showIcon
          message="Не удалось загрузить данные"
          description={
            error && "status" in error
              ? "Убедитесь, что json-server запущен: npm run server"
              : "Проверьте сеть и прокси Vite (/api → localhost:3001)."
          }
        />
        <Button onClick={() => refetch()}>Повторить</Button>
      </Space>
    );
  }

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Клиенты
      </Typography.Title>
      <Space wrap style={{ marginBottom: 16, width: "100%" }} align="start">
        <Link to={`${path.clients}/new`}>
          <Button type="primary">Новый клиент</Button>
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

      <Table<Client>
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
            title: "Имя",
            dataIndex: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (t: string, row) => (
              <Link
                to={`${path.clients}/${row.id}/edit`}
                onClick={(e) => e.stopPropagation()}
              >
                {t}
              </Link>
            ),
          },
          {
            title: "Телефон",
            dataIndex: "phone",
            sorter: (a, b) => (a.phone ?? "").localeCompare(b.phone ?? ""),
          },
          {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => (a.email ?? "").localeCompare(b.email ?? ""),
          },
          {
            title: "Название компании",
            dataIndex: "company",
            sorter: (a, b) => a.company.localeCompare(b.company),
          },
          {
            title: "Сайт",
            dataIndex: "website",
            sorter: (a, b) => (a.website ?? "").localeCompare(b.website ?? ""),
            render: (w: string) =>
              w ? (
                <a
                  href={w.startsWith("http") ? w : `https://${w}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {w}
                </a>
              ) : (
                "—"
              ),
          },
          {
            title: "Комментарий",
            dataIndex: "comment",
            ellipsis: true,
            sorter: (a, b) => (a.comment ?? "").localeCompare(b.comment ?? ""),
          },
          {
            title: "Добавлен",
            dataIndex: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (v: string) => formatDateRu(v),
          },
        ]}
      />

      <ClientEditModal
        clientId={editId}
        open={editId !== null}
        onClose={() => setEditId(null)}
      />
    </div>
  );
}
