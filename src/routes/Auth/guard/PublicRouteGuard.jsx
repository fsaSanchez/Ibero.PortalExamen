import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PublicRouteGuard = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    // Si el usuario está autenticado, lo redirigimos al dashboard.
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está autenticado, le mostramos la página que quería ver (login, register, etc.).
  return children;
};