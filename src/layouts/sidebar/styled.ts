import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

import { color, layout, typography } from "../../theme/tokens";

const Shell = styled.aside<{ $collapsed: boolean }>`
  width: ${(p) =>
    p.$collapsed ? `${layout.sidebarCollapsedPx}px` : `${layout.sidebarExpandedPx}px`};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: ${color.background.secondary};
  color: ${color.neutral.textPrimary};
  border-right: 1px solid ${color.background.shadowHint};
  transition: width 0.2s ease;
  overflow: hidden;
`;

const BrandRow = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${(p) => (p.$collapsed ? "16px 12px" : "16px 14px 12px")};
  min-height: 56px;
  flex-shrink: 0;
`;

const BrandLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 50%;
  flex: 1;
  text-decoration: none;
  color: inherit;
  min-height: 24px;
`;

const BrandLogo = styled.img`
  width: 100px;
  height: 32px;
  flex-shrink: 0;
  object-fit: contain;
`;

const CollapseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: ${color.background.secondary};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease;

  &:hover {
    background: ${layout.navItemMutedBg};
  }

  img {
    display: block;
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;

const NavBlock = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
`;

const CollapseRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${layout.sidebarItemHeightPx}px;
  flex-shrink: 0;
  border-bottom: 1px solid ${color.background.shadowHint};
`;

const itemStyles = css<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => (p.$collapsed ? "0" : "12px")};
  min-height: ${layout.sidebarItemHeightPx}px;
  padding: ${(p) => (p.$collapsed ? "0" : "0 16px")};
  justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
  color: ${color.neutral.textPrimary};
  text-decoration: none;
  font-size: ${typography.body.sm.fontSize};
  line-height: ${typography.body.sm.lineHeight};
  border-bottom: 1px solid ${color.background.shadowHint};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    color: ${color.neutral.textHover};
    background: ${layout.navItemMutedBg};
  }

  &[aria-current="page"],
  &[data-active="true"] {
    color: ${color.accent.primary};
    background: ${color.background.info};
    font-weight: 500;
  }

  .anticon {
    font-size: 20px;
    flex-shrink: 0;
  }

  img {
    display: block;
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
  }
`;

const Item = styled(NavLink)<{ $collapsed: boolean }>`
  ${itemStyles}
`;

const ItemLabel = styled.span<{ $hidden: boolean }>`
  white-space: nowrap;
  display: ${(p) => (p.$hidden ? "none" : "inline")};
  overflow: hidden;
  pointer-events: ${(p) => (p.$hidden ? "none" : "auto")};
`;

const Footer = styled.div<{ $collapsed: boolean }>`
  padding: ${(p) => (p.$collapsed ? "12px 8px 16px" : "12px 16px 20px")};
  border-top: 1px solid ${color.background.shadowHint};
  flex-shrink: 0;
`;

const UserRow = styled(NavLink)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${(p) => (p.$collapsed ? "6px" : "6px 4px")};
  justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: ${layout.navItemMutedBg};
  }

  &[aria-current="page"] {
    background: ${color.background.info};
  }
`;

const UserName = styled.span<{ $hidden: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${color.accent.primary};
  font-size: ${typography.body.sm.fontSize};
  font-weight: 500;
  opacity: ${(p) => (p.$hidden ? 0 : 1)};
  width: ${(p) => (p.$hidden ? 0 : "auto")};
`;


export {
  BrandRow,
  BrandLink,
  BrandLogo,
  CollapseBtn,
  CollapseRow,
  NavBlock,
  Item,
  ItemLabel,
  Footer,
  UserRow,
  UserName,
  Shell,
};