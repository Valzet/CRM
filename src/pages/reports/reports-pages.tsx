import type { TableColumnsType } from "antd";
import { Alert, Button, Space, Spin, Table } from "antd";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useIsMobile } from "../../hooks";
import { dealCompletionIso } from "../../lib/deal/deal-completion-iso";
import { isoTimestampInRange } from "../../lib/date/periods";
import {
  useGetClientsQuery,
  useGetDealsQuery,
  useGetTasksQuery,
  useGetUsersQuery,
} from "../../store/api";
import type { DealStatus } from "../../types";
import type { User } from "../../types/user";
import {
  dealMatchesReportFilters,
  defaultReportFilters,
  matchesDealStatus,
  matchesManagerId,
  resolveReportDateRange,
  type ReportFilterValues,
} from "./report-filters";
import {
  buildActivityColumns,
  buildNewClientsColumns,
  buildOverdueColumns,
  buildSalesColumns,
  buildStagesColumns,
  ReportMobileFilters,
} from "./report-table-column-filters";
import {
  ArrowIconLeft,
  ArrowIconRight,
  ExportButton,
  FilterSelect,
  OverdueTableWrap,
  PageArrow,
  PageNumber,
  PaginationBar,
  ReportSection,
  SectionTitle,
  SectionToolbar,
  StagesTableWrap,
  TableWrap,
  ToolbarActions,
  ToolbarFilters,
  dealStageRowClassName,
} from "./reports-pages.styled";
import {
  ActivityReportMobileCard,
  NewClientReportMobileCard,
  OverdueReportMobileCard,
  SalesReportMobileCard,
  StageReportMobileCard,
} from "./reports-mobile-cards";
import { MobileCardList } from "./reports-mobile-cards.styled";

const PAGE_SIZE = 10;

const VIEW_OPTS = [{ value: "list", label: "Списком" }] as const;

function ReportPagination(props: { page: number; total: number; onPage: (page: number) => void }) {
  const { page, total, onPage } = props;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  if (total === 0) return null;

  return (
    <PaginationBar aria-label="Навигация по страницам">
      <PageArrow
        type="button"
        disabled={safePage <= 1}
        onClick={() => onPage(safePage - 1)}
        aria-label="Предыдущая страница"
      >
        <ArrowIconLeft />
      </PageArrow>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <PageNumber
          key={n}
          type="button"
          $active={n === safePage}
          onClick={() => onPage(n)}
          aria-label={`Страница ${n}`}
          aria-current={n === safePage ? "page" : undefined}
        >
          {n}
        </PageNumber>
      ))}
      <PageArrow
        type="button"
        disabled={safePage >= totalPages}
        onClick={() => onPage(safePage + 1)}
        aria-label="Следующая страница"
      >
        <ArrowIconRight />
      </PageArrow>
    </PaginationBar>
  );
}

function SectionControls() {
  return (
    <SectionToolbar>
      <ToolbarFilters>
        <FilterSelect value="list" options={[...VIEW_OPTS]} disabled />
      </ToolbarFilters>
      <ToolbarActions>
        <ExportButton disabled>Экспорт в PDF</ExportButton>
        <ExportButton disabled>Экспорт в XLSX</ExportButton>
      </ToolbarActions>
    </SectionToolbar>
  );
}

function ReportBlock<T extends { key: string }>(props: {
  title: string;
  filters: ReportFilterValues;
  onFiltersChange: (filters: ReportFilterValues) => void;
  users: User[];
  columns: TableColumnsType<T>;
  dataSource: T[];
  wrap?: "default" | "stages" | "overdue";
  rowClassName?: (record: T) => string;
  renderMobileCard?: (record: T) => ReactNode;
}) {
  const {
    title,
    filters,
    onFiltersChange,
    users,
    columns,
    dataSource,
    wrap,
    rowClassName,
    renderMobileCard,
  } = props;

  return (
    <ReportSection>
      <SectionTitle>{title}</SectionTitle>
      <SectionControls />
      <PaginatedReportTable
        filters={filters}
        onFiltersChange={onFiltersChange}
        users={users}
        columns={columns}
        dataSource={dataSource}
        wrap={wrap}
        rowClassName={rowClassName}
        renderMobileCard={renderMobileCard}
      />
    </ReportSection>
  );
}

function PaginatedReportTable<T extends { key: string }>(props: {
  filters: ReportFilterValues;
  onFiltersChange: (filters: ReportFilterValues) => void;
  users: User[];
  columns: TableColumnsType<T>;
  dataSource: T[];
  wrap?: "default" | "stages" | "overdue";
  rowClassName?: (record: T) => string;
  renderMobileCard?: (record: T) => ReactNode;
}) {
  const {
    filters,
    onFiltersChange,
    users,
    columns,
    dataSource,
    wrap = "default",
    rowClassName,
    renderMobileCard,
  } = props;
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [prevDataSource, setPrevDataSource] = useState(dataSource);
  if (dataSource !== prevDataSource) {
    setPrevDataSource(dataSource);
    setPage(1);
  }

  const pageData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return dataSource.slice(start, start + PAGE_SIZE);
  }, [dataSource, page]);

  const Wrap =
    wrap === "stages" ? StagesTableWrap : wrap === "overdue" ? OverdueTableWrap : TableWrap;

  if (isMobile && renderMobileCard) {
    return (
      <>
        <ReportMobileFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          users={users}
        />
        {pageData.length ? (
          <MobileCardList>
            {pageData.map((row) => (
              <li key={row.key}>{renderMobileCard(row)}</li>
            ))}
          </MobileCardList>
        ) : (
          <p style={{ margin: 0, color: "var(--crm-color-text-secondary)", textAlign: "center" }}>
            Нет данных за выбранный период
          </p>
        )}
        <ReportPagination page={page} total={dataSource.length} onPage={setPage} />
      </>
    );
  }

  return (
    <>
      <Wrap>
        <Table<T>
          rowKey="key"
          size="middle"
          pagination={false}
          dataSource={pageData}
          columns={columns}
          rowClassName={rowClassName}
        />
      </Wrap>
      <ReportPagination page={page} total={dataSource.length} onPage={setPage} />
    </>
  );
}

function ReportsSpinner() {
  return (
    <div style={{ padding: 48, textAlign: "center" }}>
      <Spin />
    </div>
  );
}

function ReportsError(props: { error: unknown; onRetry: () => void }) {
  const { onRetry } = props;
  return (
    <Space orientation="vertical" style={{ width: "100%" }}>
      <Alert type="warning" showIcon message="Не удалось загрузить отчёт" />
      <Button onClick={onRetry}>Повторить</Button>
    </Space>
  );
}

export function ReportsSalesPage() {
  const { data: deals = [], isLoading, isError, error, refetch } = useGetDealsQuery();
  const { data: clients = [] } = useGetClientsQuery({ includeDeleted: true });
  const { data: users = [] } = useGetUsersQuery();

  const [salesFilters, setSalesFilters] = useState(defaultReportFilters);
  const [stagesFilters, setStagesFilters] = useState(defaultReportFilters);
  const salesRange = resolveReportDateRange(salesFilters);
  const stagesRange = resolveReportDateRange(stagesFilters);

  const salesColumns = useMemo(
    () => buildSalesColumns(salesFilters, setSalesFilters, users),
    [salesFilters, users],
  );
  const stagesColumns = useMemo(
    () => buildStagesColumns(stagesFilters, setStagesFilters, users),
    [stagesFilters, users],
  );

  const completedRows = useMemo(() => {
    return deals
      .filter((d) => dealMatchesReportFilters(d, salesFilters, { defaultStatus: "completed" }))
      .filter((d) =>
        isoTimestampInRange(dealCompletionIso(d), salesRange.start, salesRange.end),
      )
      .map((d) => ({
        key: d.id,
        deal: d,
        clientName: clients.find((c) => c.id === d.clientId)?.name ?? "—",
      }));
  }, [deals, clients, salesFilters, salesRange.start, salesRange.end]);

  const stagesRows = useMemo(() => {
    const map = new Map<string, { count: number; sum: number }>();
    for (const d of deals) {
      if (!isoTimestampInRange(d.createdAt, stagesRange.start, stagesRange.end)) continue;
      if (!dealMatchesReportFilters(d, stagesFilters)) continue;
      const cur = map.get(d.status) ?? { count: 0, sum: 0 };
      cur.count += 1;
      cur.sum += d.amount;
      map.set(d.status, cur);
    }
    return [...map.entries()].map(([status, { count, sum }]) => ({
      key: status,
      status: status as DealStatus,
      count,
      sum,
    }));
  }, [deals, stagesFilters, stagesRange.start, stagesRange.end]);

  if (isLoading) return <ReportsSpinner />;
  if (isError) {
    return (
      <ReportsError
        error={error}
        onRetry={() => {
          refetch();
        }}
      />
    );
  }

  return (
    <>
      <ReportBlock
        title="Общий, продажи"
        filters={salesFilters}
        onFiltersChange={setSalesFilters}
        users={users}
        columns={salesColumns}
        dataSource={completedRows}
        renderMobileCard={(row) => (
          <SalesReportMobileCard deal={row.deal} clientName={row.clientName} />
        )}
      />
      <ReportBlock
        title="Этапы сделок"
        filters={stagesFilters}
        onFiltersChange={setStagesFilters}
        users={users}
        columns={stagesColumns}
        dataSource={stagesRows}
        wrap="stages"
        rowClassName={(row) => dealStageRowClassName(row.status)}
        renderMobileCard={(row) => (
          <StageReportMobileCard status={row.status} count={row.count} sum={row.sum} />
        )}
      />
    </>
  );
}

export function ReportsClientsPage() {
  const {
    data: clients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClientsQuery({ includeDeleted: true });
  const { data: deals = [] } = useGetDealsQuery();
  const { data: tasks = [] } = useGetTasksQuery();
  const { data: users = [] } = useGetUsersQuery();

  const [newClientsFilters, setNewClientsFilters] = useState(defaultReportFilters);
  const [activityFilters, setActivityFilters] = useState(defaultReportFilters);
  const newClientsRange = resolveReportDateRange(newClientsFilters);
  const activityRange = resolveReportDateRange(activityFilters);

  const newClientsColumns = useMemo(
    () => buildNewClientsColumns(newClientsFilters, setNewClientsFilters, users),
    [newClientsFilters, users],
  );
  const activityColumns = useMemo(
    () => buildActivityColumns(activityFilters, setActivityFilters, users),
    [activityFilters, users],
  );

  const newClientsRows = useMemo(() => {
    return [...clients]
      .filter((c) => !c.deleted)
      .filter((c) => matchesManagerId(c.createdBy, newClientsFilters.managerId))
      .filter((c) =>
        isoTimestampInRange(c.createdAt, newClientsRange.start, newClientsRange.end),
      )
      .filter((c) => {
        if (!newClientsFilters.dealStatus) return true;
        return deals.some(
          (d) => d.clientId === c.id && d.status === newClientsFilters.dealStatus,
        );
      })
      .map((c) => ({ ...c, key: c.id }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [clients, deals, newClientsFilters, newClientsRange.start, newClientsRange.end]);

  const activityRows = useMemo(() => {
    return clients
      .filter((c) => !c.deleted)
      .filter((c) => matchesManagerId(c.createdBy, activityFilters.managerId))
      .map((c) => {
        const ds = deals.filter(
          (d) =>
            d.clientId === c.id &&
            isoTimestampInRange(d.createdAt, activityRange.start, activityRange.end) &&
            matchesDealStatus(d.status, activityFilters.dealStatus),
        );
        const taskDealSet = new Set(ds.map((d) => d.id));
        const doneTasks = tasks.filter(
          (t) => taskDealSet.has(t.dealId) && t.status === "completed",
        );

        return {
          key: c.id,
          id: c.id,
          name: c.name,
          deals: ds.length,
          completedTasks: doneTasks.length,
        };
      })
      .filter((r) => r.deals > 0 || r.completedTasks > 0);
  }, [clients, deals, tasks, activityFilters, activityRange.start, activityRange.end]);

  if (isLoading) return <ReportsSpinner />;
  if (isError) {
    return (
      <ReportsError
        error={error}
        onRetry={() => {
          refetch();
        }}
      />
    );
  }

  return (
    <>
      <ReportBlock
        title="Новые клиенты"
        filters={newClientsFilters}
        onFiltersChange={setNewClientsFilters}
        users={users}
        columns={newClientsColumns}
        dataSource={newClientsRows}
        renderMobileCard={(row) => <NewClientReportMobileCard client={row} />}
      />
      <ReportBlock
        title="Активности клиентов"
        filters={activityFilters}
        onFiltersChange={setActivityFilters}
        users={users}
        columns={activityColumns}
        dataSource={activityRows}
        renderMobileCard={(row) => <ActivityReportMobileCard {...row} />}
      />
    </>
  );
}

export function ReportsTasksPage() {
  const { data: tasks = [], isLoading, isError, error, refetch } = useGetTasksQuery();
  const { data: users = [] } = useGetUsersQuery();
  const { data: deals = [] } = useGetDealsQuery();

  const [filters, setFilters] = useState(defaultReportFilters);
  const { start, end } = resolveReportDateRange(filters);
  const dealById = useMemo(() => new Map(deals.map((d) => [d.id, d])), [deals]);

  const overdueColumns = useMemo(
    () => buildOverdueColumns(filters, setFilters, users),
    [filters, users],
  );

  const overdue = useMemo(() => {
    return tasks
      .filter((t) => {
        if (t.status === "completed") return false;
        return new Date(t.dueDate) < new Date();
      })
      .filter((t) => matchesManagerId(t.assigneeId, filters.managerId))
      .filter((t) => isoTimestampInRange(t.dueDate, start, end))
      .filter((t) => {
        if (!filters.dealStatus) return true;
        const deal = dealById.get(t.dealId);
        return deal?.status === filters.dealStatus;
      })
      .map((t) => ({
        key: t.id,
        id: t.id,
        title: t.title,
        assignee: users.find((u) => u.id === t.assigneeId)?.name ?? "—",
        status: t.status,
        dueDate: t.dueDate,
      }))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks, users, filters, dealById, start, end]);

  if (isLoading) return <ReportsSpinner />;
  if (isError) {
    return (
      <ReportsError
        error={error}
        onRetry={() => {
          refetch();
        }}
      />
    );
  }

  return (
    <ReportBlock
      title="Просроченные задачи"
      filters={filters}
      onFiltersChange={setFilters}
      users={users}
      columns={overdueColumns}
      dataSource={overdue}
      wrap="overdue"
      rowClassName={() => "row-overdue"}
      renderMobileCard={(row) => <OverdueReportMobileCard {...row} />}
    />
  );
}
