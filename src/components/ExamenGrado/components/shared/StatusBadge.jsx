import React from 'react';
import { Box, Typography } from '@mui/material';
import { ESTATUS_COLORS, ESTATUS_LABEL } from '../../constants/examenGrado.constants';

/**
 * Badge de color según el estatus de la solicitud.
 * Recibe `idEstatus` (número) o puede funcionar como wrapper
 * pasando `label` y `colors` directamente para reuso interno.
 *
 * Props:
 *   idEstatus  {number}  – id del catálogo EstatusSolicitud
 *   sx         {object}  – estilos adicionales opcionales
 */
export const StatusBadge = ({ idEstatus, sx = {} }) => {
  const colors = ESTATUS_COLORS[idEstatus];
  const label  = ESTATUS_LABEL[idEstatus];

  if (!colors || !label) return null;

  return (
    <Box
      component="span"
      sx={{
        display:        'inline-flex',
        alignItems:     'center',
        px:             1.5,
        py:             0.25,
        borderRadius:   '12px',
        backgroundColor: colors.bg,
        color:          colors.text,
        fontWeight:     600,
        fontSize:       '0.75rem',
        lineHeight:     1.6,
        whiteSpace:     'nowrap',
        border:         `1px solid ${colors.text}22`,
        ...sx,
      }}
    >
      {label}
    </Box>
  );
};
