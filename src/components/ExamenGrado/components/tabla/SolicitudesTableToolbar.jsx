import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import SearchIcon       from '@mui/icons-material/Search';
import ClearIcon        from '@mui/icons-material/Clear';
import RefreshIcon      from '@mui/icons-material/Refresh';

/**
 * Barra de herramientas sobre la tabla de solicitudes.
 *
 * Props:
 *   busqueda         {string}    – texto de búsqueda actual
 *   onBusquedaChange {function}  – setter del texto
 *   onRefresh        {function}  – fuerza recarga de datos
 *   totalFiltrado    {number}    – filas visibles después de filtros
 *   totalGeneral     {number}    – total sin filtrar
 */
export const SolicitudesTableToolbar = ({
  busqueda,
  onBusquedaChange,
  onRefresh,
  totalFiltrado,
  totalGeneral,
}) => {
  const hayFiltro = busqueda.trim().length > 0;

  return (
    <Box
      sx={{
        px:              2,
        py:              1.5,
        display:         'flex',
        alignItems:      'center',
        gap:             2,
        flexWrap:        'wrap',
        backgroundColor: '#fafafa',
        borderBottom:    '1px solid #e0e0e0',
      }}
    >
      {/* Buscador */}
      <TextField
        size="small"
        placeholder="Buscar por folio o programa…"
        value={busqueda}
        onChange={(e) => onBusquedaChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: hayFiltro ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  edge="end"
                  onClick={() => onBusquedaChange('')}
                  aria-label="Limpiar búsqueda"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{ minWidth: 280, backgroundColor: 'white' }}
      />

      <Box sx={{ flexGrow: 1 }} />

      {/* Contador */}
      {totalGeneral > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {hayFiltro
            ? `${totalFiltrado} de ${totalGeneral} solicitudes`
            : `${totalGeneral} solicitudes`}
        </Typography>
      )}

      {/* Refrescar */}
      <Tooltip title="Actualizar lista">
        <IconButton size="small" onClick={onRefresh} aria-label="Actualizar">
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
