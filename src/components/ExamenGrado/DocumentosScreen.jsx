import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DataGrid }                    from '@mui/x-data-grid';
import AddIcon                         from '@mui/icons-material/Add';
import DeleteOutlineIcon               from '@mui/icons-material/DeleteOutline';
import CloseIcon                       from '@mui/icons-material/Close';
import DescriptionOutlinedIcon         from '@mui/icons-material/DescriptionOutlined';
import OndemandVideoOutlinedIcon       from '@mui/icons-material/OndemandVideoOutlined';
import ContentCopyIcon                 from '@mui/icons-material/ContentCopy';
import CheckIcon                       from '@mui/icons-material/Check';
import RefreshIcon                     from '@mui/icons-material/Refresh';
import moment                          from 'moment';
import 'moment/locale/es';
import Swal                            from 'sweetalert2';

import { useApiData }     from '../../hooks/useApiData';
import { useCatalogos }   from './hooks/useCatalogos';
import {
  TIPO_DOCUMENTO_ONLINE,
  COLOR_IBERO,
} from './constants/examenGrado.constants';

moment.locale('es');

// ─── Hook local para PlantillaDocumento ──────────────────────────────────────

const usePlantillas = () => {
  const { fetchData, sendData } = useApiData();
  const [plantillas, setPlantillas] = useState([]);
  const [cargando,   setCargando]   = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    const data = await fetchData('PlantillaDocumento/GetAll', {}, 'Cargando plantillas…');
    setPlantillas(data ?? []);
    setCargando(false);
  }, [fetchData]);

  const registrar = useCallback(
    (payload) =>
      sendData('PlantillaDocumento', 'post', payload, {}, 'Registrando plantilla…'),
    [sendData],
  );

  const eliminar = useCallback(
    (id) =>
      sendData(`PlantillaDocumento/${id}`, 'delete', {}, {}, 'Eliminando plantilla…'),
    [sendData],
  );

  return { plantillas, cargando, cargar, registrar, eliminar };
};

// ─── Badge de tipo de documento ───────────────────────────────────────────────

const TipoDocumentoBadge = ({ idTipo, nombre }) => {
  const esOnline = TIPO_DOCUMENTO_ONLINE.includes(idTipo);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
      {esOnline ? (
        <OndemandVideoOutlinedIcon sx={{ fontSize: '1rem', color: '#1a56db', flexShrink: 0 }} />
      ) : (
        <DescriptionOutlinedIcon sx={{ fontSize: '1rem', color: '#666', flexShrink: 0 }} />
      )}
      <Box>
        <Typography variant="body2" fontWeight={500} lineHeight={1.3}>
          {nombre || `Tipo ${idTipo}`}
        </Typography>
        {esOnline && (
          <Typography variant="caption" sx={{ color: '#1a56db', fontSize: '0.68rem' }}>
            Sesión online
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// ─── Celda de ID Laserfiche con botón de copia ───────────────────────────────

const LaserficheId = ({ value }) => {
  const [copiado, setCopiado] = useState(false);
  const timer = useRef(null);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(value ?? '');
      setCopiado(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiado(false), 1600);
    } catch {
      // clipboard no disponible
    }
  };

  if (!value) return <Typography variant="body2" color="text.disabled">—</Typography>;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography
        variant="body2"
        sx={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 500 }}
      >
        {value}
      </Typography>
      <Tooltip title={copiado ? '¡Copiado!' : 'Copiar ID'} placement="top">
        <IconButton size="small" onClick={copiar} sx={{ p: 0.3 }}>
          {copiado ? (
            <CheckIcon sx={{ fontSize: '0.8rem', color: 'success.main' }} />
          ) : (
            <ContentCopyIcon sx={{ fontSize: '0.8rem', color: 'text.disabled' }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// ─── Modal para registrar nueva plantilla ────────────────────────────────────

const ModalAgregarPlantilla = ({ open, tiposDocumento, onClose, onGuardado }) => {
  const { sendData } = useApiData();
  const [idTipo,       setIdTipo]       = useState('');
  const [idLaserfiche, setIdLaserfiche] = useState('');
  const [guardando,    setGuardando]    = useState(false);

  // Limpiar al abrir
  useEffect(() => {
    if (open) {
      setIdTipo('');
      setIdLaserfiche('');
    }
  }, [open]);

  const valido = idTipo !== '' && idLaserfiche.trim() !== '';

  const handleGuardar = async () => {
    if (!valido) return;
    setGuardando(true);
    try {
      const result = await sendData(
        'PlantillaDocumento',
        'post',
        { idTipoDocumento: Number(idTipo), idLaserfiche: idLaserfiche.trim() },
        {},
        'Registrando plantilla…',
      );
      if (result !== null) onGuardado();
    } finally {
      setGuardando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && valido && !guardando) handleGuardar();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>

      {/* Cabecera */}
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
          <Typography variant="h6" fontWeight={700}>Registrar plantilla</Typography>
          <Typography variant="caption" color="text.secondary">
            La plantilla quedará disponible para descarga
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.25 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Formulario */}
      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>

          {/* Tipo de documento */}
          <TextField
            select
            label="Tipo de documento"
            value={idTipo}
            onChange={(e) => setIdTipo(e.target.value)}
            size="small"
            fullWidth
            required
          >
            <MenuItem value="" disabled>
              Seleccionar tipo…
            </MenuItem>
            {tiposDocumento.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {TIPO_DOCUMENTO_ONLINE.includes(t.id)
                    ? <OndemandVideoOutlinedIcon sx={{ fontSize: '0.9rem', color: '#1a56db' }} />
                    : <DescriptionOutlinedIcon  sx={{ fontSize: '0.9rem', color: '#666' }} />
                  }
                  {t.nombre}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {/* ID Laserfiche */}
          <TextField
            label="ID Laserfiche"
            value={idLaserfiche}
            onChange={(e) => setIdLaserfiche(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            fullWidth
            required
            placeholder="Ej. LF-2025-001"
            inputProps={{ style: { fontFamily: 'monospace' } }}
            helperText="Identificador del documento en el sistema Laserfiche"
          />
        </Stack>
      </DialogContent>

      {/* Acciones */}
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button onClick={onClose} color="inherit" size="small" disabled={guardando}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={!valido || guardando}
          onClick={handleGuardar}
          startIcon={guardando ? <CircularProgress size={14} color="inherit" /> : <AddIcon fontSize="small" />}
          sx={{
            backgroundColor:  COLOR_IBERO,
            '&:hover':        { backgroundColor: '#6a0000' },
            '&.Mui-disabled': { backgroundColor: '#e0e0e0' },
          }}
        >
          {guardando ? 'Guardando…' : 'Registrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Screen principal ─────────────────────────────────────────────────────────

export default function DocumentosScreen() {
  const { plantillas, cargando, cargar, eliminar } = usePlantillas();
  const { tiposDocumento }                         = useCatalogos();
  const [modalOpen, setModalOpen]                  = useState(false);

  // Carga inicial
  useEffect(() => { cargar(); }, [cargar]);

  // Lookup nombre del tipo
  const getNombreTipo = (idTipo) =>
    tiposDocumento.find((t) => t.id === idTipo)?.nombre ?? `Tipo ${idTipo}`;

  // ── Eliminar ──────────────────────────────────────────────────────────────

  const handleEliminar = async (row) => {
    const nombre = getNombreTipo(row.idTipoDocumento);

    const { isConfirmed } = await Swal.fire({
      title:            'Eliminar plantilla',
      html: `
        ¿Seguro que deseas eliminar la plantilla de<br/>
        <strong>${nombre}</strong>?<br/>
        <span style="font-family:monospace;font-size:0.85rem">${row.idLaserfiche ?? ''}</span><br/><br/>
        <span style="color:#8B0000;font-size:0.85rem">Esta acción no se puede deshacer.</span>
      `,
      icon:              'warning',
      showCancelButton:  true,
      confirmButtonColor: COLOR_IBERO,
      confirmButtonText: 'Eliminar',
      cancelButtonText:  'Cancelar',
    });
    if (!isConfirmed) return;

    const result = await eliminar(row.id);
    if (result !== null) cargar();
  };

  // ── Columnas del DataGrid ─────────────────────────────────────────────────

  const columns = [
    {
      field:      'idTipoDocumento',
      headerName: 'Tipo de documento',
      flex:       2,
      minWidth:   220,
      renderCell: ({ row }) => (
        <TipoDocumentoBadge
          idTipo={row.idTipoDocumento}
          nombre={getNombreTipo(row.idTipoDocumento)}
        />
      ),
    },
    {
      field:      'idLaserfiche',
      headerName: 'ID Laserfiche',
      flex:       1.5,
      minWidth:   180,
      renderCell: ({ row }) => <LaserficheId value={row.idLaserfiche} />,
    },
    {
      field:      'fechaCarga',
      headerName: 'Fecha de carga',
      width:      170,
      renderCell: ({ row }) => (
        <Typography variant="body2" color="text.secondary">
          {row.fechaCarga
            ? moment(row.fechaCarga).format('DD/MM/YYYY HH:mm')
            : '—'}
        </Typography>
      ),
    },
    {
      field:      'acciones',
      headerName: '',
      width:      60,
      sortable:   false,
      renderCell: ({ row }) => (
        <Tooltip title="Eliminar plantilla">
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); handleEliminar(row); }}
            sx={{ color: COLOR_IBERO, '&:hover': { backgroundColor: '#fce8e8' } }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>

      {/* Encabezado de página */}
      <Box
        sx={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            2,
          mb:             3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: COLOR_IBERO, mb: 0.5 }}>
            Plantillas de documentos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona los identificadores Laserfiche de cada tipo de documento.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{
            backgroundColor: COLOR_IBERO,
            '&:hover':       { backgroundColor: '#6a0000' },
            alignSelf:       'center',
          }}
        >
          Agregar plantilla
        </Button>
      </Box>

      {/* Tabla */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}
      >
        {/* Sub-cabecera de tabla */}
        <Box
          sx={{
            px:              2,
            py:              1.5,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'space-between',
            backgroundColor: '#fafafa',
            borderBottom:    '1px solid #e0e0e0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Plantillas registradas
            </Typography>
            {plantillas.length > 0 && (
              <Chip
                label={plantillas.length}
                size="small"
                sx={{
                  height:          18,
                  fontSize:        '0.68rem',
                  fontWeight:      700,
                  backgroundColor: '#f0f0f0',
                  color:           '#555',
                }}
              />
            )}
          </Box>

          <Tooltip title="Actualizar lista">
            <span>
              <IconButton
                size="small"
                onClick={cargar}
                disabled={cargando}
              >
                {cargando
                  ? <CircularProgress size={16} />
                  : <RefreshIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* DataGrid */}
        <DataGrid
          rows={plantillas}
          columns={columns}
          getRowId={(row) => row.idPlantillaDocumento}
          autoHeight
          getRowHeight={() => 'auto'}
          estimatedRowHeight={64}
          loading={cargando}
          hideFooter={plantillas.length <= 25}
          pageSizeOptions={[25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting:    { sortModel: [{ field: 'idTipoDocumento', sort: 'asc' }] },
          }}
          disableRowSelectionOnClick
          disableColumnMenu
          sortingOrder={['asc', 'desc']}
          localeText={{
            noRowsLabel: 'No hay plantillas registradas. Usa "Agregar plantilla" para crear la primera.',
            MuiTablePagination: {
              labelRowsPerPage: 'Filas por página:',
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`,
            },
          }}
          sx={{
            border: 'none',

            // Cabecera
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5' },
            '& .MuiDataGrid-columnHeader':  { backgroundColor: '#f5f5f5' },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight:    700,
              fontSize:      '0.75rem',
              color:         '#555',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            },

            // Celdas
            '& .MuiDataGrid-cell': {
              display:      'flex',
              alignItems:   'center',
              borderBottom: '1px solid #f0f0f0',
              outline:      'none !important',
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },

            // Filas
            '& .MuiDataGrid-row:hover': { backgroundColor: '#fafafa' },

            // Footer
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #e0e0e0' },
          }}
        />
      </Paper>

      {/* Modal para agregar plantilla */}
      <ModalAgregarPlantilla
        open={modalOpen}
        tiposDocumento={tiposDocumento}
        onClose={() => setModalOpen(false)}
        onGuardado={() => {
          setModalOpen(false);
          cargar();
        }}
      />
    </Box>
  );
}
