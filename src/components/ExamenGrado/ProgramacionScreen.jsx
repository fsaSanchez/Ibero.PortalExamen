import React, { useState, useEffect, useMemo } from 'react';
import { useSelector }    from 'react-redux';
import { Box, Typography, Paper } from '@mui/material';

import { useSolicitudes }            from './hooks/useSolicitudes';
import { SolicitudesTableToolbar }   from './components/tabla/SolicitudesTableToolbar';
import { SolicitudesTable }          from './components/tabla/SolicitudesTable';
import { ESTATUS, COLOR_IBERO }      from './constants/examenGrado.constants';

import {
  ModalDetalle,
  ModalEstatus,
  ModalObservaciones,
  ModalAsignarFecha,
} from './components/modales';

export default function ProgramacionScreen() {
  const { isAdmin } = useSelector((state) => state.auth);
  const { solicitudes, cargarLista } = useSolicitudes();

  // ── Filtros ────────────────────────────────────────────────────────────────
  const [tabActivo, setTabActivo] = useState(0);
  const [busqueda,  setBusqueda]  = useState('');

  // ── Estado de modales ──────────────────────────────────────────────────────
  const [solicitudActiva,   setSolicitudActiva]   = useState(null);
  const [modalDetalleOpen,  setModalDetalleOpen]  = useState(false);
  const [modalEstatusOpen,  setModalEstatusOpen]  = useState(false);
  const [modalObsOpen,      setModalObsOpen]      = useState(false);
  const [modalFechaOpen,    setModalFechaOpen]    = useState(false);

  // ── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    cargarLista();
  }, [cargarLista]);

  // ── Derivados ──────────────────────────────────────────────────────────────

  const conteoPorEstatus = useMemo(() => ({
    total:       solicitudes.length,
    confirmadas: solicitudes.filter((s) => s.idEstatus === ESTATUS.CONFIRMADA).length,
    enRevision:  solicitudes.filter((s) => s.idEstatus === ESTATUS.EN_REVISION).length,
    rechazadas:  solicitudes.filter((s) => s.idEstatus === ESTATUS.RECHAZADA).length,
  }), [solicitudes]);

  const solicitudesFiltradas = useMemo(() => {
    let lista = solicitudes;

    // Filtro por tab
    if (tabActivo === 1) lista = lista.filter((s) => s.idEstatus === ESTATUS.CONFIRMADA);
    else if (tabActivo === 2) lista = lista.filter((s) => s.idEstatus === ESTATUS.EN_REVISION);
    else if (tabActivo === 3) lista = lista.filter((s) => s.idEstatus === ESTATUS.RECHAZADA);

    // Filtro por búsqueda (folio o programa)
    const term = busqueda.trim().toLowerCase();
    if (term) {
      lista = lista.filter(
        (s) =>
          s.folio?.toLowerCase().includes(term) ||
          s.programa?.toLowerCase().includes(term),
      );
    }

    return lista;
  }, [solicitudes, tabActivo, busqueda]);

  // ── Handlers de apertura de modales ───────────────────────────────────────

  const handleVerDetalle = (solicitud) => {
    setSolicitudActiva(solicitud);
    setModalDetalleOpen(true);
  };

  const handleCambiarEstatus = (solicitud) => {
    setSolicitudActiva(solicitud);
    setModalEstatusOpen(true);
  };

  const handleAsignarFecha = (solicitud) => {
    setSolicitudActiva(solicitud);
    setModalFechaOpen(true);
  };

  const handleVerObservaciones = (solicitud) => {
    setSolicitudActiva(solicitud);
    setModalObsOpen(true);
  };

  // ── Handler de cierre y refresco ───────────────────────────────────────────

  const handleCerrar = () => {
    setModalDetalleOpen(false);
    setModalEstatusOpen(false);
    setModalObsOpen(false);
    setModalFechaOpen(false);
    setSolicitudActiva(null);
  };

  // Cierra modal y recarga la lista para reflejar cambios del backend
  const handleActualizacion = () => {
    handleCerrar();
    cargarLista();
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" fontWeight={700} sx={{ color: COLOR_IBERO, mb: 3 }}>
        Programación de Exámenes de Grado
      </Typography>

      <Paper
        elevation={0}
        sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}
      >
        <SolicitudesTableToolbar
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          onRefresh={cargarLista}
          totalFiltrado={solicitudesFiltradas.length}
          totalGeneral={solicitudes.length}
        />

        <SolicitudesTable
          solicitudes={solicitudesFiltradas}
          conteoPorEstatus={conteoPorEstatus}
          tabActivo={tabActivo}
          onTabChange={setTabActivo}
          isAdmin={isAdmin}
          onVerDetalle={handleVerDetalle}
          onCambiarEstatus={handleCambiarEstatus}
          onAsignarFecha={handleAsignarFecha}
          onVerObservaciones={handleVerObservaciones}
        />
      </Paper>

      <ModalDetalle
        open={modalDetalleOpen}
        solicitud={solicitudActiva}
        isAdmin={isAdmin}
        onClose={handleCerrar}
        onActualizar={handleActualizacion}
      />

      <ModalEstatus
        open={modalEstatusOpen}
        solicitud={solicitudActiva}
        onClose={handleCerrar}
        onActualizar={handleActualizacion}
      />

      <ModalObservaciones
        open={modalObsOpen}
        solicitud={solicitudActiva}
        isAdmin={isAdmin}
        onClose={handleCerrar}
        onActualizar={handleActualizacion}
      />

      <ModalAsignarFecha
        open={modalFechaOpen}
        solicitud={solicitudActiva}
        onClose={handleCerrar}
        onActualizar={handleActualizacion}
      />
    </Box>
  );
}
