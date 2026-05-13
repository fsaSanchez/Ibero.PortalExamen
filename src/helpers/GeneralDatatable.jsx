import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { useState, useMemo, useCallback } from 'react';
import { SinRegistros } from './SinRegistros';
import { useResponsiveColumns } from '../hooks/useResponsiveColumns';


const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  esES,
);

export const GeneralDataTable = ({
  rows = [],
  columns = [],
  actions = [],
  columnsHide,
  rowsPerPage = 10,
  getRowId = (row) => row.id,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = useCallback((event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedRow(null);
  }, []);

  const handleMenuAction = useCallback(
    (action) => {
      if (!selectedRow) return;
      action.onClick(selectedRow);
      handleMenuClose();
    },
    [selectedRow, handleMenuClose]
  );

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: rowsPerPage,
  });

  // columnas adaptadas a responsive
  const responsiveColumns = useResponsiveColumns(columns);

  // columnas con acciones (solo si hay)
  const finalColumns = useMemo(() => {
    const cols = [...responsiveColumns];
    if (actions.length > 0) {
      cols.push({
        field: 'acciones',
        headerName: 'Acciones',
        width: 120,
        minWidth: 120,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        filterable: false,
        headerClassName: 'custom-header',
        disableColumnMenu: true,
        renderCell: (params) => (
          <IconButton
            size="small"
            sx={{
              p: 0.5,
              transition: 'color 0.2s ease, transform 0.15s ease',
              color: 'rgb(207, 6, 34)',
              '&:hover': {
                color: '#a30321',
                transform: 'scale(1.1)',
              },
            }}
            onClick={(e) => handleMenuClick(e, params.row)}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        ),
      });
    }
    return cols;
  }, [responsiveColumns, actions, handleMenuClick]);

  const rowPerPage = [5, 10, 20, 50];

  if (rows.length === 0) return <SinRegistros />;

  return (
    <>
      <Box
        sx={{
          height: 300,
          width: '100%',
          '& .super-app-theme--header': {
            backgroundColor: 'rgba(136, 136, 136, 1)',
            color: 'rgba(255, 255, 255, 1)',
          },
        }}
      >
           <ThemeProvider theme={theme}>
        <DataGrid
          rows={rows}
          columns={finalColumns}
          pageSizeOptions={rowPerPage}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}          
          slots={{ toolbar: GridToolbar }}
          getRowId={getRowId}
          autoHeight
          columnVisibilityModel={columnsHide}
          scrollbarSize={10}
          disableColumnResize
          disableColumnMenu
          style={{ width: '100%', maxWidth: '100%' }}
          
          
        />
        </ThemeProvider>
      </Box>

      {actions.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {actions
            .filter((action) => !action.condition || (selectedRow && action.condition(selectedRow)))
            .map((action) => (
              <MenuItem key={action.key} onClick={() => handleMenuAction(action)}>
                {action.icon} {action.label}
              </MenuItem>
            ))}
        </Menu>
      )}
    </>
  );
};
