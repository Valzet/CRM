import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import styled from "styled-components";
import { useMediaQuery } from "../hooks/use-media-query";
import { MainContent, ViewContainer } from "../layouts";
import { MainSidebar } from "../layouts/sidebar/main-sidebar";
import {
  SidebarProvider,
  useSidebar,
} from "../layouts/sidebar/sidebar-context";
import { color, grid, layout } from "../theme/tokens";

const Shell = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
  min-height: 100dvh;
`;

const MainPane = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
`;

const MobileBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: ${color.background.secondary};
  border-bottom: 1px solid ${color.background.shadowHint};
  flex-shrink: 0;
`;

function MainLayoutInner() {
  const isMobile = useMediaQuery(`(max-width: ${grid.breakpoints.mobileMax})`);
  const { mobileOpen, openMobile, closeMobile } = useSidebar();

  return (
    <Shell>
      {!isMobile ? <MainSidebar /> : null}

      {isMobile ? (
        <Drawer
          placement="left"
          open={mobileOpen}
          onClose={closeMobile}
          width={layout.sidebarExpandedPx}
          styles={{
            body: { padding: 0 },
            header: { display: "none" },
          }}
          aria-label="Меню"
        >
          <MainSidebar onNavigate={closeMobile} forceExpanded />
        </Drawer>
      ) : null}

      <MainPane>
        {isMobile ? (
          <MobileBar>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={openMobile}
              aria-label="Открыть меню"
            />
          </MobileBar>
        ) : null}
        <MainContent>
          <ViewContainer />
        </MainContent>
      </MainPane>
    </Shell>
  );
}

/** Оболочка: сайдбар YaPlex + область с {@link Outlet}. */
export function MainLayout() {
  return (
    <SidebarProvider>
      <MainLayoutInner />
    </SidebarProvider>
  );
}
