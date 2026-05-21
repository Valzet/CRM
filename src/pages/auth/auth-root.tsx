import { Navigate } from "react-router-dom";
import { useAppSelector, useIsMobile } from "../../hooks";
import { Page, path } from "../../lib/constants/navigation";
import { selectAuthUserId } from "../../store/auth-slice";
import { AuthLandingPage } from "./auth-landing-page";

export function AuthRoot() {
  const userId = useAppSelector(selectAuthUserId);
  const isMobile = useIsMobile();

  if (userId) {
    return <Navigate to={path.welcome} replace />;
  }
  if (!isMobile) {
    return <Navigate to={Page.LOGIN} replace />;
  }
  return <AuthLandingPage />;
}
