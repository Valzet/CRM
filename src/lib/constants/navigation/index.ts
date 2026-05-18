export const path = {
  welcome: "/welcome",
  clients: "/clients",
  deals: "/deals",
  tasks: "/tasks",
  settings: "/settings",
  profile: "/profile",
  reports: {
    root: "/reports",
    sales: "/reports/sales",
    clients: "/reports/clients",
    tasks: "/reports/tasks",
  },
  login: "/login",
  register: "/register",
  passwordRecovery: "/password-recovery",
  emailConfirmation: "/email-confirmation",
  unavailable: "/unavailable",
} as const;

export const DEFAULT_VIEW_URI = "welcome";
export const MAIN_PAGE_URI = "/";
export const LOGIN_PAGE_URI = "/login";
export const UNAVAILABLE_PAGE_URI = "/unavailable";
export const NOT_FOUND_URI = "*";

export const Page = {
  MAIN: MAIN_PAGE_URI,
  LOGIN: LOGIN_PAGE_URI,
  UNAVAILABLE: UNAVAILABLE_PAGE_URI,
  NOT_FOUND: NOT_FOUND_URI,
} as const;
