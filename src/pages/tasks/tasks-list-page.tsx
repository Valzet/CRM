import { Alert, Button, Space, Spin, Table } from "antd";
import { useMemo, useState } from "react";
import { UiButton } from "../../components/ui/button";
import { formatDateRu } from "../../lib/format/date-ru";
import { TASK_STATUS_META } from "../../lib/task-status";
import {
  useGetDealsQuery,
  useGetTasksQuery,
  useGetUsersQuery,
} from "../../store/api";
import type { Task } from "../../types";
import { TaskCreateModal } from "./task-create-modal";
import { TaskEditModal } from "./task-edit-modal";
import {
  PageHeading,
  PageRoot,
  SearchField,
  SearchIcon,
  StatusCell,
  TableWrap,
  TaskTitleCell,
  Toolbar,
  taskRowClassName,
} from "./tasks-list-page.styled";

function taskMatchesQuery(
  t: Task,
  needle: string,
  dealTitle: string,
  assigneeName: string,
) {
  const n = needle.trim().toLowerCase();
  if (!n) return true;
  const statusLabel = (TASK_STATUS_META[t.status]?.label ?? t.status).toLowerCase();
  const hay = [
    t.title,
    t.description,
    dealTitle,
    assigneeName,
    t.status,
    statusLabel,
    t.dueDate,
    formatDateRu(t.dueDate),
    t.createdAt,
    formatDateRu(t.createdAt),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

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
  const [createOpen, setCreateOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  const dealTitleById = useMemo(() => {
    const map = new Map(deals.map((d) => [d.id, d.title]));
    return (id: string) => map.get(id) ?? "—";
  }, [deals]);

  const userNameById = useMemo(() => {
    const map = new Map(users.map((u) => [u.id, u.name]));
    return (id: string) => map.get(id) ?? "—";
  }, [users]);

  const filtered = useMemo(
    () =>
      tasks.filter((t) =>
        taskMatchesQuery(
          t,
          q,
          dealTitleById(t.dealId),
          userNameById(t.assigneeId),
        ),
      ),
    [tasks, q, dealTitleById, userNameById],
  );

  if (isLoading) {
    return (
      <PageRoot>
        <div style={{ padding: 48, textAlign: "center" }}>
          <Spin />
        </div>
      </PageRoot>
    );
  }

  if (isError) {
    return (
      <PageRoot>
        <Space direction="vertical" style={{ width: "100%" }}>
          <PageHeading>Задачи</PageHeading>
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
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <PageHeading>Задачи</PageHeading>

      <Toolbar>
        <UiButton type="primary" onClick={() => setCreateOpen(true)}>
          Новая задача
        </UiButton>
        <SearchField
          allowClear
          placeholder="Искать"
          prefixIcon={<SearchIcon />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </Toolbar>

      <TableWrap>
        <Table<Task>
          rowKey="id"
          size="middle"
          pagination={false}
          dataSource={filtered}
          rowClassName={(_, index) => taskRowClassName(index ?? 0)}
          onRow={(record) => ({
            onClick: () => setEditTaskId(record.id),
            style: { cursor: "pointer" },
          })}
          columns={[
            {
              title: "Название",
              dataIndex: "title",
              sorter: (a, b) => a.title.localeCompare(b.title),
              render: (t: string) => <TaskTitleCell>{t}</TaskTitleCell>,
            },
            {
              title: "Сделка",
              key: "deal",
              sorter: (a, b) =>
                dealTitleById(a.dealId).localeCompare(dealTitleById(b.dealId)),
              render: (_, row) => dealTitleById(row.dealId),
            },
            {
              title: "Описание",
              dataIndex: "description",
              ellipsis: true,
              sorter: (a, b) => a.description.localeCompare(b.description),
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
              sorter: (a, b) =>
                userNameById(a.assigneeId).localeCompare(
                  userNameById(b.assigneeId),
                ),
              render: (_, row) => userNameById(row.assigneeId),
            },
            {
              title: "Статус",
              dataIndex: "status",
              sorter: (a, b) => a.status.localeCompare(b.status),
              render: (s: Task["status"]) => (
                <StatusCell $status={s}>{TASK_STATUS_META[s].label}</StatusCell>
              ),
            },
            {
              title: "Дата создания",
              dataIndex: "createdAt",
              sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
              render: (v: string) => formatDateRu(v),
            },
          ]}
        />
      </TableWrap>

      <TaskCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <TaskEditModal
        taskId={editTaskId}
        open={editTaskId !== null}
        onClose={() => setEditTaskId(null)}
      />
    </PageRoot>
  );
}
