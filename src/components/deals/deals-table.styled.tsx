import styled, { css } from "styled-components";
import { color, typography } from "../../theme/tokens";
import type { DealStatus } from "../../types/deal";

const statusRowBg: Record<DealStatus, string> = {
  new: color.background.primary,
  in_progress: color.background.secondary,
  completed: color.background.success,
  cancelled: color.background.warning,
};

export function dealRowClassName(status: DealStatus): string {
  return `row-deal row-deal--${status}`;
}

export const DealsTableWrap = styled.div`
  .ant-table-wrapper {
    .ant-table {
      background: transparent;
    }

    .ant-table-container {
      border-inline-start: none;
      border-top: none;
    }

    .ant-table table {
      border-collapse: separate;
      border-spacing: 0 6px;
    }

    .ant-table-thead > tr > th {
      background: transparent;
      font-weight: 500;
      font-size: ${typography.body.sm.fontSize};
      color: ${color.neutral.textSecondary};
      border-bottom: none;
      padding: 0 16px 8px;

      &::before {
        display: none;
      }
    }

    .ant-table-tbody > tr > td {
      font-size: ${typography.body.sm.fontSize};
      border-bottom: none;
      padding: 14px 16px;
      transition: filter 0.15s ease;
    }

    .ant-table-tbody > tr.row-deal > td:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    .ant-table-tbody > tr.row-deal > td:last-child {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    ${(Object.entries(statusRowBg) as [DealStatus, string][]).map(
      ([status, bg]) => css`
        .ant-table-tbody > tr.row-deal--${status} > td {
          background: ${bg};
        }
      `,
    )}

    .ant-table-tbody > tr.row-deal:hover > td {
      filter: brightness(0.98);
    }
  }
`;

export const DealTitleCell = styled.span`
  font-weight: 600;
  color: ${color.neutral.textPrimary};
`;

export const DealStatusCell = styled.span<{ $status: DealStatus }>`
  font-weight: 500;
  color: ${(p) => {
    if (p.$status === "in_progress") return color.accent.primary;
    if (p.$status === "completed") return color.accent.success;
    if (p.$status === "cancelled") return color.accent.warning;
    return color.neutral.textPrimary;
  }};
`;
