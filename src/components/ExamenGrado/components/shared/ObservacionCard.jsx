import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

// ─── Pill interna para el tipo de observación ─────────────────────────────────

const TipoPill = ({ tipo }) => {
  const esAlumno = tipo === 'alumno';
  return (
    <Box
      component="span"
      sx={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:             0.5,
        px:              1,
        py:              0.2,
        borderRadius:    '10px',
        fontSize:        '0.7rem',
        fontWeight:      700,
        textTransform:   'uppercase',
        letterSpacing:   '0.04em',
        backgroundColor: esAlumno ? '#e8f0fe' : '#f0f0f0',
        color:           esAlumno ? '#1a56db' : '#555',
        border:          esAlumno ? '1px solid #1a56db22' : '1px solid #ccc',
      }}
    >
      {esAlumno ? (
        <SchoolOutlinedIcon sx={{ fontSize: '0.75rem' }} />
      ) : (
        <PersonOutlineIcon sx={{ fontSize: '0.75rem' }} />
      )}
      {esAlumno ? 'Por alumno' : 'General'}
    </Box>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * Card individual de observación.
 *
 * Props:
 *   observacion  {object}   – { id, texto, fechaCreacion, autor,
 *                               tipo: 'general'|'alumno', alumno?: string }
 *   isAdmin      {boolean}  – muestra botón de eliminar si true
 *   onEliminar   {function} – callback(id) cuando Admin confirma eliminar
 *   sx           {object}   – estilos adicionales opcionales
 */
export const ObservacionCard = ({
  observacion,
  isAdmin   = false,
  onEliminar,
  sx        = {},
}) => {
  const { id, texto, fechaCreacion, autor, tipo = 'general', alumno } = observacion;

  const fechaFormateada = fechaCreacion
    ? moment(fechaCreacion).format('D [de] MMMM YYYY, HH:mm')
    : '';

  const handleEliminar = () => {
    if (onEliminar) onEliminar(id);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p:            2,
        borderRadius: 2,
        borderColor:  '#e0e0e0',
        position:     'relative',
        '&:hover':    { borderColor: '#bdbdbd' },
        ...sx,
      }}
    >
      {/* Cabecera: tipo pill + meta + botón eliminar */}
      <Box
        sx={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          mb:             1,
          gap:            1,
        }}
      >
        {/* Lado izquierdo: tipo + alumno (si aplica) + autor + fecha */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <TipoPill tipo={tipo} />
            {tipo === 'alumno' && alumno && (
              <Typography
                variant="caption"
                sx={{
                  color:      '#1a56db',
                  fontWeight: 600,
                  fontSize:   '0.75rem',
                }}
              >
                {alumno}
              </Typography>
            )}
          </Box>

          {/* Autor y fecha */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {autor && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <PersonOutlineIcon sx={{ fontSize: '0.8rem', color: '#888' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {autor}
                </Typography>
              </Box>
            )}
            {fechaFormateada && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <AccessTimeIcon sx={{ fontSize: '0.8rem', color: '#888' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {fechaFormateada}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Botón eliminar — solo Admin */}
        {isAdmin && onEliminar && (
          <Tooltip title="Eliminar observación" placement="top">
            <IconButton
              size="small"
              onClick={handleEliminar}
              sx={{
                color:       '#8B0000',
                flexShrink:  0,
                mt:          -0.5,
                '&:hover': {
                  backgroundColor: '#fce8e8',
                },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Texto de la observación */}
      <Typography
        variant="body2"
        sx={{
          color:      'text.primary',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          fontSize:   '0.875rem',
        }}
      >
        {texto}
      </Typography>
    </Paper>
  );
};
