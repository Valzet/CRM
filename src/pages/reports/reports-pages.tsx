import type { TableColumnsType } from "antd";
import { Alert, Button, Space, Spin, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DEAL_STATUS_META } from "../../lib/deal-status";
import { isoTimestampInRange } from "../../lib/date/periods";
import { formatDateRu } from "../../lib/format/date-ru";
import { path } from "../../lib/constants/navigation";
import {
  useGetClientsQuery,
  useGetDealsQuery,
  useGetTasksQuery,
  useGetUsersQuery,
} from "../../store/api";
import type { Deal, DealStatus } from "../../types";
import type { Client } from "../../types/client";
import type { ReportPreset } from "./report-period";
import { rangeForPreset } from "./report-period";
import {
  ArrowIconLeft,
  ArrowIconRight,
  ExportButton,
  FilterSelect,
  OverdueStatus,
  OverdueTableWrap,
  PageArrow,
  PageNumber,
  PaginationBar,
  ReportSection,
  SectionTitle,
  SectionToolbar,
  StagesTableWrap,
  StageStatusCell,
  TableWrap,
  ToolbarActions,
  ToolbarFilters,
  dealStageRowClassName,
} from "./reports-pages.styled";

type ClientReportRow = Client & { key: string };

const PAGE_SIZE = 10;

const PRESET_OPTS: { value: ReportPreset; label: string }[] = [
  { value: "week", label: "За неделю" },
  { value: "month", label: "За месяц" },
  { value: "quarter", label: "За квартал" },
  { value: "all", label: "Всё время" },
];

const VIEW_OPTS = [{ value: "list", label: "Списком" }] as const;

function dealCompletionIso(d: Deal) {
  return d.completedAt ?? d.createdAt;
}

function formatAmountRub(amount: number) {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

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

function SectionControls(props: { preset: ReportPreset; onPreset: (v: ReportPreset) => void }) {
  const { preset, onPreset } = props;

  return (
    <SectionToolbar>
      <ToolbarFilters>
        <FilterSelect
          value={preset}
          onChange={(v) => onPreset(v as ReportPreset)}
          options={PRESET_OPTS}
        />
        <FilterSelect value="list" options={[...VIEW_OPTS]} disabled />
      </ToolbarFilters>
      <ToolbarActions>
        <ExportButton disabled>Экспорт в PDF</ExportButton>
        <ExportButton disabled>Экспорт в XLSX</ExportButton>
      </ToolbarActions>
    </SectionToolbar>
  );
}

function PaginatedReportTable<T extends { key: string }>(props: {
  columns: TableColumnsType<T>;
  dataSource: T[];
  wrap?: "default" | "stages" | "overdue";
  rowClassName?: (record: T) => string;
}) {
  const { columns, dataSource, wrap = "default", rowClassName } = props;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [dataSource]);

  const pageData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return dataSource.slice(start, start + PAGE_SIZE);
  }, [dataSource, page]);

  const Wrap =
    wrap === "stages" ? StagesTableWrap : wrap === "overdue" ? OverdueTableWrap : TableWrap;

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
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert type="warning" showIcon message="Не удалось загрузить отчёт" />
      <Button onClick={onRetry}>Повторить</Button>
    </Space>
  );
}

function ReportBlock<T extends { key: string }>(props: {
  title: string;
  preset: ReportPreset;
  onPreset: (v: ReportPreset) => void;
  columns: TableColumnsType<T>;
  dataSource: T[];
  wrap?: "default" | "stages" | "overdue";
  rowClassName?: (record: T) => string;
}) {
  const { title, preset, onPreset, columns, dataSource, wrap, rowClassName } = props;

  return (
    <ReportSection>
      <SectionTitle>{title}</SectionTitle>
      <SectionControls preset={preset} onPreset={onPreset} />
      <PaginatedReportTable
        columns={columns}
        dataSource={dataSource}
        wrap={wrap}
        rowClassName={rowClassName}
      />
    </ReportSection>
  );
}

const salesColumns: TableColumnsType<{
  key: string;
  deal: Deal;
  clientName: string;
}> = [
  {
    title: "ID сделки",
    key: "id",
    sorter: (a, b) => a.deal.id.localeCompare(b.deal.id),
    render: (_, row) => row.deal.id,
    ellipsis: true,
    width: 120,
  },
  {
    title: "Название",
    key: "title",
    sorter: (a, b) => a.deal.title.localeCompare(b.deal.title),
    render: (_, row) => row.deal.title,
  },
  {
    title: "Клиент",
    dataIndex: "clientName",
    sorter: (a, b) => a.clientName.localeCompare(b.clientName),
  },
  {
    title: "Сумма",
    key: "amount",
    sorter: (a, b) => a.deal.amount - b.deal.amount,
    render: (_, row) => formatAmountRub(row.deal.amount),
  },
  {
    title: "Дата завершения",
    key: "completed",
    sorter: (a, b) => dealCompletionIso(a.deal).localeCompare(dealCompletionIso(b.deal)),
    render: (_, row) => (row.deal.completedAt ? formatDateRu(row.deal.completedAt) : "—"),
  },
];

const stagesColumns: TableColumnsType<{
  key: string;
  status: DealStatus;
  count: number;
  sum: number;
}> = [
  {
    title: "Этап сделки",
    dataIndex: "status",
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: (s: DealStatus) => (
      <StageStatusCell $status={s}>{DEAL_STATUS_META[s]?.label ?? s}</StageStatusCell>
    ),
  },
  {
    title: "Количество сделок на этапе",
    dataIndex: "count",
    sorter: (a, b) => a.count - b.count,
  },
  {
    title: "Общая сумма сделок на этапе",
    dataIndex: "sum",
    sorter: (a, b) => a.sum - b.sum,
    render: (v: number) => formatAmountRub(v),
  },
];

const newClientsColumns: TableColumnsType<ClientReportRow> = [
  {
    title: "ID клиента",
    dataIndex: "id",
    sorter: (a, b) => a.id.localeCompare(b.id),
    ellipsis: true,
    width: 120,
  },
  {
    title: "Имя клиента",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (t: string, row) => <Link to={`${path.clients}/${row.id}/edit`}>{t}</Link>,
  },
  {
    title: "Компания",
    dataIndex: "company",
    sorter: (a, b) => a.company.localeCompare(b.company),
  },
  {
    title: "Дата добавления",
    dataIndex: "createdAt",
    sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    render: (v: string) => formatDateRu(v),
  },
];

const activityColumns: TableColumnsType<{
  key: string;
  id: string;
  name: string;
  deals: number;
  completedTasks: number;
}> = [
  {
    title: "ID клиента",
    dataIndex: "id",
    sorter: (a, b) => a.id.localeCompare(b.id),
  },
  {
    title: "Имя клиента",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Количество сделок",
    dataIndex: "deals",
    sorter: (a, b) => a.deals - b.deals,
  },
  {
    title: "Завершённые задачи",
    dataIndex: "completedTasks",
    sorter: (a, b) => a.completedTasks - b.completedTasks,
  },
];

const overdueColumns: TableColumnsType<{
  key: string;
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
}> = [
  {
    title: "ID задачи",
    dataIndex: "id",
    sorter: (a, b) => a.id.localeCompare(b.id),
    ellipsis: true,
    width: 120,
  },
  {
    title: "Название задачи",
    dataIndex: "title",
    sorter: (a, b) => a.title.localeCompare(b.title),
  },
  {
    title: "Ответственный",
    dataIndex: "assignee",
    sorter: (a, b) => a.assignee.localeCompare(b.assignee),
  },
  {
    title: "Статус",
    key: "status",
    render: () => <OverdueStatus>Просрочена</OverdueStatus>,
  },
  {
    title: "Дата срока выполнения",
    dataIndex: "dueDate",
    sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
    render: (v: string) => formatDateRu(v),
  },
];

export function ReportsSalesPage() {
  const { data: deals = [], isLoading, isError, error, refetch } = useGetDealsQuery();
  const { data: clients = [] } = useGetClientsQuery({ includeDeleted: true });

  const [preset, setPreset] = useState<ReportPreset>("week");
  const [stagesPreset, setStagesPreset] = useState<ReportPreset>("week");
  const { start, end } = rangeForPreset(preset);
  const stagesRange = rangeForPreset(stagesPreset);

  const completedRows = useMemo(() => {
    return deals
      .filter((d) => d.status === "completed")
      .filter((d) => isoTimestampInRange(dealCompletionIso(d), start, end))
      .map((d) => ({
        key: d.id,
        deal: d,
        clientName: clients.find((c) => c.id === d.clientId)?.name ?? "—",
      }));
  }, [deals, clients, start, end]);

  const stagesRows = useMemo(() => {
    const map = new Map<string, { count: number; sum: number }>();
    for (const d of deals) {
      if (!isoTimestampInRange(d.createdAt, stagesRange.start, stagesRange.end)) continue;
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
  }, [deals, stagesRange.start, stagesRange.end]);

  if (isLoading) return <ReportsSpinner />;
  if (isError) {
    return (
      <ReportsError
        error={error}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <>
      <ReportBlock
        title="Общий, продажи"
        preset={preset}
        onPreset={setPreset}
        columns={salesColumns}
        dataSource={completedRows}
      />
      <ReportBlock
        title="Этапы сделок"
        preset={stagesPreset}
        onPreset={setStagesPreset}
        columns={stagesColumns}
        dataSource={stagesRows}
        wrap="stages"
        rowClassName={(row) => dealStageRowClassName(row.status)}
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

  const [newClientsPreset, setNewClientsPreset] = useState<ReportPreset>("week");
  const [activityPreset, setActivityPreset] = useState<ReportPreset>("week");
  const newClientsRange = rangeForPreset(newClientsPreset);
  const activityRange = rangeForPreset(activityPreset);

  const newClientsRows = useMemo(() => {
    return [...clients]
      .filter((c) => !c.deleted)
      .filter((c) => isoTimestampInRange(c.createdAt, newClientsRange.start, newClientsRange.end))
      .map((c) => ({ ...c, key: c.id }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [clients, newClientsRange.start, newClientsRange.end]);

  const activityRows = useMemo(() => {
    return clients
      .filter((c) => !c.deleted)
      .map((c) => {
        const ds = deals.filter(
          (d) =>
            d.clientId === c.id &&
            isoTimestampInRange(d.createdAt, activityRange.start, activityRange.end),
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
  }, [clients, deals, tasks, activityRange.start, activityRange.end]);

  if (isLoading) return <ReportsSpinner />;
  if (isError) {
    return (
      <ReportsError
        error={error}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <>
      <ReportBlock
        title="Новые клиенты"
        preset={newClientsPreset}
        onPreset={setNewClientsPreset}
        columns={newClientsColumns}
        dataSource={newClientsRows}
      />
      <ReportBlock
        title="Активности клиентов"
        preset={activityPreset}
        onPreset={setActivityPreset}
        columns={activityColumns}
        dataSource={activityRows}
      />
    </>
  );
}

export function ReportsTasksPage() {
  const { data: tasks = [], isLoading, isError, error, refetch } = useGetTasksQuery();
  const { data: users = [] } = useGetUsersQuery();

  const [preset, setPreset] = useState<ReportPreset>("week");
  const { start, end } = rangeForPreset(preset);

  const overdue = useMemo(() => {
    return tasks
      .filter((t) => {
        if (t.status === "completed") return false;
        return new Date(t.dueDate) < new Date();
      })
      .filter((t) => isoTimestampInRange(t.dueDate, start, end))
      .map((t) => ({
        key: t.id,
        id: t.id,
        title: t.title,
        assignee: users.find((u) => u.id === t.assigneeId)?.name ?? "—",
        dueDate: t.dueDate,
      }))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks, users, start, end]);

  if (isLoading) return <ReportsSpinner />;
  if (isError) {
    return (
      <ReportsError
        error={error}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <ReportBlock
      title="Просроченные задачи"
      preset={preset}
      onPreset={setPreset}
      columns={overdueColumns}
      dataSource={overdue}
      wrap="overdue"
      rowClassName={() => "row-overdue"}
    />
  );
}
