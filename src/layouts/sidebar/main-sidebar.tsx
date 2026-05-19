import {
  BarChartOutlined,
  CheckSquareOutlined,
  HomeOutlined,
  ProjectOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import { useLocation } from "react-router-dom";
import logoImg from "../../assets/logo/Logo4.png";
import collapseIcon from "../../assets/icons/24x24/Sidebar_collapse.svg";
import expandIcon from "../../assets/icons/24x24/Sidebar_expand.svg";
import { useAppSelector } from "../../hooks";
import { path } from "../../lib/constants/navigation";
import { selectAuthUserId } from "../../store/auth-slice";
import { useGetUserByIdQuery } from "../../store/api";
import { color } from "../../theme/tokens";
import { useSidebar } from "./sidebar-context";
import {
  BrandRow,
  BrandLink,
  BrandLogo,
  CollapseBtn,
  NavBlock,
  Item,
  ItemLabel,
  Footer,
  UserRow,
  UserName,
  Shell,
} from "./styled";

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
          {!collapsed ? <BrandLogo src={logoImg} alt="" decoding="async" /> : null}
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
        // <BrandRow $collapsed style={{ paddingTop: 0, minHeight: "auto" }}>
        <CollapseBtn
          type="button"
          onClick={toggleCollapsed}
          aria-label="Развернуть меню"
          title="Развернуть меню"
          style={{ margin: "0 auto" }}
        >
          <img src={expandIcon} alt="" />
        </CollapseBtn>
      ) : // </BrandRow>
      null}

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
