import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

/**
 * Hook para filtrar columnas responsive
 * @param {Array} columns - Array de columnas
 * @returns {Array} columnas adaptadas según pantalla
 */
export const useResponsiveColumns = (columns) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Solo regresamos columnas que no tengan hideInMobile en mobile
  return isMobile ? columns.filter((col) => !col.hideInMobile) : columns;
};