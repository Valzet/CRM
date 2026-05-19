import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { UiInput } from "../../components/ui/input";
import { color, fontFamilies, typography } from "../../theme/tokens";
import type { TaskStatus } from "../../types/task";

export const PageRoot = styled.div`
  flex: 1;
  min-height: 100%;
  margin: 0 -20px;
  padding: 28px 24px 48px;
  background: ${color.background.secondary};
`;

export const PageHeading = styled.h1`
  margin: 0 0 24px;
  font-family: ${fontFamilies.body};
  font-size: ${typography.heading.h2.fontSize};
  line-height: ${typography.heading.h2.lineHeight};
  font-weight: ${typography.heading.h2.fontWeight};
  color: ${color.neutral.textPrimary};
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

export const SearchField = styled(UiInput)`
  flex: 1;
  min-width: 0;
`;

export const SearchIcon = styled(SearchOutlined)`
  color: ${color.neutral.textSecondary};
  font-size: 16px;
`;

export function taskRowClassName(index: number): string {
  return index % 2 === 0 ? "row-task row-task--even" : "row-task row-task--odd";
}

export const TableWrap = styled.div`
  .ant-table-wrapper {
    padding: 4px 0 8px;
    filter: drop-shadow(0 2px 8px rgba(15, 23, 42, 0.06));

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

    .ant-table-tbody > tr.row-task > td:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    .ant-table-tbody > tr.row-task > td:last-child {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .ant-table-tbody > tr.row-task--even > td {
      background: ${color.background.secondary};
    }

    .ant-table-tbody > tr.row-task--odd > td {
      background: ${color.background.info};
    }

    .ant-table-tbody > tr.row-task:hover > td {
      filter: brightness(0.98);
    }
  }
`;

export const TaskTitleCell = styled.span`
  font-weight: 600;
  color: ${color.neutral.textPrimary};
`;

const statusColor: Record<TaskStatus, string> = {
  new: color.neutral.textSecondary,
  in_progress: color.accent.primary,
  completed: color.accent.success,
};

export const StatusCell = styled.span<{ $status: TaskStatus }>`
  font-weight: 500;
  color: ${(p) => statusColor[p.$status]};
`;
