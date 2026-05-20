import { Drawer } from "antd";
import { useIsMobile } from "../hooks";
import { MainContent, ViewContainer } from "../layouts";
import { MobileHeader } from "../layouts/mobile-header";
import { MainSidebar } from "../layouts/sidebar/main-sidebar";
import { MobileSidebar } from "../layouts/sidebar/mobile-sidebar";
import { SidebarProvider, useSidebar } from "../layouts/sidebar/sidebar-context";
import { MainPane, Shell } from "./main.styled";

function MainLayoutInner() {
  const isMobile = useIsMobile();
  const { mobileOpen, openMobile, closeMobile } = useSidebar();

  return (
    <Shell>
      {!isMobile ? <MainSidebar /> : null}

      {isMobile ? (
        <Drawer
          placement="left"
          open={mobileOpen}
          onClose={closeMobile}
          width="100%"
          style={{ maxWidth: 375 }}
          styles={{
            body: { padding: 0, background: "transparent" },
            header: { display: "none" },
            content: { background: "transparent", boxShadow: "none" },
            mask: { backgroundColor: "rgba(15, 23, 42, 0.25)" },
          }}
          aria-label="Меню"
        >
          <MobileSidebar onClose={closeMobile} />
        </Drawer>
      ) : null}

      <MainPane>
        {isMobile ? <MobileHeader onMenuOpen={openMobile} /> : null}
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
