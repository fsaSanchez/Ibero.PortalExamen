import axios from "axios";
import { getInLocalStorageGeneral, LocalStorageKeys } from "../utilities/localStorage.utility";
import { uiFinishLoading } from "../ui/store/uiSlice";
import { getValidationError } from "../utilities/get-validation-errors";
import { logout } from "../Auth/store/authSlice";
import { store } from "../redux-toolkit/store";
import { SnackbarUtilities } from "../utilities/snackbar-manager";


// Función para actualizar los headers de la solicitud
const updateHeader = (request) => {
  const token = getInLocalStorageGeneral(LocalStorageKeys.TOKEN);
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }

  // ⚠️ Solo agregar "application/json" si el body NO es FormData
  if (!(request.data instanceof FormData)) {
    request.headers["Content-Type"] = "application/json";
  }

  return request;
};

// Configuración del interceptor
export const AxiosInterceptor = () => {
    console.log("paso por el interceptor");
    
  // Interceptor de solicitud
  axios.interceptors.request.use((request) => {
    return updateHeader(request);
  });

  // Interceptor de respuesta
  axios.interceptors.response.use(
    (response) => {
      // Retorna la respuesta directamente si no hay errores
      return response;
    },
    (error) => {
      // Finaliza el estado de carga en la UI
      store.dispatch(uiFinishLoading());
      console.log(error);
      

      // Extrae el código, mensaje y estado del error
      const errorCode = error.response?.data?.error || error.code;
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error en el servidor.";
      const status = error.response?.status;

      // Muestra el error usando Snackbar
      SnackbarUtilities.error(getValidationError(errorCode, errorMessage));

      // Si el error es 401 (no autorizado), cierra la sesión del usuario
      if (status === 401) {
        store.dispatch(logout());
      }

      // Rechaza la promesa con el error
      return Promise.reject(error);
    }
  );
};
