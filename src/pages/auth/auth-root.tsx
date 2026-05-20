import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { path } from "../../lib/constants/navigation";
import { selectAuthUserId } from "../../store/auth-slice";
import { AuthLandingPage } from "./auth-landing-page";

export function AuthRoot() {
  const userId = useAppSelector(selectAuthUserId);
  if (userId) {
    return <Navigate to={path.welcome} replace />;
  }
  return <AuthLandingPage />;
}
