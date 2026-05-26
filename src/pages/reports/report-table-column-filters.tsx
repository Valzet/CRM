import { FilterFilled } from "@ant-design/icons";
import { Button, Space } from "antd";
import type { ColumnType } from "antd/es/table";
import { Link } from "react-router-dom";
import { dealCompletionIso } from "../../lib/deal/deal-completion-iso";
import { DEAL_STATUS_META } from "../../lib/deal-status";
import { formatDateRu } from "../../lib/format/date-ru";
import { path } from "../../lib/constants/navigation";
import { color } from "../../theme/tokens";
import type { Deal, DealStatus } from "../../types/deal";
import type { Client } from "../../types/client";
import type { User } from "../../types/user";
import type { ReportPreset } from "./report-period";
import { applyPresetToFilters, type ReportFilterValues } from "./report-filters";
import {
  ColumnFilterDropdown,
  ColumnFilterField,
  ColumnFilterLabel,
  FilterDateInput,
  FilterSelect,
  OverdueStatus,
  StageStatusCell,
} from "./reports-pages.styled";

const PRESET_OPTS: { value: ReportPreset; label: string }[] = [
  { value: "week", label: "За неделю" },
  { value: "month", label: "За месяц" },
  { value: "quarter", label: "За квартал" },
  { value: "all", label: "Всё время" },
];

const ALL_MANAGERS = "";
const ALL_STAGES = "";

function formatAmountRub(amount: number) {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

function isDateFilterActive(filters: ReportFilterValues): boolean {
  return Boolean(filters.dateFrom || filters.dateTo || filters.preset !== "week");
}

function isManagerFilterActive(filters: ReportFilterValues): boolean {
  return Boolean(filters.managerId);
}

function isDealStageFilterActive(filters: ReportFilterValues): boolean {
  return Boolean(filters.dealStatus);
}

function reportFilterIcon(filtered: boolean) {
  return (
    <FilterFilled style={{ color: filtered ? color.accent.primary : color.neutral.textSecondary }} />
  );
}

type FilterDropdownArgs = {
  filters: ReportFilterValues;
  onFiltersChange: (filters: ReportFilterValues) => void;
  confirm: () => void;
  clearFilters?: () => void;
};

function DateFilterDropdown(props: FilterDropdownArgs) {
  const { filters, onFiltersChange, confirm, clearFilters } = props;

  return (
    <ColumnFilterDropdown>
      <ColumnFilterField>
        <ColumnFilterLabel>Период</ColumnFilterLabel>
        <FilterSelect
          value={filters.preset}
          onChange={(v) => onFiltersChange(applyPresetToFilters(filters, v as ReportPreset))}
          options={PRESET_OPTS}
          popupMatchSelectWidth={false}
        />
      </ColumnFilterField>
      <ColumnFilterField>
        <ColumnFilterLabel>Дата начала</ColumnFilterLabel>
        <FilterDateInput
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, dateFrom: e.target.value || undefined })
          }
        />
      </ColumnFilterField>
      <ColumnFilterField>
        <ColumnFilterLabel>Дата окончания</ColumnFilterLabel>
        <FilterDateInput
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value || undefined })}
        />
      </ColumnFilterField>
      <Space>
        <Button type="primary" size="small" onClick={() => confirm()}>
          Применить
        </Button>
        <Button
          size="small"
          onClick={() => {
            clearFilters?.();
            confirm();
          }}
        >
          Сбросить
        </Button>
      </Space>
    </ColumnFilterDropdown>
  );
}

function ManagerFilterDropdown(props: FilterDropdownArgs & { users: User[] }) {
  const { filters, onFiltersChange, confirm, clearFilters, users } = props;

  const options = [
    { value: ALL_MANAGERS, label: "Все менеджеры" },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <ColumnFilterDropdown>
      <ColumnFilterField>
        <ColumnFilterLabel>Менеджер</ColumnFilterLabel>
        <FilterSelect
          value={filters.managerId ?? ALL_MANAGERS}
          onChange={(v) =>
            onFiltersChange({
              ...filters,
              managerId: (v as string) || undefined,
            })
          }
          options={options}
          popupMatchSelectWidth={false}
        />
      </ColumnFilterField>
      <Space>
        <Button type="primary" size="small" onClick={() => confirm()}>
          Применить
        </Button>
        <Button
          size="small"
          onClick={() => {
            clearFilters?.();
            confirm();
          }}
        >
          Сбросить
        </Button>
      </Space>
    </ColumnFilterDropdown>
  );
}

function DealStageFilterDropdown(props: FilterDropdownArgs) {
  const { filters, onFiltersChange, confirm, clearFilters } = props;

  const options = [
    { value: ALL_STAGES, label: "Все этапы" },
    ...(Object.entries(DEAL_STATUS_META) as [DealStatus, { label: string }][]).map(
      ([value, meta]) => ({ value, label: meta.label }),
    ),
  ];

  return (
    <ColumnFilterDropdown>
      <ColumnFilterField>
        <ColumnFilterLabel>Этап сделки</ColumnFilterLabel>
        <FilterSelect
          value={filters.dealStatus ?? ALL_STAGES}
          onChange={(v) =>
            onFiltersChange({
              ...filters,
              dealStatus: (v as DealStatus) || undefined,
            })
          }
          options={options}
          popupMatchSelectWidth={false}
        />
      </ColumnFilterField>
      <Space>
        <Button type="primary" size="small" onClick={() => confirm()}>
          Применить
        </Button>
        <Button
          size="small"
          onClick={() => {
            clearFilters?.();
            confirm();
          }}
        >
          Сбросить
        </Button>
      </Space>
    </ColumnFilterDropdown>
  );
}

type ColumnFilterBinding<T> = {
  column: ColumnType<T>;
  filters: ReportFilterValues;
  onFiltersChange: (filters: ReportFilterValues) => void;
  users?: User[];
  onClearDate?: () => void;
  onClearManager?: () => void;
  onClearStage?: () => void;
};

function withDateColumnFilter<T>(props: ColumnFilterBinding<T>): ColumnType<T> {
  const { column, filters, onFiltersChange, onClearDate } = props;

  return {
    ...column,
    filteredValue: isDateFilterActive(filters) ? ["date"] : null,
    filterIcon: reportFilterIcon,
    filterDropdown: ({ confirm, clearFilters }) => (
      <DateFilterDropdown
        filters={filters}
        onFiltersChange={onFiltersChange}
        confirm={confirm}
        clearFilters={() => {
          onClearDate?.();
          clearFilters?.();
        }}
      />
    ),
  };
}

function withManagerColumnFilter<T>(
  props: ColumnFilterBinding<T> & { users: User[] },
): ColumnType<T> {
  const { column, filters, onFiltersChange, users, onClearManager } = props;

  return {
    ...column,
    filteredValue: isManagerFilterActive(filters) ? ["manager"] : null,
    filterIcon: reportFilterIcon,
    filterDropdown: ({ confirm, clearFilters }) => (
      <ManagerFilterDropdown
        filters={filters}
        onFiltersChange={onFiltersChange}
        users={users}
        confirm={confirm}
        clearFilters={() => {
          onClearManager?.();
          clearFilters?.();
        }}
      />
    ),
  };
}

function withDealStageColumnFilter<T>(props: ColumnFilterBinding<T>): ColumnType<T> {
  const { column, filters, onFiltersChange, onClearStage } = props;

  return {
    ...column,
    filteredValue: isDealStageFilterActive(filters) ? ["stage"] : null,
    filterIcon: reportFilterIcon,
    filterDropdown: ({ confirm, clearFilters }) => (
      <DealStageFilterDropdown
        filters={filters}
        onFiltersChange={onFiltersChange}
        confirm={confirm}
        clearFilters={() => {
          onClearStage?.();
          clearFilters?.();
        }}
      />
    ),
  };
}

function clearDateFilter(filters: ReportFilterValues): ReportFilterValues {
  return applyPresetToFilters(filters, "week");
}

function clearManagerFilter(filters: ReportFilterValues): ReportFilterValues {
  return { ...filters, managerId: undefined };
}

function clearStageFilter(filters: ReportFilterValues): ReportFilterValues {
  return { ...filters, dealStatus: undefined };
}

export function ReportMobileFilters(props: {
  filters: ReportFilterValues;
  onFiltersChange: (filters: ReportFilterValues) => void;
  users: User[];
}) {
  const { filters, onFiltersChange, users } = props;

  return (
    <ColumnFilterDropdown $inline>
      <DateFilterDropdown filters={filters} onFiltersChange={onFiltersChange} confirm={() => {}} />
      <ManagerFilterDropdown
        filters={filters}
        onFiltersChange={onFiltersChange}
        users={users}
        confirm={() => {}}
      />
      <DealStageFilterDropdown
        filters={filters}
        onFiltersChange={onFiltersChange}
        confirm={() => {}}
      />
    </ColumnFilterDropdown>
  );
}

type SalesRow = { key: string; deal: Deal; clientName: string };
type StagesRow = { key: string; status: DealStatus; count: number; sum: number };
type ClientReportRow = Client & { key: string };
type ActivityRow = {
  key: string;
  id: string;
  name: string;
  deals: number;
  completedTasks: number;
};
type OverdueRow = {
  key: string;
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
};

export function buildSalesColumns(
  filters: ReportFilterValues,
  onFiltersChange: (filters: ReportFilterValues) => void,
  users: User[],
): ColumnType<SalesRow>[] {
  return [
    {
      title: "ID сделки",
      key: "id",
      sorter: (a, b) => a.deal.id.localeCompare(b.deal.id),
      render: (_, row) => row.deal.id,
      ellipsis: true,
      width: 120,
    },
    withDealStageColumnFilter({
      column: {
        title: "Название",
        key: "title",
        sorter: (a, b) => a.deal.title.localeCompare(b.deal.title),
        render: (_, row) => row.deal.title,
      },
      filters,
      onFiltersChange,
      onClearStage: () => onFiltersChange(clearStageFilter(filters)),
    }),
    withManagerColumnFilter({
      column: {
        title: "Клиент",
        key: "clientName",
        sorter: (a, b) => a.clientName.localeCompare(b.clientName),
        render: (_, row) => row.clientName,
      },
      filters,
      onFiltersChange,
      users,
      onClearManager: () => onFiltersChange(clearManagerFilter(filters)),
    }),
    {
      title: "Сумма",
      key: "amount",
      sorter: (a, b) => a.deal.amount - b.deal.amount,
      render: (_, row) => formatAmountRub(row.deal.amount),
    },
    withDateColumnFilter({
      column: {
        title: "Дата завершения",
        key: "completed",
        sorter: (a, b) => dealCompletionIso(a.deal).localeCompare(dealCompletionIso(b.deal)),
        render: (_, row) => (row.deal.completedAt ? formatDateRu(row.deal.completedAt) : "—"),
      },
      filters,
      onFiltersChange,
      onClearDate: () => onFiltersChange(clearDateFilter(filters)),
    }),
  ];
}

export function buildStagesColumns(
  filters: ReportFilterValues,
  onFiltersChange: (filters: ReportFilterValues) => void,
  users: User[],
): ColumnType<StagesRow>[] {
  return [
    withDealStageColumnFilter({
      column: {
        title: "Этап сделки",
        key: "status",
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (_, row) => (
          <StageStatusCell $status={row.status}>
            {DEAL_STATUS_META[row.status]?.label ?? row.status}
          </StageStatusCell>
        ),
      },
      filters,
      onFiltersChange,
      onClearStage: () => onFiltersChange(clearStageFilter(filters)),
    }),
    withDateColumnFilter({
      column: {
        title: "Количество сделок на этапе",
        key: "count",
        sorter: (a, b) => a.count - b.count,
        render: (_, row) => row.count,
      },
      filters,
      onFiltersChange,
      onClearDate: () => onFiltersChange(clearDateFilter(filters)),
    }),
    withManagerColumnFilter({
      column: {
        title: "Общая сумма сделок на этапе",
        key: "sum",
        sorter: (a, b) => a.sum - b.sum,
        render: (_, row) => formatAmountRub(row.sum),
      },
      filters,
      onFiltersChange,
      users,
      onClearManager: () => onFiltersChange(clearManagerFilter(filters)),
    }),
  ];
}

export function buildNewClientsColumns(
  filters: ReportFilterValues,
  onFiltersChange: (filters: ReportFilterValues) => void,
  users: User[],
): ColumnType<ClientReportRow>[] {
  return [
    {
      title: "ID клиента",
      dataIndex: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
      ellipsis: true,
      width: 120,
    },
    withManagerColumnFilter({
      column: {
        title: "Имя клиента",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (_, row) => <Link to={`${path.clients}/${row.id}/edit`}>{row.name}</Link>,
      },
      filters,
      onFiltersChange,
      users,
      onClearManager: () => onFiltersChange(clearManagerFilter(filters)),
    }),
    withDealStageColumnFilter({
      column: {
        title: "Компания",
        key: "company",
        sorter: (a, b) => a.company.localeCompare(b.company),
        render: (_, row) => row.company,
      },
      filters,
      onFiltersChange,
      onClearStage: () => onFiltersChange(clearStageFilter(filters)),
    }),
    withDateColumnFilter({
      column: {
        title: "Дата добавления",
        key: "createdAt",
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
        render: (_, row) => formatDateRu(row.createdAt),
      },
      filters,
      onFiltersChange,
      onClearDate: () => onFiltersChange(clearDateFilter(filters)),
    }),
  ];
}

export function buildActivityColumns(
  filters: ReportFilterValues,
  onFiltersChange: (filters: ReportFilterValues) => void,
  users: User[],
): ColumnType<ActivityRow>[] {
  return [
    {
      title: "ID клиента",
      dataIndex: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    withManagerColumnFilter({
      column: {
        title: "Имя клиента",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (_, row) => row.name,
      },
      filters,
      onFiltersChange,
      users,
      onClearManager: () => onFiltersChange(clearManagerFilter(filters)),
    }),
    withDateColumnFilter({
      column: {
        title: "Количество сделок",
        key: "deals",
        sorter: (a, b) => a.deals - b.deals,
        render: (_, row) => row.deals,
      },
      filters,
      onFiltersChange,
      onClearDate: () => onFiltersChange(clearDateFilter(filters)),
    }),
    withDealStageColumnFilter({
      column: {
        title: "Завершённые задачи",
        key: "completedTasks",
        sorter: (a, b) => a.completedTasks - b.completedTasks,
        render: (_, row) => row.completedTasks,
      },
      filters,
      onFiltersChange,
      onClearStage: () => onFiltersChange(clearStageFilter(filters)),
    }),
  ];
}

export function buildOverdueColumns(
  filters: ReportFilterValues,
  onFiltersChange: (filters: ReportFilterValues) => void,
  users: User[],
): ColumnType<OverdueRow>[] {
  return [
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
    withManagerColumnFilter({
      column: {
        title: "Ответственный",
        key: "assignee",
        sorter: (a, b) => a.assignee.localeCompare(b.assignee),
        render: (_, row) => row.assignee,
      },
      filters,
      onFiltersChange,
      users,
      onClearManager: () => onFiltersChange(clearManagerFilter(filters)),
    }),
    withDealStageColumnFilter({
      column: {
        title: "Статус",
        key: "status",
        render: () => <OverdueStatus>Просрочена</OverdueStatus>,
      },
      filters,
      onFiltersChange,
      onClearStage: () => onFiltersChange(clearStageFilter(filters)),
    }),
    withDateColumnFilter({
      column: {
        title: "Дата срока выполнения",
        key: "dueDate",
        sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
        render: (_, row) => formatDateRu(row.dueDate),
      },
      filters,
      onFiltersChange,
      onClearDate: () => onFiltersChange(clearDateFilter(filters)),
    }),
  ];
}
