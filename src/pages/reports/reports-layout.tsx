import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PageHeading, PageRoot } from "../../components/list-page";
import { useIsMobile } from "../../hooks";
import { ReportsTabs, TabPanel } from "./reports-layout.styled";

const TAB_KEYS = ["sales", "clients", "tasks"] as const;

function tabLabel(key: (typeof TAB_KEYS)[number], isMobile: boolean): string {
  if (isMobile) {
    if (key === "sales") return "По продажам";
    if (key === "clients") return "По клиентам";
    return "По задачам";
  }
  if (key === "sales") return "Отчёты по продажам";
  if (key === "clients") return "Отчёты по клиентам";
  return "Отчёты по задачам";
}

export function ReportsLayout() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const segment = pathname.split("/").pop() ?? "sales";
  const activeKey: (typeof TAB_KEYS)[number] = TAB_KEYS.includes(
    segment as (typeof TAB_KEYS)[number],
  )
    ? (segment as (typeof TAB_KEYS)[number])
    : "sales";

  return (
    <PageRoot $mobileStickyFooter={false}>
      <PageHeading>Отчёты</PageHeading>
      <ReportsTabs
        activeKey={activeKey}
        onChange={(k) => navigate(`/reports/${k}`)}
        items={TAB_KEYS.map((key) => ({
          key,
          label: tabLabel(key, isMobile),
        }))}
      />
      <TabPanel>
        <Outlet />
      </TabPanel>
    </PageRoot>
  );
}
