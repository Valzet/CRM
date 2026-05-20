import type { ReactNode } from "react";
import { DashboardTab, DashboardTabs } from "./styled";

export type WelcomeDashboardTab = "home" | "clients" | "deals" | "tasks";

const TABS: { id: WelcomeDashboardTab; label: string }[] = [
  { id: "home", label: "Главная" },
  { id: "clients", label: "Клиенты" },
  { id: "deals", label: "Сделки" },
  { id: "tasks", label: "Задачи" },
];

type Props = {
  active: WelcomeDashboardTab;
  onChange: (tab: WelcomeDashboardTab) => void;
};

export function WelcomeDashboardTabs({ active, onChange }: Props) {
  return (
    <DashboardTabs aria-label="Разделы дашборда">
      {TABS.map((tab) => (
        <DashboardTab
          key={tab.id}
          type="button"
          $active={active === tab.id}
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? "page" : undefined}
        >
          {tab.label}
        </DashboardTab>
      ))}
    </DashboardTabs>
  );
}

export function tabVisible(
  isMobile: boolean,
  active: WelcomeDashboardTab,
  section: WelcomeDashboardTab,
): boolean {
  if (!isMobile) return true;
  return active === section;
}

export type TabPanelProps = {
  isMobile: boolean;
  active: WelcomeDashboardTab;
  section: WelcomeDashboardTab;
  children: ReactNode;
};

export function WelcomeTabPanel({ isMobile, active, section, children }: TabPanelProps) {
  if (!tabVisible(isMobile, active, section)) return null;
  return <>{children}</>;
}
