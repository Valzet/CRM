import styled from "styled-components";
import { color, cssMobileStickyFooterClearance, grid, typography } from "../../theme/tokens";
import { CellLink } from "./list-page-layout.styled";

export const MobileCardList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MobileCard = styled.li<{ $deleted?: boolean }>`
  padding: 16px;
  background: ${color.background.secondary};
  border: 1px solid ${color.background.shadowHint};
  border-radius: 12px;
  cursor: pointer;
  opacity: ${(p) => (p.$deleted ? 0.65 : 1)};

  &:active {
    background: ${color.background.primary};
  }
`;

export const MobileCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const MobileCardTitle = styled.div`
  font-size: ${typography.body.base.fontSize};
  line-height: ${typography.body.base.lineHeight};
  font-weight: 600;
  color: ${color.neutral.textPrimary};
`;

export const MobileCardDate = styled.div`
  flex-shrink: 0;
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  color: ${color.neutral.textSecondary};
  text-align: right;
`;

export const MobileCardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  margin-bottom: 12px;
`;

export const MobileCardMeta = styled.div`
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  color: ${color.neutral.textSecondary};
  word-break: break-word;
`;

export const MobileCardLink = styled(CellLink)`
  display: inline-block;
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
`;

export const MobileCardNote = styled.p`
  margin: 0;
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  color: ${color.neutral.textSecondary};
`;

/** Резервирует место в потоке документа под фиксированную нижнюю панель. */
export const StickyFooterSpacer = styled.div`
  display: none;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: block;
    flex-shrink: 0;
    height: ${cssMobileStickyFooterClearance};
  }
`;

export const StickyListAction = styled.div`
  display: none;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    padding: 12px ${grid.mobile.marginPx}px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
    background: ${color.background.secondary};
    border-top: 1px solid ${color.background.shadowHint};
    box-shadow: 0 -4px 12px rgba(15, 23, 42, 0.06);

    .ant-btn {
      height: 48px;
      font-weight: 600;
    }
  }
`;

export const MobileEmpty = styled.p`
  margin: 0;
  padding: 24px 0;
  text-align: center;
  font-size: ${typography.body.sm.fontSize};
  color: ${color.neutral.textSecondary};
`;
