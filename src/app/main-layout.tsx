import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { useMediaQuery } from "../hooks/use-media-query";
import { MainContent, ViewContainer } from "../layouts";
import { MainSidebar } from "../layouts/sidebar/main-sidebar";
import { SidebarProvider, useSidebar } from "../layouts/sidebar/sidebar-context";
import { grid, layout } from "../theme/tokens";
import { MainPane, MobileBar, Shell } from "./main.styled";

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
export function MainLayout() {
  return (
    <SidebarProvider>
      <MainLayoutInner />
    </SidebarProvider>
  );
}
