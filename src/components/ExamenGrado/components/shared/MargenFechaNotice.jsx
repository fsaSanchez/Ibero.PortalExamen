import React from 'react';
import { Alert, Typography } from '@mui/material';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import { MARGEN_DIAS_HABILES } from '../../constants/examenGrado.constants';

/**
 * Aviso amarillo que aparece cuando la fecha del examen está a
 * exactamente 10 u 11 días hábiles de hoy (margen crítico).
 * Solo se renderiza si `diasHabiles` está en MARGEN_DIAS_HABILES.
 *
 * Props:
 *   diasHabiles  {number|null}  – resultado de useDiasHabiles.calcular()
 *   sx           {object}       – estilos adicionales opcionales
 */
export const MargenFechaNotice = ({ diasHabiles, sx = {} }) => {
  if (!MARGEN_DIAS_HABILES.includes(diasHabiles)) return null;

  return (
    <Alert
      severity="warning"
      icon={<EventBusyOutlinedIcon fontSize="small" />}
      sx={{
        borderRadius: 2,
        fontSize:     '0.85rem',
        mb:           2,
        ...sx,
      }}
    >
      <Typography variant="body2" fontWeight={600} component="span">
        Margen ajustado —&nbsp;
      </Typography>
      La fecha seleccionada está a{' '}
      <strong>{diasHabiles} días hábiles</strong> de hoy. El trámite puede
      requerir autorización adicional. Verifica con la coordinación antes de
      continuar.
    </Alert>
  );
};
