import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRouteGuard = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return children; // Si está autenticado, renderiza los componentes hijos
};