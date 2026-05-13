import axios from "axios";
import { logout } from "../Auth/store/authSlice";
import { toast } from "react-toastify";

let storeRef = null;
let isLoggingOut = false;

/**
 * Realiza el proceso de logout por sesión expirada o no autorizada.
 */
export const handleUnauthorized = () => {
  if (isLoggingOut || !storeRef) return;

  isLoggingOut = true;

  // Limpiar localStorage (tokens, etc.)
  localStorage.clear();

  // Hacer logout en Redux → ProtectedRouteGuard redirige automáticamente
  storeRef.dispatch(logout());

  // Notificar al usuario
  toast.info("Sesión expirada.", {
    toastId: "session-expired",
    autoClose: 5000,
  });

  // Resetear flag después de un breve delay
  setTimeout(() => {
    isLoggingOut = false;
  }, 3000);
};

/**
 * Configura un interceptor global de Axios para manejar respuestas 401.
 * @param {import("@reduxjs/toolkit").Store} store - Redux store
 */
export const setupInterceptors = (store) => {
  storeRef = store;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        const requestUrl = error.config?.url || "";
        const isAuthEndpoint =
          requestUrl.includes("Auth/LoginExterno") ||
          requestUrl.includes("Auth/ProfilesByAppId") ||
          requestUrl.includes("Auth/refreshToken");

        if (!isAuthEndpoint) {
          handleUnauthorized();
        }
      }
      return Promise.reject(error);
    }
  );
};
