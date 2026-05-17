import { useState, useEffect, useCallback, useRef } from 'react';
import { useApiData } from '../../../hooks/useApiData';

export const useCatalogos = () => {
  const { fetchData } = useApiData();

  const [tiposSolicitud,   setTiposSolicitud]   = useState([]);
  const [modalidades,      setModalidades]      = useState([]);
  const [estatuses,        setEstatuses]        = useState([]);
  const [tiposDocumento,   setTiposDocumento]   = useState([]);
  const [cargando,         setCargando]         = useState(false);
  const [cargado,          setCargado]          = useState(false);

  // Ref para acceder a la versión más reciente de fetchData sin incluirla en
  // los deps de cargar. Esto evita que cargar cambie de identidad cuando
  // fetchData cambia por re-renders (ej. hot reload), cortando el loop:
  // cargar → fetchData → dispatch → re-render → nuevo cargar → ...
  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;

  // cargadoRef permite que cargar (con deps []) siempre lea el valor más
  // reciente de cargado sin generar una nueva identidad de función.
  const cargadoRef = useRef(cargado);
  cargadoRef.current = cargado;

  const cargar = useCallback(async () => {
    if (cargadoRef.current) return;
    setCargando(true);
    try {
      const [ts, mo, es, td] = await Promise.all([
        fetchDataRef.current('Catalogo/TipoSolicitud',   {}, 'Cargando catálogos...'),
        fetchDataRef.current('Catalogo/Modalidad',       {}, 'Cargando catálogos...'),
        fetchDataRef.current('Catalogo/EstatusSolicitud',{}, 'Cargando catálogos...'),
        fetchDataRef.current('Catalogo/TipoDocumento',   {}, 'Cargando catálogos...'),
      ]);

      if (ts) setTiposSolicitud(ts);
      if (mo) setModalidades(mo);
      if (es) setEstatuses(es);
      if (td) setTiposDocumento(td);

      setCargado(true);
    } finally {
      setCargando(false);
    }
  }, []); // identidad estable — nunca cambia

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { cargar(); }, []); // solo al montar

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
