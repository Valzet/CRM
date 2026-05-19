import {
  BarChartOutlined,
  CheckSquareOutlined,
  HomeOutlined,
  ProjectOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import logoImg from "../../assets/logo/Logo2.png";
import collapseIcon from "../../assets/icons/24x24/Sidebar_collapse.svg";
import expandIcon from "../../assets/icons/24x24/Sidebar_expand.svg";
import { useAppSelector } from "../../hooks";
import { path } from "../../lib/constants/navigation";
import { selectAuthUserId } from "../../store/auth-slice";
import { useGetUserByIdQuery } from "../../store/api";
import { color, layout, typography } from "../../theme/tokens";
import { useSidebar } from "./sidebar-context";

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
  min-width: 0;
  flex: 1;
  text-decoration: none;
  color: inherit;
`;

const BrandLogo = styled.img`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  object-fit: contain;
`;

const BrandName = styled.span<{ $hidden: boolean }>`
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
  white-space: nowrap;
  opacity: ${(p) => (p.$hidden ? 0 : 1)};
  width: ${(p) => (p.$hidden ? 0 : "auto")};
  overflow: hidden;
  transition: opacity 0.15s ease;
`;

const CollapseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid ${color.neutral.border};
  border-radius: 6px;
  background: ${color.background.secondary};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease;

  &:hover {
    background: ${layout.navItemMutedBg};
  }

  img {
    display: block;
    width: 20px;
    height: 20px;
  }
`;

const NavBlock = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
`;

const itemStyles = css<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: ${layout.sidebarItemHeightPx}px;
  padding: ${(p) => (p.$collapsed ? "0 0 0 0" : "0 16px")};
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
`;

const Item = styled(NavLink)<{ $collapsed: boolean }>`
  ${itemStyles}
`;

const ItemLabel = styled.span<{ $hidden: boolean }>`
  white-space: nowrap;
  opacity: ${(p) => (p.$hidden ? 0 : 1)};
  width: ${(p) => (p.$hidden ? 0 : "auto")};
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

type MainSidebarProps = {
  onNavigate?: () => void;
  /** В мобильном Drawer всегда показываем полное меню. */
  forceExpanded?: boolean;
};

/** Светлый сайдбар YaPlex: сворачивается по кнопке, на мобиле — в Drawer. */
export function MainSidebar({ onNavigate, forceExpanded }: MainSidebarProps) {
  const { collapsed: collapsedState, toggleCollapsed } = useSidebar();
  const collapsed = forceExpanded ? false : collapsedState;
  const userId = useAppSelector(selectAuthUserId);
  const { data: me } = useGetUserByIdQuery(userId ?? "", { skip: !userId });
  const displayName = me?.username?.trim() || me?.name?.split(/\s+/)[0] || "Пользователь";
  const { pathname } = useLocation();
  const reportsActive = pathname.startsWith("/reports");

  const navItems = [
    { to: path.welcome, end: true, icon: <HomeOutlined aria-hidden />, label: "Главная" },
    { to: path.clients, icon: <TeamOutlined aria-hidden />, label: "Клиенты" },
    { to: path.deals, icon: <ProjectOutlined aria-hidden />, label: "Сделки" },
    {
      to: path.reports.sales,
      end: true,
      icon: <BarChartOutlined aria-hidden />,
      label: "Отчёты",
      dataActive: reportsActive,
    },
    { to: path.tasks, icon: <CheckSquareOutlined aria-hidden />, label: "Задачи" },
  ] as const;

  return (
    <Shell $collapsed={collapsed} aria-label="Навигация">
      <BrandRow $collapsed={collapsed}>
        <BrandLink to={path.welcome} end onClick={onNavigate}>
          <BrandLogo src={logoImg} alt="" decoding="async" />
          <BrandName $hidden={collapsed}>YaPlex</BrandName>
        </BrandLink>
        {!collapsed && !forceExpanded ? (
          <CollapseBtn
            type="button"
            onClick={toggleCollapsed}
            aria-label="Свернуть меню"
            title="Свернуть меню"
          >
            <img src={collapseIcon} alt="" />
          </CollapseBtn>
        ) : null}
      </BrandRow>

      {collapsed && !forceExpanded ? (
        <BrandRow $collapsed style={{ paddingTop: 0, minHeight: "auto" }}>
          <CollapseBtn
            type="button"
            onClick={toggleCollapsed}
            aria-label="Развернуть меню"
            title="Развернуть меню"
            style={{ margin: "0 auto" }}
          >
            <img src={expandIcon} alt="" />
          </CollapseBtn>
        </BrandRow>
      ) : null}

      <NavBlock>
        {navItems.map((item) => (
          <Item
            key={item.to}
            to={item.to}
            end={"end" in item ? item.end : undefined}
            $collapsed={collapsed}
            data-active={"dataActive" in item && item.dataActive ? "true" : undefined}
            onClick={onNavigate}
          >
            {item.icon}
            <ItemLabel $hidden={collapsed}>{item.label}</ItemLabel>
          </Item>
        ))}
      </NavBlock>

      <Footer $collapsed={collapsed}>
        <UserRow to={path.settings} $collapsed={collapsed} onClick={onNavigate}>
          <Avatar size={36} style={{ backgroundColor: color.accent.primary, flexShrink: 0 }}>
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <UserName $hidden={collapsed}>{displayName}</UserName>
        </UserRow>
      </Footer>
    </Shell>
  );
}
