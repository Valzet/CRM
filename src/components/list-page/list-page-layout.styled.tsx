import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { UiInput } from "../ui/input";
import { color, fontFamilies, grid, layout, typography } from "../../theme/tokens";

export const PageRoot = styled.div<{ $mobileStickyFooter?: boolean }>`
  flex: 1;
  min-height: 100%;
  margin: 0 -20px;
  padding: 28px 24px 48px;
  background: ${color.background.secondary};

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    margin: 0;
    padding: 16px 0
      ${(p) =>
        p.$mobileStickyFooter
          ? `calc(${layout.mobileScrollPaddingBottomPx}px + env(safe-area-inset-bottom, 0px))`
          : "32px"};
  }
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

  @media (max-width: ${grid.breakpoints.mobileMax}) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

export const ToolbarCreate = styled.div`
  @media (max-width: ${grid.breakpoints.mobileMax}) {
    display: none;
  }
`;

export const SearchField = styled(UiInput)`
  flex: 1;
  min-width: 0;
`;

export const SearchIcon = styled(SearchOutlined)`
  color: ${color.neutral.textSecondary};
  font-size: 16px;
`;

export const CellLink = styled.a`
  color: ${color.accent.primary};
  text-decoration: none;

  &:hover {
    color: ${color.accent.hover};
    text-decoration: underline;
  }
`;
