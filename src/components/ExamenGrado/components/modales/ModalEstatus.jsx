import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import CloseIcon        from '@mui/icons-material/Close';
import CheckCircleIcon  from '@mui/icons-material/CheckCircle';
import Swal             from 'sweetalert2';

import { StatusBadge }        from '../shared';
import { useSolicitudes }     from '../../hooks/useSolicitudes';
import {
  ESTATUS,
  ESTATUS_COLORS,
  ESTATUS_LABEL,
  COLOR_IBERO,
} from '../../constants/examenGrado.constants';

const OPCIONES = [ESTATUS.EN_REVISION, ESTATUS.CONFIRMADA, ESTATUS.RECHAZADA];

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Modal para que el Admin cambie el estatus de una solicitud.
 * Muestra los 3 estatus posibles como tarjetas seleccionables.
 * Requiere confirmación con SweetAlert2 antes de hacer PUT.
 *
 * Props:
 *   open        {boolean}   – controla visibilidad
 *   solicitud   {object}    – fila activa de la tabla
 *   onClose     {function}  – cierra sin guardar
 *   onActualizar{function}  – cierra + recarga lista en padre
 */
export const ModalEstatus = ({ open, solicitud, onClose, onActualizar }) => {
  const { actualizarEstatus } = useSolicitudes();
  const [seleccionado, setSeleccionado] = useState(null);

  // Sincronizar selección con estatus actual cada vez que abre
  useEffect(() => {
    if (open) setSeleccionado(solicitud?.idEstatus ?? null);
  }, [open, solicitud?.idEstatus]);

  const haycambio = seleccionado !== null && seleccionado !== solicitud?.idEstatus;

  const handleGuardar = async () => {
    const etiqueta = ESTATUS_LABEL[seleccionado];
    const { isConfirmed } = await Swal.fire({
      title:             'Cambiar estatus',
      html:              `La solicitud <strong>${solicitud?.folio}</strong> pasará a <strong>${etiqueta}</strong>.`,
      icon:              'question',
      showCancelButton:  true,
      confirmButtonColor: COLOR_IBERO,
      confirmButtonText: 'Confirmar',
      cancelButtonText:  'Cancelar',
    });
    if (!isConfirmed) return;

    const result = await actualizarEstatus({ id: solicitud.id, idEstatus: seleccionado });
    if (result !== null) onActualizar();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>

      {/* Cabecera */}
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
          <Typography variant="h6" fontWeight={700}>Cambiar estatus</Typography>
          <Typography variant="caption" color="text.secondary">
            {solicitud?.folio}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.25 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Opciones */}
      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <Stack spacing={1.5}>
          {OPCIONES.map((idEstatus) => {
            const colors      = ESTATUS_COLORS[idEstatus];
            const esActual    = solicitud?.idEstatus === idEstatus;
            const esElegido   = seleccionado === idEstatus;

            return (
              <Box
                key={idEstatus}
                onClick={() => setSeleccionado(idEstatus)}
                sx={{
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'space-between',
                  p:               1.75,
                  borderRadius:    2,
                  border:          '2px solid',
                  borderColor:     esElegido ? colors.text : '#e8e8e8',
                  backgroundColor: esElegido ? colors.bg   : 'white',
                  cursor:          'pointer',
                  transition:      'all 0.14s ease',
                  '&:hover': {
                    borderColor:     colors.text,
                    backgroundColor: colors.bg,
                  },
                }}
              >
                {/* Izq: badge + etiqueta "actual" */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <StatusBadge idEstatus={idEstatus} />
                  {esActual && (
                    <Typography
                      variant="caption"
                      fontStyle="italic"
                      color="text.secondary"
                    >
                      actual
                    </Typography>
                  )}
                </Box>

                {/* Der: check cuando está seleccionado */}
                {esElegido && (
                  <CheckCircleIcon
                    sx={{ fontSize: '1.15rem', color: colors.text }}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </DialogContent>

      {/* Acciones */}
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button onClick={onClose} color="inherit" size="small">
          Cancelar
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={!haycambio}
          onClick={handleGuardar}
          sx={{
            backgroundColor: COLOR_IBERO,
            '&:hover': { backgroundColor: '#6a0000' },
            '&.Mui-disabled': { backgroundColor: '#e0e0e0' },
          }}
        >
          Guardar cambio
        </Button>
      </DialogActions>
    </Dialog>
  );
};
