import { Tabs } from "antd";
import styled from "styled-components";
import { color, typography } from "../../theme/tokens";

export const ReportsTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 28px;

    &::before {
      border-bottom-color: ${color.background.shadowHint};
    }
  }

  .ant-tabs-tab {
    padding: 12px 0;
    margin: 0 28px 0 0;
    font-size: ${typography.body.sm.fontSize};
    line-height: ${typography.body.sm.lineHeight};

    &:hover {
      color: ${color.accent.hover};
    }
  }

  .ant-tabs-tab-btn {
    color: ${color.neutral.textSecondary};
    font-weight: 500;
  }

  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${color.accent.primary};
  }

  .ant-tabs-ink-bar {
    height: 2px;
    background: ${color.accent.primary};
  }
`;

export const TabPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;
