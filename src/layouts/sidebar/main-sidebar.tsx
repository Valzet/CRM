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
import { mainNavItems } from "./nav-items";
import {
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
} from "./styled";

type MainSidebarProps = {
  onNavigate?: () => void;
};


export function MainSidebar({ onNavigate }: MainSidebarProps) {
  const { collapsed, toggleCollapsed } = useSidebar();
  const userId = useAppSelector(selectAuthUserId);
  const { data: me } = useGetUserByIdQuery(userId ?? "", { skip: !userId });
  const displayName = me?.username?.trim() || me?.name?.split(/\s+/)[0] || "Пользователь";
  const { pathname } = useLocation();

  return (
    <Shell $collapsed={collapsed} aria-label="Навигация">
      {!collapsed ? (
        <BrandRow $collapsed={collapsed}>
          <BrandLink to={path.welcome} end onClick={onNavigate}>
            <BrandLogo src={logoImg} alt="" decoding="async" />
          </BrandLink>
          <CollapseBtn
            type="button"
            onClick={toggleCollapsed}
            aria-label="Свернуть меню"
            title="Свернуть меню"
          >
            <img src={collapseIcon} alt="" />
          </CollapseBtn>
        </BrandRow>
      ) : null}
      {collapsed ? (
        <CollapseRow>
          <CollapseBtn
            type="button"
            onClick={toggleCollapsed}
            aria-label="Развернуть меню"
            title="Развернуть меню"
          >
            <img src={expandIcon} alt="" />
          </CollapseBtn>
        </CollapseRow>
      ) : null}

      <NavBlock>
        {mainNavItems.map((item) => {
          const isActive = item.matchPrefix ? pathname.startsWith(item.matchPrefix) : false;
          return (
            <Item
              key={item.to}
              to={item.to}
              end={item.end}
              $collapsed={collapsed}
              data-active={isActive ? "true" : undefined}
              onClick={onNavigate}
            >
              <img src={item.iconSrc} alt="" aria-hidden />
              <ItemLabel $hidden={collapsed}>{item.label}</ItemLabel>
            </Item>
          );
        })}
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
