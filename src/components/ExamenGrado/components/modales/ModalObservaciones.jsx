import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import Swal from 'sweetalert2';

import { ObservacionCard, ReadonlyNotice } from '../shared';
import { useSolicitudes }  from '../../hooks/useSolicitudes';
import {
  TIPO_SOLICITUD,
  COLOR_IBERO,
} from '../../constants/examenGrado.constants';

// ─── Normalización de datos del backend ──────────────────────────────────────

const normalizarObs = (obs) => ({
  id:            obs.id,
  texto:         obs.texto,
  fechaCreacion: obs.fechaCreacion ?? obs.fecha,
  autor:         obs.autor ?? obs.creadoPor ?? obs.usuario ?? '',
  tipo:          obs.tipo ?? (obs.idAlumno ? 'alumno' : 'general'),
  alumno:        obs.alumno ?? obs.nombreAlumno ?? null,
});

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * Modal de observaciones de una solicitud.
 *
 * Admin:
 *   - Ve y elimina observaciones (con SweetAlert2)
 *   - Agrega nuevas observaciones tipo General o Por Alumno
 *   - El switch General/Por Alumno solo aparece si tipo solicitud === GENERAL
 *
 * Coordinador:
 *   - Ve observaciones en modo solo lectura (ReadonlyNotice)
 *
 * Props:
 *   open         {boolean}   – controla visibilidad
 *   solicitud    {object}    – fila activa
 *   isAdmin      {boolean}
 *   onClose      {function}  – cierra sin acción
 *   onActualizar {function}  – cierra + recarga lista en padre
 */
export const ModalObservaciones = ({ open, solicitud, isAdmin, onClose, onActualizar }) => {
  const {
    cargarDetalle,
    detalle,
    agregarObservacion,
    eliminarObservacion,
  } = useSolicitudes();

  const [cargando,    setCargando]    = useState(false);
  const [guardando,   setGuardando]   = useState(false);
  // Formulario
  const [texto,       setTexto]       = useState('');
  const [tipoAlumno,  setTipoAlumno]  = useState(false);
  const [idAlumnoSel, setIdAlumnoSel] = useState('');

  // ── Cargar detalle al abrir ─────────────────────────────────────────────

  const recargar = useCallback(async () => {
    if (!solicitud?.id) return;
    await cargarDetalle(solicitud.id);
  }, [solicitud?.id, cargarDetalle]);

  useEffect(() => {
    if (!open || !solicitud?.id) return;
    setCargando(true);
    recargar().finally(() => setCargando(false));
    // Limpiar formulario al abrir
    setTexto('');
    setTipoAlumno(false);
    setIdAlumnoSel('');
  }, [open, solicitud?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Datos derivados ─────────────────────────────────────────────────────

  const observaciones = (detalle?.observaciones ?? []).map(normalizarObs);
  const alumnos       = detalle?.alumnos ?? [];
  const esGeneral     = solicitud?.idTipoSolicitud === TIPO_SOLICITUD.GENERAL;
  const formularioValido =
    texto.trim().length > 0 && (!tipoAlumno || idAlumnoSel !== '');

  // ── Agregar observación ─────────────────────────────────────────────────

  const handleAgregar = async () => {
    if (!formularioValido) return;
    setGuardando(true);
    try {
      const payload = {
        idSolicitud: solicitud.id,
        texto:       texto.trim(),
        tipo:        tipoAlumno ? 'alumno' : 'general',
        idAlumno:    tipoAlumno ? Number(idAlumnoSel) : null,
      };
      const result = await agregarObservacion(payload);
      if (result !== null) {
        setTexto('');
        setIdAlumnoSel('');
        // Refrescar conteo en la tabla y cerrar para reflejar cambio
        await recargar();
        onActualizar();
      }
    } finally {
      setGuardando(false);
    }
  };

  // ── Eliminar observación ────────────────────────────────────────────────

  const handleEliminar = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title:             '¿Eliminar observación?',
      text:              'Esta acción no se puede deshacer.',
      icon:              'warning',
      showCancelButton:  true,
      confirmButtonColor: COLOR_IBERO,
      confirmButtonText: 'Eliminar',
      cancelButtonText:  'Cancelar',
    });
    if (!isConfirmed) return;

    const result = await eliminarObservacion(id);
    if (result !== null) {
      await recargar();
      onActualizar();
    }
  };

  // ────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">

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
          <Typography variant="h6" fontWeight={700}>Observaciones</Typography>
          <Typography variant="caption" color="text.secondary">
            {solicitud?.folio}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.25 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Contenido ────────────────────────────────────────────────────── */}
      <DialogContent sx={{ pt: 2.5 }}>

        {/* Aviso de solo lectura para Coordinador */}
        {!isAdmin && (
          <ReadonlyNotice mensaje="Las observaciones son de solo lectura para tu perfil." />
        )}

        {/* Lista de observaciones */}
        {cargando ? (
          <Stack spacing={1.5}>
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height={90} />
            ))}
          </Stack>
        ) : observaciones.length === 0 ? (
          <Box
            sx={{
              py:           3,
              textAlign:    'center',
              borderRadius: 2,
              border:       '1px dashed #e0e0e0',
              mb:           isAdmin ? 2.5 : 0,
            }}
          >
            <Typography variant="body2" color="text.disabled" fontStyle="italic">
              Sin observaciones registradas.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5} sx={{ mb: isAdmin ? 2.5 : 0 }}>
            {observaciones.map((obs) => (
              <ObservacionCard
                key={obs.id}
                observacion={obs}
                isAdmin={isAdmin}
                onEliminar={isAdmin ? handleEliminar : undefined}
              />
            ))}
          </Stack>
        )}

        {/* ── Formulario — solo Admin ───────────────────────────────────── */}
        {isAdmin && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
              Nueva observación
            </Typography>

            {/* Switch General / Por alumno — solo si solicitud es de tipo General */}
            {esGeneral && (
              <FormControlLabel
                control={
                  <Switch
                    checked={tipoAlumno}
                    onChange={(e) => {
                      setTipoAlumno(e.target.checked);
                      setIdAlumnoSel('');
                    }}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: COLOR_IBERO },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: COLOR_IBERO,
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2">Por alumno específico</Typography>
                }
                sx={{ mb: 1.5, ml: 0 }}
              />
            )}

            {/* Selector de alumno (visible si switch activo) */}
            {tipoAlumno && (
              <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                <InputLabel>Alumno</InputLabel>
                <Select
                  value={idAlumnoSel}
                  label="Alumno"
                  onChange={(e) => setIdAlumnoSel(e.target.value)}
                >
                  {alumnos.length === 0 ? (
                    <MenuItem disabled value="">
                      Sin alumnos disponibles
                    </MenuItem>
                  ) : (
                    alumnos.map((a) => (
                      <MenuItem key={a.id} value={a.id}>
                        {a.nombre}
                        {a.numeroCuenta ? ` — ${a.numeroCuenta}` : ''}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}

            {/* Textarea */}
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              size="small"
              placeholder="Escribir observación…"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              sx={{ mb: 1.5 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="small"
                disabled={!formularioValido || guardando}
                onClick={handleAgregar}
                startIcon={<AddCommentOutlinedIcon fontSize="small" />}
                sx={{
                  backgroundColor: COLOR_IBERO,
                  '&:hover':       { backgroundColor: '#6a0000' },
                  '&.Mui-disabled': { backgroundColor: '#e0e0e0' },
                }}
              >
                Agregar observación
              </Button>
            </Box>
          </>
        )}
      </DialogContent>

      {/* ── Acciones (solo Coordinador necesita cerrar desde aquí) ───────── */}
      {!isAdmin && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" size="small">
            Cerrar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
