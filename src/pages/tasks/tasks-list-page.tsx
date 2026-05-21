import { Table } from "antd";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListPageError,
  ListPageLoading,
  ListPageStickyAction,
  ListPageToolbar,
  PageHeading,
  PageRoot,
} from "../../components/list-page";
import {
  TaskCreateModal,
  TaskEditModal,
  TasksMobileList,
  TaskStatusCell,
  TaskTitleCell,
  TasksTableWrap,
  taskRowClassName,
} from "../../components/tasks";
import { useIsMobile } from "../../hooks";
import { path } from "../../lib/constants/navigation";
import { formatDateRu } from "../../lib/format/date-ru";
import { taskMatchesQuery } from "../../lib/search/task-matches-query";
import { TASK_STATUS_META } from "../../lib/task-status";
import { useGetDealsQuery, useGetTasksQuery, useGetUsersQuery } from "../../store/api";
import type { Task } from "../../types";

export function TasksListPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { data: tasks = [], isLoading, isError, error, refetch } = useGetTasksQuery();
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
        taskMatchesQuery(t, q, dealTitleById(t.dealId), userNameById(t.assigneeId)),
      ),
    [tasks, q, dealTitleById, userNameById],
  );

  if (isLoading) return <ListPageLoading />;

  if (isError) {
    return (
      <ListPageError
        title="Задачи"
        message="Не удалось загрузить задачи"
        description={
          error && "status" in error ? "Запустите json-server: npm run server" : "Проверьте сеть."
        }
        onRetry={() => refetch()}
      />
    );
  }

  const openCreate = () => {
    if (isMobile) {
      navigate(`${path.tasks}/new`);
      return;
    }
    setCreateOpen(true);
  };

  return (
    <PageRoot $mobileStickyFooter={isMobile}>
      <PageHeading>Задачи</PageHeading>

      <ListPageToolbar
        createLabel="Новая задача"
        onCreate={openCreate}
        searchValue={q}
        onSearchChange={setQ}
      />

      {isMobile ? (
        <TasksMobileList tasks={filtered} dealTitleById={dealTitleById} />
      ) : (
        <TasksTableWrap>
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
                sorter: (a, b) => dealTitleById(a.dealId).localeCompare(dealTitleById(b.dealId)),
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
                  userNameById(a.assigneeId).localeCompare(userNameById(b.assigneeId)),
                render: (_, row) => userNameById(row.assigneeId),
              },
              {
                title: "Статус",
                dataIndex: "status",
                sorter: (a, b) => a.status.localeCompare(b.status),
                render: (s: Task["status"]) => (
                  <TaskStatusCell $status={s}>{TASK_STATUS_META[s].label}</TaskStatusCell>
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
        </TasksTableWrap>
      )}

      {isMobile ? <ListPageStickyAction label="Новая задача" onClick={openCreate} /> : null}

      {!isMobile ? (
        <>
          <TaskCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
          <TaskEditModal
            taskId={editTaskId}
            open={editTaskId !== null}
            onClose={() => setEditTaskId(null)}
          />
        </>
      ) : null}
    </PageRoot>
  );
}
