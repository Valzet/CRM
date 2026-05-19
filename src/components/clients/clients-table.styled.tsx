import styled from "styled-components";
import { color, typography } from "../../theme/tokens";

export const ClientsTableWrap = styled.div`
  .ant-table-wrapper {
    .ant-table {
      background: transparent;
    }

    .ant-table-container {
      border-inline-start: none;
      border-top: none;
    }

    .ant-table-thead > tr > th {
      background: ${color.background.primary};
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

    .ant-table-tbody > tr:not(.row-deleted):hover > td {
      background: ${color.background.error} !important;
    }

    .ant-table-tbody > tr.row-deleted > td {
      background: ${color.background.error};
      color: ${color.neutral.disabled};
    }

    .ant-table-tbody > tr.row-deleted a {
      color: ${color.neutral.disabled};
    }
  }
`;
