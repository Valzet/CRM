import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import {
  boundsMonthToToday,
  boundsQuarterToToday,
  boundsToday,
  boundsWeekToToday,
  isoTimestampInRange,
} from "../../lib/date/periods";
import { DEAL_STATUS_META } from "../../lib/deal-status";
import { formatDateRu } from "../../lib/format/date-ru";
import { TASK_STATUS_META } from "../../lib/task-status";
import { path } from "../../lib/constants/navigation";
import { selectAuthUserId } from "../../store/auth-slice";
import {
  useGetClientsQuery,
  useGetDealsQuery,
  useGetTasksQuery,
  useGetUserByIdQuery,
} from "../../store/api";
import type { Deal, Task } from "../../types";
function isDealActive(d: Deal) {
  return d.status === "new" || d.status === "in_progress";
}
function dealCompletionMoment(d: Deal) {
  return d.completedAt ?? d.createdAt;
}
export function WelcomePage() {
  const userId = useAppSelector(selectAuthUserId);
  const { data: user } = useGetUserByIdQuery(userId ?? "", { skip: !userId });
  const { data: clientsDeletedAware = [], isLoading: lc } = useGetClientsQuery({
    includeDeleted: true,
  });
  const { data: deals = [], isLoading: ld } = useGetDealsQuery();
  const { data: tasks = [], isLoading: lt } = useGetTasksQuery();
  const firstName = user?.name?.split(/\s+/)[0] ?? "коллега";
  const mineClients = useMemo(
    () =>
      clientsDeletedAware.filter((c) => c.createdBy === userId && !c.deleted),
    [clientsDeletedAware, userId],
  );
  const mineDeals = useMemo(
    () => deals.filter((d) => d.createdBy === userId),
    [deals, userId],
  );
  const mineTasks = useMemo(
    () => tasks.filter((t) => t.createdBy === userId),
    [tasks, userId],
  );
  const statsRows = useMemo(() => {
    const today = new Date();
    const bdToday = boundsToday(today);
    const bdWeek = boundsWeekToToday(today);
    const bdMonth = boundsMonthToToday(today);
    const bdQuarter = boundsQuarterToToday(today);
    const countAdded = (
      items: { createdAt: string }[],
      start: Date,
      end: Date,
    ) =>
      items.filter((x) => isoTimestampInRange(x.createdAt, start, end)).length;
    const activeDeals = mineDeals.filter(isDealActive);
    const completedDeals = mineDeals.filter((d) => d.status === "completed");
    const dealsAddedActive = activeDeals;
    const completionInRange = (d: Deal, start: Date, end: Date) =>
      d.status === "completed" &&
      isoTimestampInRange(dealCompletionMoment(d), start, end);
    return [
      {
        key: "clients",
        row: "Клиенты",
        today: mineClients.length,
        addedToday: countAdded(mineClients, bdToday.start, bdToday.end),
        addedWeek: countAdded(mineClients, bdWeek.start, bdWeek.end),
        addedMonth: countAdded(mineClients, bdMonth.start, bdMonth.end),
        addedQuarter: countAdded(mineClients, bdQuarter.start, bdQuarter.end),
      },
      {
        key: "active",
        row: "Активные сделки",
        today: activeDeals.length,
        addedToday: countAdded(dealsAddedActive, bdToday.start, bdToday.end),
        addedWeek: countAdded(dealsAddedActive, bdWeek.start, bdWeek.end),
        addedMonth: countAdded(dealsAddedActive, bdMonth.start, bdMonth.end),
        addedQuarter: countAdded(
          dealsAddedActive,
          bdQuarter.start,
          bdQuarter.end,
        ),
      },
      {
        key: "done",
        row: "Завершённые сделки",
        today: completedDeals.length,
        addedToday: completedDeals.filter((d) =>
          completionInRange(d, bdToday.start, bdToday.end),
        ).length,
        addedWeek: completedDeals.filter((d) =>
          completionInRange(d, bdWeek.start, bdWeek.end),
        ).length,
        addedMonth: completedDeals.filter((d) =>
          completionInRange(d, bdMonth.start, bdMonth.end),
        ).length,
        addedQuarter: completedDeals.filter((d) =>
          completionInRange(d, bdQuarter.start, bdQuarter.end),
        ).length,
      },
    ];
  }, [mineClients, mineDeals]);
  const topClients = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of mineDeals) {
      counts.set(d.clientId, (counts.get(d.clientId) ?? 0) + 1);
    }
    return [...clientsDeletedAware]
      .map((c) => ({ c, n: counts.get(c.id) ?? 0 }))
      .sort((a, b) => b.n - a.n)
      .filter((row) => row.n > 0)
      .slice(0, 10);
  }, [clientsDeletedAware, mineDeals]);
  const recentActiveDeals = useMemo(() => {
    return [...mineDeals]
      .filter(isDealActive)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 10);
  }, [mineDeals]);
  const recentTasks = useMemo(() => {
    return [...mineTasks]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 10);
  }, [mineTasks]);
  if (!userId || lc || ld || lt) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        {" "}
        <Spin />{" "}
      </div>
    );
  }
  return (
    <div>
      {" "}
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        {" "}
        Добро пожаловать, {firstName}!{" "}
      </Typography.Title>{" "}
      <Typography.Paragraph type="secondary">
        {" "}
        Краткая сводка по вашим клиентам, сделкам и задачам.{" "}
      </Typography.Paragraph>{" "}
      <Card size="small" style={{ marginBottom: 24 }}>
        {" "}
        <Table
          size="small"
          pagination={false}
          dataSource={statsRows}
          columns={[
            { title: "", dataIndex: "row", width: 200 },
            { title: "на сегодня", dataIndex: "today" },
            { title: "добавилось за сегодня", dataIndex: "addedToday" },
            { title: "за неделю", dataIndex: "addedWeek" },
            { title: "за месяц", dataIndex: "addedMonth" },
            {
              title: "за квартал",
              dataIndex: "addedQuarter",
              render: (v: number) => (
                <Typography.Text type="success">{v}</Typography.Text>
              ),
            },
          ]}
        />{" "}
      </Card>{" "}
      <Typography.Title level={4}>Топ 10 активных клиентов</Typography.Title>{" "}
      <Row gutter={[16, 16]}>
        {" "}
        {topClients.map(({ c, n }) => (
          <Col xs={24} sm={12} md={8} lg={6} key={c.id}>
            {" "}
            <Card size="small" title={c.name}>
              {" "}
              <Typography.Text type="secondary">
                «{c.company}»
              </Typography.Text>{" "}
              <div>
                {" "}
                <Typography.Text type="success">
                  {" "}
                  {n} сделок (ваши){" "}
                </Typography.Text>{" "}
              </div>{" "}
              {c.deleted ? <Tag color="warning">клиент удалён</Tag> : null}{" "}
            </Card>{" "}
          </Col>
        ))}{" "}
      </Row>{" "}
      {!topClients.length ? (
        <Typography.Paragraph type="secondary">
          {" "}
          Нет сделок для отображения топа клиентов.{" "}
        </Typography.Paragraph>
      ) : null}{" "}
      <Space style={{ marginTop: 16 }} wrap>
        {" "}
        <Link to={`${path.clients}/new`}>
          {" "}
          <Button type="primary">Добавить клиента</Button>{" "}
        </Link>{" "}
      </Space>{" "}
      <Typography.Title level={4} style={{ marginTop: 32 }}>
        {" "}
        Последние 10 активных сделок{" "}
      </Typography.Title>{" "}
      <Table<Deal>
        size="small"
        rowKey="id"
        pagination={false}
        dataSource={recentActiveDeals}
        columns={[
          { title: "Название", dataIndex: "title" },
          {
            title: "Сумма",
            dataIndex: "amount",
            render: (v: number) => (
              <Typography.Text strong>
                {" "}
                {v.toLocaleString("ru-RU")} ₽{" "}
              </Typography.Text>
            ),
          },
          {
            title: "Статус",
            dataIndex: "status",
            render: (s: Deal["status"]) => DEAL_STATUS_META[s].label,
          },
          {
            title: "Создана",
            dataIndex: "createdAt",
            render: (v: string) => formatDateRu(v),
          },
        ]}
      />{" "}
      <Link to={`${path.deals}/new`}>
        {" "}
        <Button type="primary" style={{ marginTop: 16 }}>
          {" "}
          Добавить сделку{" "}
        </Button>{" "}
      </Link>{" "}
      <Typography.Title level={4} style={{ marginTop: 32 }}>
        {" "}
        Последние 10 ваших задач{" "}
      </Typography.Title>{" "}
      <Row gutter={[16, 16]}>
        {" "}
        {recentTasks.map((t) => (
          <Col xs={24} sm={12} md={8} lg={6} key={t.id}>
            {" "}
            <TaskMiniCard
              task={t}
              dealTitle={findDealTitle(deals, t.dealId)}
            />{" "}
          </Col>
        ))}{" "}
      </Row>{" "}
      {!recentTasks.length ? (
        <Typography.Paragraph type="secondary">
          {" "}
          Задач пока нет.{" "}
        </Typography.Paragraph>
      ) : null}{" "}
      <Link to={`${path.tasks}/new`}>
        {" "}
        <Button type="primary" style={{ marginTop: 16 }}>
          {" "}
          Добавить задачу{" "}
        </Button>{" "}
      </Link>{" "}
    </div>
  );
}
function findDealTitle(dealsList: Deal[], dealId: string) {
  return dealsList.find((d) => d.id === dealId)?.title ?? "—";
}
function TaskMiniCard({ task, dealTitle }: { task: Task; dealTitle: string }) {
  const meta = TASK_STATUS_META[task.status];
  return (
    <Card size="small" title={task.title}>
      {" "}
      <Space direction="vertical" size={4}>
        {" "}
        <Typography.Text type="secondary">{dealTitle}</Typography.Text>{" "}
        <Typography.Text>до {formatDateRu(task.dueDate)}</Typography.Text>{" "}
        <Tag color={meta.color}>{meta.label}</Tag>{" "}
      </Space>{" "}
    </Card>
  );
}
