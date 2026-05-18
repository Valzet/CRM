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
import { formatDateRu } from "../../lib/format/date-ru";
import { TASK_STATUS_META } from "../../lib/task-status";
import { path } from "../../lib/constants/navigation";
import {
  useGetDealsQuery,
  useGetTasksQuery,
  useGetUsersQuery,
} from "../../store/api";
import type { Task } from "../../types";

export function TasksListPage() {
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTasksQuery();
  const { data: deals = [] } = useGetDealsQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return tasks;
    return tasks.filter((t) => {
      const dt = (
        deals.find((d) => d.id === t.dealId)?.title ?? ""
      ).toLowerCase();
      const an = (
        users.find((u) => u.id === t.assigneeId)?.name ?? ""
      ).toLowerCase();
      return (
        t.title.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        dt.includes(s) ||
        an.includes(s)
      );
    });
  }, [tasks, q, deals, users]);

  const dealTitle = (id: string) =>
    deals.find((d) => d.id === id)?.title ?? "—";
  const userName = (id: string) => users.find((u) => u.id === id)?.name ?? "—";

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
          Задачи
        </Typography.Title>
        <Alert
          type="warning"
          showIcon
          message="Не удалось загрузить задачи"
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
        Задачи
      </Typography.Title>
      <Space wrap style={{ marginBottom: 16, width: "100%" }} align="start">
        <Link to={`${path.tasks}/new`}>
          <Button type="primary">Новая задача</Button>
        </Link>
        <Input.Search
          allowClear
          placeholder="Искать"
          onSearch={setQ}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 420, minWidth: 200 }}
          enterButton
        />
      </Space>
      <Table<Task>
        rowKey="id"
        size="middle"
        pagination={{ pageSize: 12, showSizeChanger: true }}
        dataSource={filtered}
        columns={[
          {
            title: "Название",
            dataIndex: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (t: string, row) => (
              <Link to={`${path.tasks}/${row.id}/edit`}>{t}</Link>
            ),
          },
          {
            title: "Сделка",
            key: "deal",
            render: (_, row) => dealTitle(row.dealId),
          },
          {
            title: "Описание",
            dataIndex: "description",
            ellipsis: true,
          },
          {
            title: "Выполнить до",
            dataIndex: "dueDate",
            sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
            render: (v: string) => formatDateRu(v),
          },
          {
            title: "Исполнитель",
            key: "assignee",
            render: (_, row) => userName(row.assigneeId),
          },
          {
            title: "Статус",
            dataIndex: "status",
            render: (s: Task["status"]) => {
              const m = TASK_STATUS_META[s];
              return <Tag color={m.color}>{m.label}</Tag>;
            },
          },
          {
            title: "Дата создания",
            dataIndex: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (v: string) => formatDateRu(v),
          },
        ]}
      />
    </div>
  );
}
