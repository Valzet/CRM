import styled from "styled-components";
import { MobileCardList } from "../../components/list-page/mobile-list.styled";
import { color, typography } from "../../theme/tokens";
import type { DealStatus } from "../../types/deal";

export { MobileCardList };

const statusRowBg: Record<DealStatus, string> = {
  new: color.background.primary,
  in_progress: color.background.info,
  completed: color.background.success,
  cancelled: color.background.warning,
};

export const MobileReportCard = styled.div<{ $overdue?: boolean }>`
  padding: 16px;
  background: ${(p) => (p.$overdue ? color.background.error : color.background.secondary)};
  border: 1px solid ${color.background.shadowHint};
  border-radius: 12px;

  a {
    color: ${color.accent.primary};
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const MobileStageCard = styled.div<{ $status: DealStatus }>`
  padding: 16px;
  background: ${(p) => statusRowBg[p.$status]};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MobileReportCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

export const MobileReportCardRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const MobileReportId = styled.div`
  font-size: ${typography.body.sm.fontSize};
  font-weight: 600;
  color: ${color.neutral.textPrimary};
`;

export const MobileReportCardTitle = styled.div`
  font-size: ${typography.body.base.fontSize};
  line-height: ${typography.body.base.lineHeight};
  font-weight: 600;
  color: ${color.neutral.textPrimary};
  margin-bottom: 4px;
`;

export const MobileReportAmount = styled.div`
  font-size: ${typography.body.base.fontSize};
  line-height: ${typography.body.base.lineHeight};
  font-weight: 600;
  color: ${color.neutral.textPrimary};
`;

export const MobileReportCardMeta = styled.div`
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  color: ${color.neutral.textSecondary};

  strong {
    color: ${color.neutral.textPrimary};
    font-weight: 600;
  }
`;

export const MobileReportCardNote = styled.div`
  font-size: ${typography.body.base.fontSize};
  line-height: ${typography.body.base.lineHeight};
  color: ${color.neutral.textPrimary};
  margin-bottom: 2px;
`;

export const MobileReportCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

export const MobileReportCardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
`;

export const MobileReportStatus = styled.span`
  font-size: ${typography.body.sm.fontSize};
  font-weight: 500;
  color: ${color.accent.error};
  flex-shrink: 0;
`;
