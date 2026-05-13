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
  TextField,
  Stack,
} from '@mui/material';
import CloseIcon             from '@mui/icons-material/Close';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import moment                from 'moment';
import Swal                  from 'sweetalert2';

import { useApiData }   from '../../../../hooks/useApiData';
import { COLOR_IBERO }  from '../../constants/examenGrado.constants';

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Modal exclusivo del Admin para asignar (o actualizar) la fecha, hora
 * y lugar oficiales de un examen de grado confirmado.
 *
 * Hace PUT /Solicitud/AsignarFecha con { id, fechaExamen, horaExamen, lugar }.
 * Muestra SweetAlert2 de confirmación antes de enviar.
 *
 * Props:
 *   open         {boolean}   – controla visibilidad
 *   solicitud    {object}    – fila activa (necesita id, folio, fechaExamen, horaExamen, lugar)
 *   onClose      {function}  – cierra sin guardar
 *   onActualizar {function}  – cierra + recarga lista en padre
 */
export const ModalAsignarFecha = ({ open, solicitud, onClose, onActualizar }) => {
  const { sendData } = useApiData();

  const [fecha,  setFecha]  = useState('');
  const [hora,   setHora]   = useState('');
  const [lugar,  setLugar]  = useState('');

  // Pre-rellenar campos si la solicitud ya tiene valores
  useEffect(() => {
    if (!open) return;
    setFecha(
      solicitud?.fechaExamen
        ? moment(solicitud.fechaExamen).format('YYYY-MM-DD')
        : '',
    );
    setHora(solicitud?.horaExamen  ?? '');
    setLugar(solicitud?.lugar      ?? '');
  }, [open, solicitud]);

  const formularioValido = fecha.trim() && hora.trim() && lugar.trim();

  const handleGuardar = async () => {
    if (!formularioValido) return;

    const fechaFormateada = moment(fecha).format('DD/MM/YYYY');

    const { isConfirmed } = await Swal.fire({
      title: 'Confirmar asignación',
      html:  `
        <div style="text-align:left; font-size:0.9rem; line-height:1.8">
          <b>Solicitud:</b> ${solicitud?.folio ?? ''}<br/>
          <b>Fecha:</b> ${fechaFormateada}<br/>
          <b>Hora:</b> ${hora}<br/>
          <b>Lugar:</b> ${lugar}
        </div>`,
      icon:              'question',
      showCancelButton:  true,
      confirmButtonColor: COLOR_IBERO,
      confirmButtonText: 'Asignar',
      cancelButtonText:  'Cancelar',
    });
    if (!isConfirmed) return;

    const result = await sendData(
      'Solicitud/AsignarFecha',
      'put',
      {
        id:          solicitud.id,
        fechaExamen: fecha,
        horaExamen:  hora,
        lugar:       lugar.trim(),
      },
      {},
      'Guardando fecha…',
    );

    if (result !== null) onActualizar();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthOutlinedIcon sx={{ color: COLOR_IBERO, fontSize: '1.2rem' }} />
            <Typography variant="h6" fontWeight={700}>
              Asignar fecha
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {solicitud?.folio}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.25 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Formulario ───────────────────────────────────────────────────── */}
      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>

          {/* Fecha */}
          <TextField
            type="date"
            label="Fecha del examen"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {/* Hora */}
          <TextField
            type="time"
            label="Hora"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {/* Lugar */}
          <TextField
            label="Lugar"
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            size="small"
            fullWidth
            placeholder="Ej. Aula 301, edificio A"
            inputProps={{ maxLength: 200 }}
          />
        </Stack>
      </DialogContent>

      {/* ── Acciones ─────────────────────────────────────────────────────── */}
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button onClick={onClose} color="inherit" size="small">
          Cancelar
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={!formularioValido}
          onClick={handleGuardar}
          sx={{
            backgroundColor:  COLOR_IBERO,
            '&:hover':        { backgroundColor: '#6a0000' },
            '&.Mui-disabled': { backgroundColor: '#e0e0e0' },
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
