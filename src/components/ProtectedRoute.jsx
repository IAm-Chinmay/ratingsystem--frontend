import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuthStore();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}
