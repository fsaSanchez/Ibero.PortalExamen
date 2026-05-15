import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { useFormikContext } from 'formik';

import { MargenFechaNotice } from '../shared';

/**
 * Sección "Información general del examen" reutilizable.
 * Debe estar dentro de un <Formik> — lee contexto con useFormikContext.
 *
 * Campos:
 *   fechaExamen  — date  (siempre)
 *   horaExamen   — time  (siempre)
 *   idModalidad  — select catálogo (solo si conModalidad=true)
 *   lugar        — text  (siempre)
 *
 * Props:
 *   diasHabiles   {number|null}  – de useDiasHabiles en el padre
 *   onFechaChange {function}     – callback(fechaString) cuando cambia la fecha
 *   modalidades   {array}        – [{ id, nombre }] de useCatalogos
 *   conModalidad  {boolean}      – false en GeneralScreen (default true)
 */
export const InfoGeneralExamen = ({
  diasHabiles,
  onFechaChange,
  modalidades   = [],
  conModalidad  = true,
}) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
  } = useFormikContext();

  const handleFechaChange = (e) => {
    const fecha = e.target.value;
    setFieldValue('fechaExamen', fecha);
    onFechaChange?.(fecha);
  };

  return (
    <Box>
      {/* Grid responsive: 2 col en sm+, 1 col en xs */}
      <Box
        sx={{
          display:             'grid',
          gridTemplateColumns: conModalidad
            ? { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }
            : { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap:                 2.5,
          mb:                  diasHabiles !== null ? 2 : 0,
        }}
      >
        {/* Fecha del examen */}
        <TextField
          type="date"
          name="fechaExamen"
          label="Fecha del examen"
          value={values.fechaExamen}
          onChange={handleFechaChange}
          onBlur={handleBlur}
          error={touched.fechaExamen && Boolean(errors.fechaExamen)}
          helperText={touched.fechaExamen && errors.fechaExamen}
          size="small"
          fullWidth
          required
          slotProps={{ inputLabel: { shrink: true } }}
        />

        {/* Hora del examen */}
        <TextField
          type="time"
          name="horaExamen"
          label="Hora del examen"
          value={values.horaExamen}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.horaExamen && Boolean(errors.horaExamen)}
          helperText={touched.horaExamen && errors.horaExamen}
          size="small"
          fullWidth
          required
          slotProps={{ inputLabel: { shrink: true } }}
        />

        {/* Modalidad — solo IndividualScreen */}
        {conModalidad && (
          <TextField
            select
            name="idModalidad"
            label="Modalidad"
            value={values.idModalidad}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.idModalidad && Boolean(errors.idModalidad)}
            helperText={touched.idModalidad && errors.idModalidad}
            size="small"
            fullWidth
            required
          >
            <MenuItem value="" disabled>
              Seleccionar modalidad…
            </MenuItem>
            {modalidades.map((m) => (
              <MenuItem key={m.id} value={String(m.id)}>
                {m.descripcion }
              </MenuItem>
            ))}
          </TextField>
        )}

        {/* Lugar del examen */}
        <TextField
          name="lugar"
          label="Lugar del examen"
          value={values.lugar}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lugar && Boolean(errors.lugar)}
          helperText={touched.lugar && errors.lugar}
          size="small"
          fullWidth
          required
          placeholder="Ej. Aula 301, edificio A"
          inputProps={{ maxLength: 200 }}
          // En sm y xs ocupa fila completa cuando no hay campo de modalidad
          sx={!conModalidad ? { gridColumn: { xs: '1 / -1', md: 'auto' } } : {}}
        />
      </Box>

      {/* Aviso amarillo de margen crítico */}
      <MargenFechaNotice diasHabiles={diasHabiles} sx={{ mt: diasHabiles !== null ? 0 : 0 }} />
    </Box>
  );
};
