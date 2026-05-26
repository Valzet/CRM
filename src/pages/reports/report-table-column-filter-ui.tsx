import { Button, Space } from "antd";
import { DEAL_STATUS_META } from "../../lib/deal-status";
import type { DealStatus } from "../../types/deal";
import type { User } from "../../types/user";
import type { ReportPreset } from "./report-period";
import { applyPresetToFilters, type ReportFilterValues } from "./report-filters";
import {
  ColumnFilterDropdown,
  ColumnFilterField,
  ColumnFilterLabel,
  FilterDateInput,
  FilterSelect,
} from "./reports-pages.styled";

const PRESET_OPTS: { value: ReportPreset; label: string }[] = [
  { value: "week", label: "За неделю" },
  { value: "month", label: "За месяц" },
  { value: "quarter", label: "За квартал" },
  { value: "all", label: "Всё время" },
];

const ALL_MANAGERS = "";
const ALL_STAGES = "";

type FilterDropdownArgs = {
  filters: ReportFilterValues;
  onFiltersChange: (filters: ReportFilterValues) => void;
  confirm: () => void;
  clearFilters?: () => void;
};

export function DateFilterDropdown(props: FilterDropdownArgs) {
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

export function ManagerFilterDropdown(props: FilterDropdownArgs & { users: User[] }) {
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

export function DealStageFilterDropdown(props: FilterDropdownArgs) {
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
