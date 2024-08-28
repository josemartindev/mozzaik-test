import {
  createFileRoute,
  Navigate,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { AppState } from "../main";

export const Route = createFileRoute("/_authentication")({
  component: () => {
    const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);
    const { pathname } = useLocation();

    if (!isAuthenticated) {
      return <Navigate to="/login" search={{ redirect: pathname }} replace />;
    }

    return <Outlet />;
  },
});
