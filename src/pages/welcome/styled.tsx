import styled, { css } from "styled-components";
import { color, fontFamilies, grid, layout, typography } from "../../theme/tokens";

export const WelcomeRoot = styled.div`
  flex: 1;
  min-height: 100%;
  padding: 28px 4px 48px;
  margin-bottom: 20px;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    padding: 20px 0
      calc(${layout.mobileScrollPaddingBottomPx}px + env(safe-area-inset-bottom, 0px));
    margin-bottom: 0;
  }
`;

export const PageTitle = styled.h1`
  margin: 0 0 8px;
  font-family: ${fontFamilies.body};
  font-size: ${typography.heading.h2.fontSize};
  line-height: ${typography.heading.h2.lineHeight};
  font-weight: ${typography.heading.h2.fontWeight};
  color: ${color.neutral.textPrimary};
`;

export const PageSubtitle = styled.p`
  margin: 0 0 28px;
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  color: ${color.neutral.textSecondary};
`;

export const SectionTitle = styled.h2`
  margin: 32px 0 16px;
  font-family: ${fontFamilies.body};
  font-size: ${typography.heading.h3.fontSize};
  line-height: ${typography.heading.h3.lineHeight};
  font-weight: ${typography.heading.h3.fontWeight};
  color: ${color.neutral.textPrimary};

  &:first-of-type {
    margin-top: 0;
  }
`;

export const StatsCard = styled.div`
  background: ${color.background.secondary};
  border-radius: 12px;
  border: 1px solid ${color.background.shadowHint};
  overflow: hidden;
`;

export const StatsTable = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, 1.4fr) repeat(5, 1fr);
  width: 100%;

  @media (max-width: 900px) {
    display: block;
    overflow-x: auto;
  }
`;

export const StatsHeaderRow = styled.div`
  display: contents;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const StatsHeaderCell = styled.div`
  padding: 16px 20px 12px;
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  color: ${color.neutral.textSecondary};
  text-align: center;

  &:first-child {
    text-align: left;
  }
`;

export const StatsRow = styled.div`
  display: contents;

  @media (max-width: 900px) {
    display: block;
    padding: 16px 20px;
    border-top: 1px solid ${color.background.shadowHint};

    &:first-of-type {
      border-top: none;
    }
  }
`;

export const StatsLabelCell = styled.div`
  padding: 12px 20px;
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  color: ${color.neutral.textPrimary};
  border-top: 1px solid ${color.background.shadowHint};

  @media (max-width: 900px) {
    padding: 0 0 12px;
    border-top: none;
    font-weight: 600;
  }
`;

export const StatsValueCell = styled.div<{ $variant?: "primary" | "delta" }>`
  padding: 12px 20px;
  text-align: center;
  border-top: 1px solid ${color.background.shadowHint};
  font-size: ${(p) =>
    p.$variant === "primary" ? typography.heading.h2.fontSize : typography.body.sm.fontSize};
  line-height: ${(p) =>
    p.$variant === "primary" ? typography.heading.h2.lineHeight : typography.body.sm.lineHeight};
  font-weight: ${(p) => (p.$variant === "primary" ? 700 : 500)};
  color: ${(p) => (p.$variant === "primary" ? color.accent.primary : color.accent.success)};

  @media (max-width: 900px) {
    display: inline-block;
    padding: 4px 12px 4px 0;
    border-top: none;
    text-align: left;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ClientCard = styled.div`
  background: ${color.background.secondary};
  border: 1px solid ${color.background.shadowHint};
  border-radius: 12px;
  padding: 16px;
  min-height: 100px;
`;

export const ClientName = styled.div`
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  font-weight: 600;
  color: ${color.neutral.textPrimary};
  margin-bottom: 4px;
`;

export const ClientCompany = styled.div`
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  color: ${color.neutral.textSecondary};
  margin-bottom: 12px;
`;

export const ClientDealCount = styled.div`
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  color: ${color.neutral.textPrimary};

  span {
    color: ${color.accent.success};
    font-weight: 600;
  }
`;

export const DealsList = styled.div`
  background: ${color.background.secondary};
  border: 1px solid ${color.background.shadowHint};
  border-radius: 12px;
  overflow: hidden;
`;

export const DealRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr 1fr 1.2fr;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  border-top: 1px solid ${color.background.shadowHint};

  &:first-child {
    border-top: none;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

export const DealTitle = styled.div`
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  color: ${color.neutral.textPrimary};
`;

export const DealClient = styled.div`
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  color: ${color.neutral.textSecondary};
  text-align: center;

  @media (max-width: 900px) {
    text-align: left;
  }
`;

export const DealAmount = styled.div`
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  font-weight: 600;
  color: ${color.neutral.textPrimary};
  text-align: right;

  @media (max-width: 900px) {
    text-align: left;
  }
`;

export const DealStatus = styled.div<{
  $status: "new" | "in_progress" | "completed" | "cancelled";
}>`
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  text-align: right;
  color: ${(p) => {
    if (p.$status === "in_progress") return color.accent.primary;
    if (p.$status === "completed") return color.accent.success;
    return color.neutral.textSecondary;
  }};

  @media (max-width: 900px) {
    text-align: left;
  }
`;

export const DealDate = styled.div`
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  color: ${color.neutral.textSecondary};
  text-align: right;

  @media (max-width: 900px) {
    text-align: left;
  }
`;

export const TaskCard = styled.div<{ $completed?: boolean }>`
  background: ${(p) => (p.$completed ? color.background.success : color.background.secondary)};
  border: 1px solid ${color.background.shadowHint};
  border-radius: 12px;
  padding: 16px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
`;

export const TaskTitle = styled.div`
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  font-weight: 600;
  color: ${color.neutral.textPrimary};
  margin-bottom: 8px;
`;

export const TaskDealLabel = styled.div`
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  color: ${color.neutral.textSecondary};
  margin-bottom: 2px;
`;

export const TaskDealName = styled.div`
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  color: ${color.neutral.textSecondary};
  margin-bottom: auto;
`;

export const TaskFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  margin-top: 16px;
`;

export const TaskDueDate = styled.div`
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  color: ${color.neutral.textSecondary};
`;

export const TaskStatus = styled.div<{ $status: "new" | "in_progress" | "completed" }>`
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  font-weight: 500;
  color: ${(p) => {
    if (p.$status === "in_progress") return color.accent.primary;
    if (p.$status === "completed") return color.accent.success;
    return color.neutral.textSecondary;
  }};
`;

export const SectionAction = styled.div`
  margin-top: 16px;
  
`;

export const EmptyHint = styled.p`
  margin: 0;
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  color: ${color.neutral.textSecondary};
`;

export const DashboardTabs = styled.nav`
  display: none;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    margin: 0 0 20px;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const DashboardTab = styled.button<{ $active?: boolean }>`
  flex-shrink: 0;
  padding: 0 0 8px;
  border: none;
  background: none;
  cursor: pointer;
  font-family: ${fontFamilies.body};
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  color: ${(p) => (p.$active ? color.accent.primary : color.neutral.textSecondary)};
  border-bottom: 2px solid ${(p) => (p.$active ? color.accent.primary : "transparent")};
`;

export const MobileStatsStack = styled.div`
  display: none;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 8px;
  }
`;

export const MobileStatCard = styled.div`
  padding: 16px;
  background: ${color.background.secondary};
  border: 1px solid ${color.background.shadowHint};
  border-radius: 12px;
`;

export const MobileStatTitle = styled.div`
  margin-bottom: 12px;
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  font-weight: 600;
  color: ${color.neutral.textPrimary};
`;

export const MobileStatRow = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 16px;
`;

export const MobileStatMain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 72px;
`;

export const MobileStatValue = styled.div`
  font-size: ${typography.heading.h2.fontSize};
  line-height: ${typography.heading.h2.lineHeight};
  font-weight: 700;
  color: ${color.accent.primary};
`;

export const MobileStatCaption = styled.div`
  margin-top: 4px;
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  color: ${color.neutral.textSecondary};
`;

export const MobileStatDeltas = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  flex: 1;
  align-content: center;
`;

export const MobileStatDelta = styled.div`
  font-size: ${typography.body.xs.fontSize};
  line-height: ${typography.body.xs.lineHeight};
  color: ${color.accent.success};
  font-weight: 500;
`;

export const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: block;
  }
`;

export const DesktopOnly = styled.div`
  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: none;
  }
`;

export { StickyListAction as StickyMobileAction } from "../../components/list-page/mobile-list.styled";

const hideOnMobile = css`
  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: none;
  }
`;

export const SectionBlock = styled.section<{ $mobileHidden?: boolean }>`
  ${(p) => (p.$mobileHidden ? hideOnMobile : "")}
`;
