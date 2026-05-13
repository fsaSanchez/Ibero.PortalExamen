import React from 'react';
import { Box } from '@mui/material';
import { MODALIDAD_COLORS, MODALIDAD_LABEL } from '../../constants/examenGrado.constants';

/**
 * Badge de color según la modalidad de la solicitud.
 *
 * Props:
 *   idModalidad  {number}  – id del catálogo Modalidad
 *   sx           {object}  – estilos adicionales opcionales
 */
export const ModalidadBadge = ({ idModalidad, sx = {} }) => {
  const colors = MODALIDAD_COLORS[idModalidad];
  const label  = MODALIDAD_LABEL[idModalidad];

  if (!colors || !label) return null;

  return (
    <Box
      component="span"
      sx={{
        display:         'inline-flex',
        alignItems:      'center',
        px:              1.5,
        py:              0.25,
        borderRadius:    '12px',
        backgroundColor: colors.bg,
        color:           colors.text,
        fontWeight:      600,
        fontSize:        '0.75rem',
        lineHeight:      1.6,
        whiteSpace:      'nowrap',
        border:          `1px solid ${colors.text}22`,
        ...sx,
      }}
    >
      {label}
    </Box>
  );
};
