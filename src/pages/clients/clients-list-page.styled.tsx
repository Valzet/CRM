import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { UiInput } from "../../components/ui/input";
import { color, fontFamilies, typography } from "../../theme/tokens";

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

export const TableWrap = styled.div`
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

export const CellLink = styled.a`
  color: ${color.accent.primary};
  text-decoration: none;

  &:hover {
    color: ${color.accent.hover};
    text-decoration: underline;
  }
`;
