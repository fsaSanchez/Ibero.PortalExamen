import React from 'react';
import { Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

/**
 * Aviso azul informativo que indica que la sección está en modo solo lectura.
 * Se muestra únicamente para el perfil Coordinador donde el Admin
 * tiene acciones exclusivas.
 *
 * Props:
 *   mensaje  {string}  – texto personalizable (opcional)
 *   sx       {object}  – estilos adicionales opcionales
 */
export const ReadonlyNotice = ({
  mensaje = 'Esta sección es de solo lectura para tu perfil.',
  sx = {},
}) => {
  return (
    <Alert
      severity="info"
      icon={<LockOutlinedIcon fontSize="small" />}
      sx={{
        borderRadius: 2,
        fontSize:     '0.85rem',
        mb:           2,
        ...sx,
      }}
    >
      {mensaje}
    </Alert>
  );
};
