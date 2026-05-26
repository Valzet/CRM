import type { User } from "../../types/user";
import type { ReportFilterValues } from "./report-filters";
import {
  DateFilterDropdown,
  DealStageFilterDropdown,
  ManagerFilterDropdown,
} from "./report-table-column-filter-ui";
import { ColumnFilterDropdown } from "./reports-pages.styled";

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
