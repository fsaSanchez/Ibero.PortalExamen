import { AxiosDataNotoken } from "../../../services/AxiosConnexion";
import { ManageAxiosResponse } from "../../../services/ResponseActionService";
import { TypeService } from "../../../services/TypeService";
import { uiFinishLoading, uiStartLoading } from "../../../ui/store";
import { SnackbarUtilities } from "../../../utilities/snackbar-manager";
import {
  setDocumentosStatic,
  setDocumentosStaticMetadatos,
  setstructuraStatic,
} from "./Static_slice";
import { toast } from "react-toastify";




export const startGetStaticDocumentosByplantilla = (Id_plantilla) => {
  return async (dispatch) => {
    dispatch(uiStartLoading("Cargando Documentos..."));
    try {
      const response = await AxiosDataNotoken(
        `Documento/${Id_plantilla}/Detalles`,
        "get",
        null,
        null
      );

      if (response.respuestaStatus !== TypeService.AxiosApiOk) {
        SnackbarUtilities.showError("Error en la respuesta del servidor");
        return;
      }
      const { camposPlantilla, documentosConValores } =
        transformarRespuestaAjustada(response);

      const data = ManageAxiosResponse(response);
      if (data) {
        dispatch(setDocumentosStatic(documentosConValores));
        dispatch(setDocumentosStaticMetadatos(camposPlantilla));
      }
    } catch (error) {
      console.error("Error al cargar documentos estáticos:", error);
      SnackbarUtilities.error("Error al cargar documentos estáticos");
    } finally {
      dispatch(uiFinishLoading());
    }
  };
};







export const startSavingForm = (values, Id_plantilla) => {
  return async (dispatch) => {
    try {
      // 🟡 Campos que no se deben incluir en respuestas

      //id a nivel documento, Documentoarchivado logica de documento,idPlantilla no va en respuestas y solo aparece al editar
      const excludeFields = ["id", "Documentoarchivado", "idPlantilla"];

      // 1️⃣ Construir el objeto para la primera petición
      const respuestas = Object.entries(values)
        .filter(([key]) => !excludeFields.includes(key))
        .map(([key, value]) => ({
          nombreCampo: key,
          valor: value ?? "",
        }));

      const objetoNuevo = {
        idDocumento: values.id ?? 0,
        idPlantilla: Id_plantilla,
        respuestas,
      };

      dispatch(uiStartLoading("Por favor espere..."));

      const response = await AxiosDataNotoken(
        `Documento/Sync`,
        "post",
        objetoNuevo,
        null
      );

      const idDocument = response.data.idDocumento;

      // 3️⃣ Si existe archivo, hacer la segunda petición
      if (
        values.Documentoarchivado &&
        values.Documentoarchivado instanceof File
      ) {
        const formData = new FormData();
        formData.append("IdDocumento", idDocument);
        formData.append("FormFile", values.Documentoarchivado);

        console.log([...formData]); // 🔍 debug

        await AxiosDataNotoken(
          `File/UploadDigitalFile`,
          "Filepost",
          formData,
          null
        );
      }

      toast.success("Formulario guardado correctamente.");
      //SnackbarUtilities.success("Formulario guardado correctamente.");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el formulario.");
    } finally {
      dispatch(startGetStaticDocumentosByplantilla(Id_plantilla));
      dispatch(uiFinishLoading());
    }
  };
};




export const startDeleteStaticDocumento = (idDocumento,Id_plantilla) => {
  return async (dispatch) => {
    dispatch(uiStartLoading("Eliminando..."));
    try {
      const response = await AxiosDataNotoken(
        `Documento/${idDocumento}`,
        "delete",
        null,
        null
      );

      if (response.respuestaStatus !== TypeService.AxiosApiOk) {
        SnackbarUtilities.showError("Error en la respuesta del servidor");
        return;
      }
    
    } catch (error) {
      console.error("Error al cargar documentos estáticos:", error);
      SnackbarUtilities.error("Error al cargar documentos estáticos");
    } finally {
      dispatch(uiFinishLoading());
      dispatch(startGetStaticDocumentosByplantilla(Id_plantilla));
    }
  };
};




export const startGetStructura = () => {
  return async (dispatch) => {
    dispatch(uiStartLoading("..."));
    try {
      const response = await AxiosDataNotoken(
        `CatAreas/GetEstructura`,
        "get",
        null,
        null
      );

      if (response.respuestaStatus !== TypeService.AxiosApiOk) {
        SnackbarUtilities.showError("Error en la respuesta del servidor");
        return;
      }
    
      dispatch(setstructuraStatic(response.data));
    } catch (error) {
       console.error(error);
      SnackbarUtilities.error("Error al obtener estructura de áreas");
    } finally {
      dispatch(uiFinishLoading());
      // dispatch(startGetStaticDocumentosByplantilla(Id_plantilla)); // commented out as Id_plantilla is undefined
    }
  };
};




export const startDownloadArchivo = (IdLserFiche, nombreArchivo = '') => {
  return async (dispatch) => {
    try {
      dispatch(uiStartLoading("Descargando..."));

      const response = await AxiosDataNotoken(
        `File/GetArchivobyId`,
        "Fileget",
        null,
        { IdLserFiche }
      );

      const { success, fileName, fileData } = response;

      if (!success || !fileData) {
        SnackbarUtilities.showError("Error al descargar el archivo.");
        return;
      }

      // === Nombre final ===
      const finalFileName = fileName || nombreArchivo || 'archivo';

      // === Extraer extensión ===
      const extension = finalFileName.split('.').pop()?.toLowerCase() || '';

      // === Mapear extensión a MIME type ===
      const mimeTypes = {
        pdf: 'application/pdf',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        bmp: 'image/bmp',
      };

      const mimeType = mimeTypes[extension] || 'application/octet-stream';

      // === Convertir base64 a Blob con el MIME correcto ===
      const byteCharacters = atob(fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // === ¿Es visualizable? ===
      const isViewable = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension);

      if (isViewable) {
        // === ABRIR EN NUEVA PESTAÑA ===
        const url = URL.createObjectURL(blob);
        const newTab = window.open(url, '_blank');

        // Si el navegador bloquea el popup (raro), forzar descarga
        if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
          const link = document.createElement('a');
          link.href = url;
          link.download = finalFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.info("Popup bloqueado. Descargando en su lugar.");
        } else {
          toast.success("Archivo abierto en nueva pestaña.");
        }

        // Liberar memoria
        setTimeout(() => URL.revokeObjectURL(url), 1000);

      } else {
        // === DESCARGAR ===
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = finalFileName; // ¡Nombre correcto!
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 100);
        toast.success("Archivo descargado correctamente.");
      }

    } catch (error) {
      console.error("Error en descarga:", error);
      toast.error("Error al descargar el archivo.");
    } finally {
      dispatch(uiFinishLoading());
    }
  };
};



const transformarRespuestaAjustada = (apiResponse) => {
  // Verificamos que los datos y documentos existan
  if (!apiResponse?.data?.documentos?.length) {
    return { camposPlantilla: [], documentosConValores: [] };
  }

  const { idPlantilla, documentos } = apiResponse.data;

  // --- Objeto 1: Estructura de campos del primer documento ---
  const primerDocumento = documentos[0];
  const camposPlantilla = primerDocumento.camposConRespuestas.map((campo) => ({
    idPlantilla: idPlantilla,
    idDocumento: primerDocumento.idDocumento,
    idCampo: campo.idCampo,
    idTipoCampo: campo.idTipoCampo,
    nombreCampo: campo.nombreCampo,
    opcionesCatalogo: campo.opcionesCatalogo || [],
    opciones: campo.opciones || [],
  }));

  // --- Objeto 2: Documentos con valores como propiedades ---
  const documentosConValores = documentos.map((documento) => {
    // Usamos reduce para transformar el array de campos en propiedades de un solo objeto
    const valoresComoPropiedades = documento.camposConRespuestas.reduce(
      (obj, campo) => {
        // Se crea una nueva propiedad en el objeto 'obj'
        // La clave es el valor de 'nombreCampo' y el valor es 'valorGuardado'
        obj[campo.nombreCampo] = campo.valorGuardado;
        return obj;
      },
      {}
    ); // El objeto inicial del reduce está vacío

    // Combinamos las propiedades base con las que acabamos de crear
    return {
      idPlantilla: idPlantilla,
      id: documento.idDocumento,
      ...valoresComoPropiedades,
    };
  });

  return { camposPlantilla, documentosConValores };
};
