import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AxiosDataToken } from "../services/AxiosConnection";


import { uiFinishLoading, uiStartLoading } from "../ui/store";
import { SnackbarUtilities } from "../utilities/snackbar-manager";
import { getSeccionValidacion } from "../Auth/store/auth_thunk";

/**
 * Hook para manejar llamadas API con loader y notificaciones globales
 * @returns {object} { fetchData, sendData }
 */
export const useApiData = () => {
  const dispatch = useDispatch();
  const { currentInformationAccount } = useSelector(state => state.auth);

  /**
   * Llama un endpoint GET y actualiza loader + snackbar
   */
  const fetchData = useCallback(
    async (endpoint, queryParams = {}, loadingMessage = "Cargando...") => {
      dispatch(uiStartLoading(loadingMessage));
      try {
        const resp = await AxiosDataToken(endpoint, "get", {}, queryParams);

        // Aquí asumo que tu backend devuelve un objeto con `respuestaStatus`
        if (resp.respuestaStatus !== "[Axios] OK") {
          SnackbarUtilities.error(
            resp.message || "Error al obtener datos del servidor",
          );
          return null;
        }

        if (resp.data === null && resp.message) {
          SnackbarUtilities.info(resp.message);
        }

        // SnackbarUtilities.toast("Datos cargados correctamente");
        return resp.data ?? null;
      } catch (error) {
        console.error("❌ Error en fetchData:", error);
        SnackbarUtilities.error("Error al cargar información");
        return null;
      } finally {
        dispatch(uiFinishLoading());
      }
    },
    [dispatch],
  );

  /**
   * Llama un endpoint para POST, PUT o DELETE
   */
  const sendData = useCallback(
    async (
      endpoint,
      method,
      body = {},
      queryParams = {},
      loadingMessage = "Procesando...",
    ) => {
      dispatch(uiStartLoading(loadingMessage));
      try {
        const resp = await AxiosDataToken(endpoint, method, body, queryParams);

        if (resp.respuestaStatus !== "[Axios] OK") {
          SnackbarUtilities.error(
            resp.message || "Error en la respuesta del servidor",
          );
          return null;
        }

        SnackbarUtilities.success(
          resp.message || "Operación realizada correctamente",
        );
        return resp.data ?? null;
      } catch (error) {
        console.error("❌ Error en sendData:", error);
        SnackbarUtilities.error("Error al procesar la solicitud");
        throw error;
      } finally {
        dispatch(uiFinishLoading());
        dispatch(getSeccionValidacion(currentInformationAccount));
      }
    },
    [dispatch, currentInformationAccount],
  );





    const fetchDataSearch = useCallback(
    async (endpoint, queryParams ) => {
     
      try {
        const resp = await AxiosDataToken(endpoint, "get", {}, queryParams);

      
        
        // Aquí asumo que tu backend devuelve un objeto con `respuestaStatus`
        if (resp.respuestaStatus !== "[Axios] OK") {
          SnackbarUtilities.error("Error al realizar la búsqueda");
          return null;
        }
        return resp.data ?? null;
      } catch (error) {
       
        SnackbarUtilities.error("Error al cargar información");
        return null;
      } 
    },
    []
  );

  return { fetchData, sendData,fetchDataSearch };
};
