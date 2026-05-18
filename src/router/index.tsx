import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MainLayout } from "../app/main-layout";
import { Page, path } from "../lib/constants/navigation";
import {
  EmailConfirmationPage,
  LoginPage,
  PasswordRecoveryPage,
  RegisterPage,
} from "../pages/auth";
import { ClientFormPage, ClientsListPage } from "../pages/clients";
import { DealFormPage, DealsListPage } from "../pages/deals";
import {
  ReportsClientsPage,
  ReportsLayout,
  ReportsSalesPage,
  ReportsTasksPage,
} from "../pages/reports";
import { AccountSettingsPage } from "../pages/settings";
import { ProfilePage } from "../pages/profile";
import { NotFoundPage, UnavailablePage } from "../pages/service-pages";
import { TaskFormPage, TasksListPage } from "../pages/tasks";
import { WelcomePage } from "../pages/welcome";
import { RequireAuth } from "./require-auth";

function AppRoutes() {
  return (
    <Routes>
      <Route path={Page.LOGIN} element={<LoginPage />} />
      <Route path={path.register} element={<RegisterPage />} />
      <Route path={path.passwordRecovery} element={<PasswordRecoveryPage />} />
      <Route
        path={path.emailConfirmation}
        element={<EmailConfirmationPage />}
      />
      <Route path={Page.UNAVAILABLE} element={<UnavailablePage />} />

      <Route
        path={Page.MAIN}
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="welcome" replace />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<AccountSettingsPage />} />

        <Route path="reports" element={<ReportsLayout />}>
          <Route index element={<Navigate to="sales" replace />} />
          <Route path="sales" element={<ReportsSalesPage />} />
          <Route path="clients" element={<ReportsClientsPage />} />
          <Route path="tasks" element={<ReportsTasksPage />} />
        </Route>

        <Route path="clients" element={<Outlet />}>
          <Route index element={<ClientsListPage />} />
          <Route path="new" element={<ClientFormPage />} />
          <Route path=":clientId/edit" element={<ClientFormPage />} />
        </Route>

        <Route path="deals" element={<Outlet />}>
          <Route index element={<DealsListPage />} />
          <Route path="new" element={<DealFormPage />} />
          <Route path=":dealId/edit" element={<DealFormPage />} />
        </Route>

        <Route path="tasks" element={<Outlet />}>
          <Route index element={<TasksListPage />} />
          <Route path="new" element={<TaskFormPage />} />
          <Route path=":taskId/edit" element={<TaskFormPage />} />
        </Route>
      </Route>

      <Route path={Page.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
