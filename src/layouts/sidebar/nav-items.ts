import brief from "../../assets/icons/24x24/Briefcase.svg";
import home from "../../assets/icons/24x24/Home.svg";
import projects from "../../assets/icons/24x24/Project.svg";
import clients from "../../assets/icons/24x24/Team.svg";
import tasks from "../../assets/icons/24x24/Task.svg";
import { path } from "../../lib/constants/navigation";

export type NavItemConfig = {
  to: string;
  end?: boolean;
  iconSrc: string;
  label: string;
  matchPrefix?: string;
};

export const mainNavItems: NavItemConfig[] = [
  { to: path.welcome, end: true, iconSrc: home, label: "Главная" },
  { to: path.clients, iconSrc: clients, label: "Клиенты" },
  { to: path.deals, iconSrc: brief, label: "Сделки" },
  { to: path.reports.sales, end: true, iconSrc: projects, label: "Отчёты", matchPrefix: "/reports" },
  { to: path.tasks, iconSrc: tasks, label: "Задачи" },
];
