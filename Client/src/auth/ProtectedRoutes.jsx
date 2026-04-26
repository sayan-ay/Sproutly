import { Navigate } from "react-router-dom";
import { useAuthStore } from "./authStore";

export default function ProtectedRoutes(props) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated)
    return <Navigate to="/signin" replace />;

  return props.children;
}
