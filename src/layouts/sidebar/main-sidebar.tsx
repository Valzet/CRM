import {
  BarChartOutlined,
  CheckSquareOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProjectOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { Avatar } from "antd";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "../../hooks";

import { path } from "../../lib/constants/navigation";

import { clearAuth, selectAuthUserId } from "../../store/auth-slice";

import { useGetUserByIdQuery } from "../../store/api";

const Shell = styled.aside`
  width: 248px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: #e2e8f0;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 16px;
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: #f8fafc;
`;

const Logo = styled.span`
  display: inline-flex;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(145deg, #3b82f6 0%, #2563eb 100%);
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
`;

const NavBlock = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  flex: 1;
  overflow-y: auto;
`;

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  line-height: 20px;
  transition:
    background 0.15s ease,
    color 0.15s ease;
  &:hover {
    color: #f1f5f9;
    background: rgba(255, 255, 255, 0.06);
  }

  &[aria-current="page"],
  &[data-active="true"] {
    color: #ffffff;
    background: rgba(59, 130, 246, 0.28);
    font-weight: 500;
  }

  .anticon {
    font-size: 18px;
  }
`;

const Footer = styled.div`
  padding: 16px 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const UserRow = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: #e2e8f0;
  font-size: 13px;
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }
  &[aria-current="page"] {
    background: rgba(59, 130, 246, 0.2);
  }
`;

const UserName = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/** Сайдбар в стиле макетов YaPlex: тёмная колонка, иконки, блок пользователя. */

export function MainSidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = useAppSelector(selectAuthUserId);
  const { data: me } = useGetUserByIdQuery(userId ?? "", { skip: !userId });
  const displayName = me?.name ?? "Пользователь";
  const { pathname } = useLocation();
  const reportsActive = pathname.startsWith("/reports");

  const onLogoutClick = () => {
    dispatch(clearAuth());
    navigate(path.login, { replace: true });
  };

  return (
    <Shell>
      <Brand>
        <Logo aria-hidden>Я</Logo>
        YaPlex
      </Brand>

      <NavBlock>
        <Item
          to={path.login}
          end
          onClick={(e) => {
            e.preventDefault();
            onLogoutClick();
          }}
        >
          <LogoutOutlined aria-hidden />
          Выход
        </Item>

        <Item to={path.welcome} end>
          <HomeOutlined aria-hidden />
          Главная
        </Item>

        <Item to={path.clients}>
          <TeamOutlined aria-hidden />
          Клиенты
        </Item>

        <Item to={path.deals}>
          <ProjectOutlined aria-hidden />
          Сделки
        </Item>

        <Item
          to={path.reports.sales}
          end
          data-active={reportsActive ? "true" : undefined}
        >
          <BarChartOutlined aria-hidden />
          Отчёты
        </Item>

        <Item to={path.tasks}>
          <CheckSquareOutlined aria-hidden />
          Задачи
        </Item>
      </NavBlock>

      <Footer>
        <UserRow to={path.profile}>
          <Avatar
            size={36}
            style={{ backgroundColor: "#3b82f6", flexShrink: 0 }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>

          <UserName>{displayName}</UserName>

          <SettingOutlined style={{ color: "#64748b" }} aria-hidden />
        </UserRow>
      </Footer>
    </Shell>
  );
}
