import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Skeleton,
  Tooltip,
} from '@mui/material';
import CloseIcon          from '@mui/icons-material/Close';
import DeleteOutlineIcon  from '@mui/icons-material/DeleteOutline';
import PersonOutlineIcon  from '@mui/icons-material/PersonOutline';
import moment             from 'moment';
import 'moment/locale/es';
import Swal               from 'sweetalert2';

import { StatusBadge, ModalidadBadge, ReadonlyNotice } from '../shared';
import { DocumentosOnline } from '../formularios/DocumentosOnline';
import { useSolicitudes }   from '../../hooks/useSolicitudes';
import {
  TIPO_SOLICITUD,
  DOCS_ONLINE_APLICA,
  COLOR_IBERO,
} from '../../constants/examenGrado.constants';

moment.locale('es');

// ─── Helpers internos ─────────────────────────────────────────────────────────

const TIPO_LABEL = {
  [TIPO_SOLICITUD.INDIVIDUAL]: 'Individual',
  [TIPO_SOLICITUD.GENERAL]:    'General',
};

/** Par etiqueta / valor en la cuadrícula de información */
const InfoField = ({ label, children }) => (
  <Box>
    <Typography
      variant="caption"
      fontWeight={700}
      color="text.secondary"
      sx={{
        display:       'block',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        mb:            0.25,
      }}
    >
      {label}
    </Typography>
    {typeof children === 'string' || typeof children === 'number' ? (
      <Typography variant="body2" fontWeight={500}>
        {children || '—'}
      </Typography>
    ) : (
      children ?? (
        <Typography variant="body2" color="text.disabled">
          —
        </Typography>
      )
    )}
  </Box>
);

/** Fila de alumno con avatar circular y botón de eliminar para Admin */
const AlumnoRow = ({ alumno, isAdmin, onEliminar }) => (
  <Box
    sx={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      py:             1,
      px:             1.5,
      borderRadius:   1.5,
      border:         '1px solid #f0f0f0',
      '&:hover':      { backgroundColor: '#fafafa' },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {/* Avatar */}
      <Box
        sx={{
          width:           34,
          height:          34,
          borderRadius:    '50%',
          backgroundColor: '#f0f4ff',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:       0,
        }}
      >
        <PersonOutlineIcon sx={{ fontSize: '1rem', color: '#3451b2' }} />
      </Box>

      {/* Datos */}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {alumno.nombre}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {[alumno.numeroCuenta, alumno.programa].filter(Boolean).join(' · ')}
        </Typography>
      </Box>
    </Box>

    {/* Eliminar — solo Admin */}
    {isAdmin && (
      <Tooltip title="Eliminar alumno de la solicitud">
        <IconButton
          size="small"
          onClick={() => onEliminar(alumno.id)}
          sx={{
            color:       COLOR_IBERO,
            flexShrink:  0,
            '&:hover':   { backgroundColor: '#fce8e8' },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
  </Box>
);

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * Modal de detalle de una solicitud.
 * Muestra toda la información + lista de alumnos.
 * Admin puede eliminar alumnos con confirmación SweetAlert2.
 * Coordinador ve la sección de alumnos en modo solo lectura.
 *
 * Props:
 *   open         {boolean}   – controla visibilidad
 *   solicitud    {object}    – fila activa (id + datos básicos para el header)
 *   isAdmin      {boolean}
 *   onClose      {function}  – cierra sin acción
 *   onActualizar {function}  – cierra + recarga lista en padre
 */
export const ModalDetalle = ({ open, solicitud, isAdmin, onClose, onActualizar }) => {
  const { cargarDetalle, detalle, eliminarAlumno } = useSolicitudes();
  const [cargando, setCargando] = useState(false);

  // Cargar detalle completo cada vez que el modal se abre
  useEffect(() => {
    if (!open || !solicitud?.id) return;
    setCargando(true);
    cargarDetalle(solicitud.id).finally(() => setCargando(false));
  }, [open, solicitud?.id, cargarDetalle]);

  const handleEliminarAlumno = async (idAlumno) => {
    const { isConfirmed } = await Swal.fire({
      title:             '¿Eliminar alumno?',
      text:              'El alumno será removido de esta solicitud.',
      icon:              'warning',
      showCancelButton:  true,
      confirmButtonColor: COLOR_IBERO,
      confirmButtonText: 'Eliminar',
      cancelButtonText:  'Cancelar',
    });
    if (!isConfirmed) return;

    const result = await eliminarAlumno(idAlumno);
    if (result !== null) {
      // Recargar detalle sin cerrar el modal
      await cargarDetalle(solicitud.id);
      // Notificar al padre para refrescar conteos de la tabla
      onActualizar();
    }
  };

  const alumnos = detalle?.alumnos ?? [];
  const docsOnline = DOCS_ONLINE_APLICA(detalle?.idTipoSolicitud, detalle?.idModalidad);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">

      {/* ── Cabecera ─────────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'flex-start',
          borderBottom:   '1px solid #f0f0f0',
          pb:             1.5,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Detalle de solicitud
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {solicitud?.folio}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.25 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Contenido ────────────────────────────────────────────────────── */}
      <DialogContent sx={{ pt: 3 }}>

        {cargando ? (
          /* Skeleton mientras carga */
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="rounded" height={52} />
              ))}
            </Box>
            <Skeleton variant="rounded" height={120} />
          </Stack>
        ) : (
          <>
            {/* ── Información principal ──────────────────────────────────── */}
            <Box
              sx={{
                display:             'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                gap:                 2.5,
                mb:                  3,
              }}
            >
              <InfoField label="Folio">{detalle?.folio}</InfoField>

              <Box sx={{ gridColumn: { xs: '1', sm: '2', md: '2 / span 3' } }}>
                <InfoField label="Programa">{detalle?.programa}</InfoField>
              </Box>

              <InfoField label="Tipo">
                <Typography variant="body2" fontWeight={500}>
                  {TIPO_LABEL[detalle?.idTipoSolicitud] ?? '—'}
                </Typography>
              </InfoField>

              <InfoField label="Modalidad">
                <ModalidadBadge idModalidad={detalle?.idModalidad} />
              </InfoField>

              <InfoField label="Estatus">
                <StatusBadge idEstatus={detalle?.idEstatus} />
              </InfoField>

              <InfoField label="Fecha examen">
                {detalle?.fechaExamen
                  ? moment(detalle.fechaExamen).format('DD [de] MMMM YYYY')
                  : '—'}
              </InfoField>

              <InfoField label="Hora">
                {detalle?.horaExamen ?? '—'}
              </InfoField>

              <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2', md: '2 / span 3' } }}>
                <InfoField label="Lugar">{detalle?.lugar}</InfoField>
              </Box>
            </Box>

            {/* ── Sección documentos online ──────────────────────────────── */}
            {docsOnline && (
              <>
                <Divider sx={{ mb: 2.5 }} />
                <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
                  Documentos para sesión online
                </Typography>
                <DocumentosOnline
                  idSolicitud={solicitud?.id}
                  isAdmin={isAdmin}
                />
              </>
            )}

            {/* ── Alumnos ────────────────────────────────────────────────── */}
            <Divider sx={{ my: 2.5 }} />

            <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
              Alumnos ({alumnos.length})
            </Typography>

            {!isAdmin && (
              <ReadonlyNotice mensaje="Solo el Administrador puede eliminar alumnos de una solicitud." />
            )}

            {alumnos.length === 0 ? (
              <Typography
                variant="body2"
                color="text.disabled"
                fontStyle="italic"
                sx={{ py: 1 }}
              >
                Sin alumnos registrados.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {alumnos.map((a) => (
                  <AlumnoRow
                    key={a.id}
                    alumno={a}
                    isAdmin={isAdmin}
                    onEliminar={handleEliminarAlumno}
                  />
                ))}
              </Stack>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
