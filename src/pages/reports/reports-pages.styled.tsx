import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Select } from "antd";
import styled, { css } from "styled-components";
import { UiButton } from "../../components/ui/button";
import { color, fontFamilies, grid, typography } from "../../theme/tokens";
import type { DealStatus } from "../../types/deal";

export const ReportSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    gap: 12px;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${fontFamilies.body};
  font-size: ${typography.heading.h3.fontSize};
  line-height: ${typography.heading.h3.lineHeight};
  font-weight: ${typography.heading.h3.fontWeight};
  color: ${color.neutral.textPrimary};
`;

export const SectionToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const ToolbarFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
`;

export const FilterSelect = styled(Select)`
  min-width: 160px;

  .ant-select-selector {
    border-radius: ${typography.controlBorderRadiusPx}px !important;
    border-color: ${color.neutral.border} !important;
    font-size: ${typography.body.sm.fontSize};
  }

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    min-width: 0;
    width: 100%;
  }
` as typeof Select;

export const FilterDateInput = styled.input`
  min-width: 140px;
  height: 32px;
  padding: 0 11px;
  border: 1px solid ${color.neutral.border};
  border-radius: ${typography.controlBorderRadiusPx}px;
  background: ${color.background.secondary};
  font-family: ${fontFamilies.body};
  font-size: ${typography.body.sm.fontSize};
  color: ${color.neutral.textPrimary};

  &:focus {
    outline: none;
    border-color: ${color.accent.primary};
  }

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    min-width: 0;
    width: 100%;
  }
`;

export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;

    .ant-btn {
      width: 100%;
    }
  }
`;

export const ExportButton = styled(UiButton)`
  &.ant-btn-default {
    border-color: ${color.neutral.border};
    color: ${color.neutral.textPrimary};
    font-size: ${typography.body.sm.fontSize};
    box-shadow: none;
  }
`;

export const ColumnFilterDropdown = styled.div<{ $inline?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  min-width: ${(p) => (p.$inline ? "auto" : "220px")};

  ${(p) =>
    p.$inline &&
    css`
      flex-direction: row;
      flex-wrap: wrap;
      padding: 0;
      margin-bottom: 12px;
    `}
`;

export const ColumnFilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ColumnFilterLabel = styled.span`
  font-size: ${typography.body.sm.fontSize};
  color: ${color.neutral.textSecondary};
`;

export const TableWrap = styled.div`
  .ant-table-wrapper {
    .ant-table {
      background: ${color.background.secondary};
      border: 1px solid ${color.background.shadowHint};
      border-radius: 10px;
      overflow: hidden;
    }

    .ant-table-container {
      border-inline-start: none;
      border-top: none;
    }

    .ant-table-thead > tr > th {
      background: ${color.background.secondary};
      font-weight: 500;
      font-size: ${typography.body.sm.fontSize};
      color: ${color.neutral.textSecondary};
      border-bottom: 1px solid ${color.background.shadowHint};

      &::before {
        display: none;
      }
    }

    .ant-table-tbody > tr > td {
      font-size: ${typography.body.sm.fontSize};
      border-bottom: 1px solid ${color.background.shadowHint};
    }

    .ant-table-tbody > tr:last-child > td {
      border-bottom: none;
    }

    .ant-table-tbody > tr:hover > td {
      background: ${color.background.primary} !important;
    }
  }
`;

const statusRowBg: Record<DealStatus, string> = {
  new: color.background.primary,
  in_progress: color.background.info,
  completed: color.background.success,
  cancelled: color.background.warning,
};

export function dealStageRowClassName(status: DealStatus): string {
  return `row-deal-stage row-deal-stage--${status}`;
}

export const StagesTableWrap = styled(TableWrap)`
  .ant-table-wrapper {
    .ant-table {
      background: transparent;
      border: none;
    }

    .ant-table table {
      border-collapse: separate;
      border-spacing: 0 6px;
    }

    .ant-table-thead > tr > th {
      background: transparent;
      border-bottom: none;
      padding: 0 16px 8px;
    }

    .ant-table-tbody > tr > td {
      border-bottom: none;
      padding: 14px 16px;
    }

    .ant-table-tbody > tr.row-deal-stage > td:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    .ant-table-tbody > tr.row-deal-stage > td:last-child {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    ${(Object.entries(statusRowBg) as [DealStatus, string][]).map(
      ([status, bg]) => css`
        .ant-table-tbody > tr.row-deal-stage--${status} > td {
          background: ${bg};
        }
      `,
    )}

    .ant-table-tbody > tr.row-deal-stage:hover > td {
      filter: brightness(0.98);
    }
  }
`;

export const StageStatusCell = styled.span<{ $status: DealStatus }>`
  font-weight: 500;
  color: ${(p) => {
    if (p.$status === "in_progress") return color.accent.primary;
    if (p.$status === "cancelled") return color.accent.warning;
    return color.neutral.textPrimary;
  }};
`;

export const OverdueTableWrap = styled(TableWrap)`
  .ant-table-tbody > tr.row-overdue > td {
    background: ${color.background.error};
  }

  .ant-table-tbody > tr.row-overdue:hover > td {
    background: ${color.background.error} !important;
    filter: brightness(0.98);
  }
`;

export const OverdueStatus = styled.span`
  font-weight: 500;
  color: ${color.accent.error};
`;

export const PaginationBar = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const pageControlBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid ${color.neutral.border};
  border-radius: ${typography.controlBorderRadiusPx}px;
  background: ${color.background.secondary};
  color: ${color.neutral.textSecondary};
  font-size: ${typography.body.sm.fontSize};
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background 0.15s ease;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    border-color: ${color.accent.primary};
    color: ${color.accent.primary};
  }
`;

export const PageArrow = styled.button`
  ${pageControlBase}
`;

export const PageNumber = styled.button<{ $active?: boolean }>`
  ${pageControlBase}
  font-weight: 500;
  border-color: ${(p) => (p.$active ? color.accent.primary : color.neutral.border)};
  background: ${(p) => (p.$active ? color.accent.primary : color.background.secondary)};
  color: ${(p) => (p.$active ? color.background.secondary : color.neutral.textPrimary)};

  &:not(:disabled):hover {
    border-color: ${color.accent.primary};
    background: ${(p) => (p.$active ? color.accent.hover : color.background.secondary)};
    color: ${(p) => (p.$active ? color.background.secondary : color.accent.primary)};
  }
`;

export const ArrowIconLeft = styled(LeftOutlined)`
  font-size: 12px;
`;

export const ArrowIconRight = styled(RightOutlined)`
  font-size: 12px;
`;
