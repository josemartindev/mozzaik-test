import {
  createFileRoute,
  Navigate,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { authenticate } from "../redux/features/authenticationSlice";

export const Route = createFileRoute("/_authentication")({
  component: () => {
    const dispatch = useDispatch();
    const isAuthenticated = localStorage.getItem('token') ? dispatch(authenticate(localStorage.getItem('token'))) : false;
    const { pathname } = useLocation();

    if (pathname === '/login' && isAuthenticated) {
      return <Outlet />;
    }

    if (!isAuthenticated) {
      console.log('Entered ', isAuthenticated)
      return <Navigate to="/login" search={{ redirect: pathname }} replace />;
    } else {
      return <Outlet />;
    }

  },
});
