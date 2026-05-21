import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Page } from "../lib/constants/navigation";
import { useAppSelector, useIsMobile } from "../hooks";
import { selectAuthUserId } from "../store/auth-slice";

export function RequireAuth(props: PropsWithChildren) {
  const { children } = props;
  const userId = useAppSelector(selectAuthUserId);
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!userId) {
    return (
      <Navigate
        to={isMobile ? Page.MAIN : Page.LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
