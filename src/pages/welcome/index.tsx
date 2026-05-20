import { Button, Spin } from "antd";
import { useMemo, useState } from "react";
import { useAppSelector, useIsMobile } from "../../hooks";
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
import { selectAuthUserId } from "../../store/auth-slice";
import { ClientCreateModal } from "../../components/clients";
import { DealCreateModal } from "../../components/deals";
import { TaskCreateModal } from "../../components/tasks";
import {
  useGetClientsQuery,
  useGetDealsQuery,
  useGetTasksQuery,
  useGetUserByIdQuery,
} from "../../store/api";
import type { Client, Deal, Task } from "../../types";
import {
  CardsGrid,
  ClientCard,
  ClientCompany,
  ClientDealCount,
  ClientName,
  DealAmount,
  DealClient,
  DealDate,
  DealRow,
  DealsList,
  DealStatus,
  DealTitle,
  EmptyHint,
  PageSubtitle,
  PageTitle,
  SectionAction,
  SectionTitle,
  StatsCard,
  StatsHeaderCell,
  StatsHeaderRow,
  StatsLabelCell,
  StatsRow,
  StatsTable,
  StatsValueCell,
  TaskCard,
  TaskDealLabel,
  TaskDealName,
  TaskDueDate,
  TaskFooter,
  TaskStatus,
  TaskTitle,
  WelcomeRoot,
  DesktopOnly,
  MobileOnly,
  MobileStatCaption,
  MobileStatCard,
  MobileStatDelta,
  MobileStatDeltas,
  MobileStatMain,
  MobileStatRow,
  MobileStatTitle,
  MobileStatValue,
  MobileStatsStack,
  StickyMobileAction,
} from "./styled";
import {
  WelcomeDashboardTabs,
  WelcomeTabPanel,
  type WelcomeDashboardTab,
} from "./welcome-dashboard-tabs";

function isDealActive(d: Deal) {
  return d.status === "new" || d.status === "in_progress";
}

function dealCompletionMoment(d: Deal) {
  return d.completedAt ?? d.createdAt;
}

function formatDelta(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

function findClientName(clients: Client[], clientId: string) {
  return clients.find((c) => c.id === clientId)?.name ?? "—";
}

function findDealTitle(dealsList: Deal[], dealId: string) {
  return dealsList.find((d) => d.id === dealId)?.title ?? "—";
}

export function WelcomePage() {
  const isMobile = useIsMobile();
  const [dashboardTab, setDashboardTab] = useState<WelcomeDashboardTab>("home");
  const [clientCreateOpen, setClientCreateOpen] = useState(false);
  const [dealCreateOpen, setDealCreateOpen] = useState(false);
  const [taskCreateOpen, setTaskCreateOpen] = useState(false);
  const userId = useAppSelector(selectAuthUserId);
  const { data: user } = useGetUserByIdQuery(userId ?? "", { skip: !userId });
  const { data: clientsDeletedAware = [], isLoading: lc } = useGetClientsQuery({
    includeDeleted: true,
  });
  const { data: deals = [], isLoading: ld } = useGetDealsQuery();
  const { data: tasks = [], isLoading: lt } = useGetTasksQuery();
  const firstName = user?.name?.split(/\s+/)[0] ?? "коллега";

  const mineClients = useMemo(
    () => clientsDeletedAware.filter((c) => c.createdBy === userId && !c.deleted),
    [clientsDeletedAware, userId],
  );
  const mineDeals = useMemo(() => deals.filter((d) => d.createdBy === userId), [deals, userId]);
  const mineTasks = useMemo(() => tasks.filter((t) => t.createdBy === userId), [tasks, userId]);

  const statsRows = useMemo(() => {
    const today = new Date();
    const bdToday = boundsToday(today);
    const bdWeek = boundsWeekToToday(today);
    const bdMonth = boundsMonthToToday(today);
    const bdQuarter = boundsQuarterToToday(today);
    const countAdded = (items: { createdAt: string }[], start: Date, end: Date) =>
      items.filter((x) => isoTimestampInRange(x.createdAt, start, end)).length;
    const activeDeals = mineDeals.filter(isDealActive);
    const completedDeals = mineDeals.filter((d) => d.status === "completed");
    const dealsAddedActive = activeDeals;
    const completionInRange = (d: Deal, start: Date, end: Date) =>
      d.status === "completed" && isoTimestampInRange(dealCompletionMoment(d), start, end);

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
        addedQuarter: countAdded(dealsAddedActive, bdQuarter.start, bdQuarter.end),
      },
      {
        key: "done",
        row: "Завершённые сделки",
        today: completedDeals.length,
        addedToday: completedDeals.filter((d) => completionInRange(d, bdToday.start, bdToday.end))
          .length,
        addedWeek: completedDeals.filter((d) => completionInRange(d, bdWeek.start, bdWeek.end))
          .length,
        addedMonth: completedDeals.filter((d) => completionInRange(d, bdMonth.start, bdMonth.end))
          .length,
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
    return [...mineTasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);
  }, [mineTasks]);

  if (!userId || lc || ld || lt) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  const stickyAction =
    dashboardTab === "clients"
      ? { label: "Новый клиент", onClick: () => setClientCreateOpen(true) }
      : dashboardTab === "deals"
        ? { label: "Новая сделка", onClick: () => setDealCreateOpen(true) }
        : dashboardTab === "tasks"
          ? { label: "Новая задача", onClick: () => setTaskCreateOpen(true) }
          : null;

  return (
    <WelcomeRoot>
      <PageTitle>Добро пожаловать, {firstName}!</PageTitle>
      <PageSubtitle>
        Посмотрите сводную информацию по вашим клиентам, сделкам и задачам
      </PageSubtitle>

      {isMobile ? (
        <WelcomeDashboardTabs active={dashboardTab} onChange={setDashboardTab} />
      ) : null}

      <WelcomeTabPanel isMobile={isMobile} active={dashboardTab} section="home">
        <MobileOnly>
          <MobileStatsStack>
            {statsRows.map((row) => (
              <MobileStatCard key={row.key}>
                <MobileStatTitle>{row.row}</MobileStatTitle>
                <MobileStatRow>
                  <MobileStatMain>
                    <MobileStatValue>{row.today}</MobileStatValue>
                    <MobileStatCaption>на сегодня</MobileStatCaption>
                  </MobileStatMain>
                  <MobileStatDeltas>
                    <MobileStatDelta>за сегодня {formatDelta(row.addedToday)}</MobileStatDelta>
                    <MobileStatDelta>за неделю {formatDelta(row.addedWeek)}</MobileStatDelta>
                    <MobileStatDelta>за месяц {formatDelta(row.addedMonth)}</MobileStatDelta>
                    <MobileStatDelta>за квартал {formatDelta(row.addedQuarter)}</MobileStatDelta>
                  </MobileStatDeltas>
                </MobileStatRow>
              </MobileStatCard>
            ))}
          </MobileStatsStack>
        </MobileOnly>
        <DesktopOnly>
          <StatsCard>
            <StatsTable>
              <StatsHeaderRow>
                <StatsHeaderCell />
                <StatsHeaderCell>на сегодня</StatsHeaderCell>
                <StatsHeaderCell>за сегодня</StatsHeaderCell>
                <StatsHeaderCell>за неделю</StatsHeaderCell>
                <StatsHeaderCell>за месяц</StatsHeaderCell>
                <StatsHeaderCell>за квартал</StatsHeaderCell>
              </StatsHeaderRow>
              {statsRows.map((row) => (
                <StatsRow key={row.key}>
                  <StatsLabelCell>{row.row}</StatsLabelCell>
                  <StatsValueCell $variant="primary">{row.today}</StatsValueCell>
                  <StatsValueCell>{formatDelta(row.addedToday)}</StatsValueCell>
                  <StatsValueCell>{formatDelta(row.addedWeek)}</StatsValueCell>
                  <StatsValueCell>{formatDelta(row.addedMonth)}</StatsValueCell>
                  <StatsValueCell>{formatDelta(row.addedQuarter)}</StatsValueCell>
                </StatsRow>
              ))}
            </StatsTable>
          </StatsCard>
        </DesktopOnly>
      </WelcomeTabPanel>

      <WelcomeTabPanel isMobile={isMobile} active={dashboardTab} section="clients">
      <SectionTitle>топ 10 активных клиентов</SectionTitle>
      {topClients.length ? (
        <CardsGrid>
          {topClients.map(({ c, n }) => (
            <ClientCard key={c.id}>
              <ClientName>{c.name}</ClientName>
              <ClientCompany>«{c.company}»</ClientCompany>
              <ClientDealCount>
                <span>{n}</span> сделок
              </ClientDealCount>
            </ClientCard>
          ))}
        </CardsGrid>
      ) : (
        <EmptyHint>Нет сделок для отображения топа клиентов.</EmptyHint>
      )}
      <DesktopOnly>
        <SectionAction>
          <Button type="primary" onClick={() => setClientCreateOpen(true)}>
            Новый клиент
          </Button>
        </SectionAction>
      </DesktopOnly>
      </WelcomeTabPanel>

      <WelcomeTabPanel isMobile={isMobile} active={dashboardTab} section="deals">
      <SectionTitle>Топ 10 активных сделок</SectionTitle>
      {recentActiveDeals.length ? (
        <DealsList>
          {recentActiveDeals.map((deal) => (
            <DealRow key={deal.id}>
              <DealTitle>{deal.title}</DealTitle>
              <DealClient>{findClientName(clientsDeletedAware, deal.clientId)}</DealClient>
              <DealAmount>{deal.amount.toLocaleString("ru-RU")} ₽</DealAmount>
              <DealStatus $status={deal.status}>{DEAL_STATUS_META[deal.status].label}</DealStatus>
              <DealDate>{formatDateRu(deal.createdAt)}</DealDate>
            </DealRow>
          ))}
        </DealsList>
      ) : (
        <EmptyHint>Активных сделок пока нет.</EmptyHint>
      )}
      <DesktopOnly>
        <SectionAction>
          <Button type="primary" onClick={() => setDealCreateOpen(true)}>
            Новая сделка
          </Button>
        </SectionAction>
      </DesktopOnly>
      </WelcomeTabPanel>

      <WelcomeTabPanel isMobile={isMobile} active={dashboardTab} section="tasks">
      <SectionTitle>Последние 10 задач</SectionTitle>
      {recentTasks.length ? (
        <CardsGrid>
          {recentTasks.map((task) => (
            <TaskMiniCard key={task.id} task={task} dealTitle={findDealTitle(deals, task.dealId)} />
          ))}
        </CardsGrid>
      ) : (
        <EmptyHint>Задач пока нет.</EmptyHint>
      )}
      <DesktopOnly>
        <SectionAction>
          <Button type="primary" onClick={() => setTaskCreateOpen(true)}>
            Новая задача
          </Button>
        </SectionAction>
      </DesktopOnly>
      </WelcomeTabPanel>

      {isMobile && stickyAction ? (
        <StickyMobileAction>
          <Button type="primary" block onClick={stickyAction.onClick}>
            {stickyAction.label}
          </Button>
        </StickyMobileAction>
      ) : null}

      <ClientCreateModal open={clientCreateOpen} onClose={() => setClientCreateOpen(false)} />
      <DealCreateModal open={dealCreateOpen} onClose={() => setDealCreateOpen(false)} />
      <TaskCreateModal open={taskCreateOpen} onClose={() => setTaskCreateOpen(false)} />
    </WelcomeRoot>
  );
}

function TaskMiniCard({ task, dealTitle }: { task: Task; dealTitle: string }) {
  const meta = TASK_STATUS_META[task.status];
  const completed = task.status === "completed";

  return (
    <TaskCard $completed={completed}>
      <TaskTitle>{task.title}</TaskTitle>
      <TaskDealLabel>сделка</TaskDealLabel>
      <TaskDealName>{dealTitle}</TaskDealName>
      <TaskFooter>
        <TaskDueDate>до {formatDateRu(task.dueDate)}</TaskDueDate>
        <TaskStatus $status={task.status}>{meta.label}</TaskStatus>
      </TaskFooter>
    </TaskCard>
  );
}
