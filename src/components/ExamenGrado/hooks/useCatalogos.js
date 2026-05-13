import { useState, useEffect, useCallback } from 'react';
import { useApiData } from '../../../hooks/useApiData';

/**
 * Carga todos los catálogos necesarios para el módulo una sola vez.
 * Retorna listas listas para usar en selects y para lookup por id.
 */
export const useCatalogos = () => {
  const { fetchData } = useApiData();

  const [tiposSolicitud,   setTiposSolicitud]   = useState([]);
  const [modalidades,      setModalidades]      = useState([]);
  const [estatuses,        setEstatuses]        = useState([]);
  const [tiposDocumento,   setTiposDocumento]   = useState([]);
  const [cargando,         setCargando]         = useState(false);
  const [cargado,          setCargado]          = useState(false);

  const cargar = useCallback(async () => {
    if (cargado) return;
    setCargando(true);
    try {
      const [ts, mo, es, td] = await Promise.all([
        fetchData('Catalogo/TipoSolicitud',   {}, 'Cargando catálogos...'),
        fetchData('Catalogo/Modalidad',       {}, 'Cargando catálogos...'),
        fetchData('Catalogo/EstatusSolicitud',{}, 'Cargando catálogos...'),
        fetchData('Catalogo/TipoDocumento',   {}, 'Cargando catálogos...'),
      ]);

      if (ts) setTiposSolicitud(ts);
      if (mo) setModalidades(mo);
      if (es) setEstatuses(es);
      if (td) setTiposDocumento(td);

      setCargado(true);
    } finally {
      setCargando(false);
    }
  }, [cargado, fetchData]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Helpers para lookup rápido por id
  const getTipoSolicitudLabel = (id) =>
    tiposSolicitud.find((t) => t.id === id)?.nombre ?? '';

  const getModalidadLabel = (id) =>
    modalidades.find((m) => m.id === id)?.nombre ?? '';

  const getEstatusLabel = (id) =>
    estatuses.find((e) => e.id === id)?.nombre ?? '';

  const getTipoDocumentoLabel = (id) =>
    tiposDocumento.find((d) => d.id === id)?.nombre ?? '';

  return {
    tiposSolicitud,
    modalidades,
    estatuses,
    tiposDocumento,
    cargando,
    cargado,
    getTipoSolicitudLabel,
    getModalidadLabel,
    getEstatusLabel,
    getTipoDocumentoLabel,
  };
};
