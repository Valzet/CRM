import { Tabs } from 'antd'
import styled from 'styled-components'
import { color, fontFamilies, typography } from '../../theme/tokens'

export const PageRoot = styled.div`
  flex: 1;
  min-height: 100%;
  margin: 0 -20px;
  padding: 28px 24px 48px;
  background: ${color.background.secondary};
`

export const PageHeading = styled.h1`
  margin: 0 0 20px;
  font-family: ${fontFamilies.body};
  font-size: ${typography.heading.h2.fontSize};
  line-height: ${typography.heading.h2.lineHeight};
  font-weight: ${typography.heading.h2.fontWeight};
  color: ${color.neutral.textPrimary};
`

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
`

export const TabPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`
