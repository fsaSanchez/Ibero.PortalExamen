import { useState, useCallback } from 'react';
import { useApiData } from '../../../hooks/useApiData';

/**
 * Gestiona la lista de solicitudes y el detalle de una solicitud individual.
 * Expone también las mutaciones que necesitan Admin / Coordinador.
 */
export const useSolicitudes = () => {
  const { fetchData, sendData } = useApiData();

  const [solicitudes,  setSolicitudes]  = useState([]);
  const [detalle,      setDetalle]      = useState(null);

  // ─── Lecturas ─────────────────────────────────────────────────────────────

  const cargarLista = useCallback(
    async (idEstatus = null) => {
      const params = idEstatus !== null ? { idEstatus } : {};
      const data = await fetchData('Solicitud/GetAll', params, 'Cargando solicitudes...');
      setSolicitudes(data ?? []);
      return data ?? [];
    },
    [fetchData],
  );

  const cargarDetalle = useCallback(
    async (id) => {
      const data = await fetchData(`Solicitud/GetById/${id}`, {}, 'Cargando detalle...');
      setDetalle(data);
      return data;
    },
    [fetchData],
  );

  const limpiarDetalle = useCallback(() => setDetalle(null), []);

  // ─── Solicitud ────────────────────────────────────────────────────────────

  const crearSolicitud = useCallback(
    async (payload) => {
      const data = await sendData('Solicitud', 'post', payload, {}, 'Guardando solicitud...');
      return data;
    },
    [sendData],
  );

  const actualizarEstatus = useCallback(
    async (payload) => {
      const data = await sendData('Solicitud/UpdateEstatus', 'put', payload, {}, 'Actualizando estatus...');
      return data;
    },
    [sendData],
  );

  // ─── SolicitudAlumno ──────────────────────────────────────────────────────

  const cargarAlumnos = useCallback(
    async (idSolicitud) => {
      return fetchData(`SolicitudAlumno/GetBySolicitud/${idSolicitud}`, {}, 'Cargando alumnos...');
    },
    [fetchData],
  );

  const agregarAlumno = useCallback(
    async (payload) => {
      return sendData('SolicitudAlumno', 'post', payload, {}, 'Agregando alumno...');
    },
    [sendData],
  );

  const eliminarAlumno = useCallback(
    async (id) => {
      return sendData(`SolicitudAlumno/${id}`, 'delete', {}, {}, 'Eliminando alumno...');
    },
    [sendData],
  );

  // ─── SolicitudDocumento ───────────────────────────────────────────────────

  const cargarDocumentos = useCallback(
    async (idSolicitud) => {
      return fetchData(`SolicitudDocumento/GetBySolicitud/${idSolicitud}`, {}, 'Cargando documentos...');
    },
    [fetchData],
  );

  const registrarDocumento = useCallback(
    async ({ idSolicitud, idTipoDocumento, archivo }) => {
      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('idSolicitud', idSolicitud);
      formData.append('idTipoDocumento', idTipoDocumento);
      return sendData('SolicitudDocumento', 'Filepost', formData, {}, 'Registrando documento...');
    },
    [sendData],
  );

  const obtenerArchivo = useCallback(
    async (idLaserfiche) => {
      return fetchData('SolicitudDocumento/GetFile', { id_laserfiche: idLaserfiche }, 'Cargando documento...');
    },
    [fetchData],
  );

  const actualizarDocumento = useCallback(
    async (id, payload) => {
      return sendData(`SolicitudDocumento/${id}`, 'put', payload, {}, 'Actualizando documento...');
    },
    [sendData],
  );

  // ─── SolicitudObservacion ─────────────────────────────────────────────────

  const agregarObservacion = useCallback(
    async (payload) => {
      return sendData('SolicitudObservacion', 'post', payload, {}, 'Guardando observación...');
    },
    [sendData],
  );

  const eliminarObservacion = useCallback(
    async (id) => {
      return sendData(`SolicitudObservacion/${id}`, 'delete', {}, {}, 'Eliminando observación...');
    },
    [sendData],
  );

  return {
    // Estado
    solicitudes,
    detalle,
    // Solicitud
    cargarLista,
    cargarDetalle,
    limpiarDetalle,
    crearSolicitud,
    actualizarEstatus,
    // Alumnos
    cargarAlumnos,
    agregarAlumno,
    eliminarAlumno,
    // Documentos
    cargarDocumentos,
    registrarDocumento,
    actualizarDocumento,
    obtenerArchivo,
    // Observaciones
    agregarObservacion,
    eliminarObservacion,
  };
};
