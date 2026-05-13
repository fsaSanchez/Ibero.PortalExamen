import React, { useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import { DataGrid }                    from '@mui/x-data-grid';
import VisibilityOutlinedIcon          from '@mui/icons-material/VisibilityOutlined';
import CalendarMonthOutlinedIcon       from '@mui/icons-material/CalendarMonthOutlined';
import CommentOutlinedIcon             from '@mui/icons-material/CommentOutlined';
import VideocamOutlinedIcon            from '@mui/icons-material/VideocamOutlined';
import moment                          from 'moment';

import { StatusBadge }    from '../shared/StatusBadge';
import { ModalidadBadge } from '../shared/ModalidadBadge';
import {
  ESTATUS,
  TIPO_SOLICITUD,
  DOCS_ONLINE_APLICA,
  COLOR_IBERO,
} from '../../constants/examenGrado.constants';

// ─── Constantes de tabs ───────────────────────────────────────────────────────

const TABS = [
  { label: 'Todas',       clave: 'total' },
  { label: 'Confirmadas', clave: 'confirmadas' },
  { label: 'En revisión', clave: 'enRevision' },
  { label: 'Rechazadas',  clave: 'rechazadas' },
];

// ─── Badge tipo solicitud (inline — no va al shared por ser tabla-only) ───────

const TipoBadge = ({ idTipoSolicitud }) => {
  const esIndividual = idTipoSolicitud === TIPO_SOLICITUD.INDIVIDUAL;
  return (
    <Box
      component="span"
      sx={{
        display:         'inline-flex',
        alignItems:      'center',
        px:              1.5,
        py:              0.25,
        borderRadius:    '12px',
        backgroundColor: esIndividual ? '#f0f4ff' : '#fff8e7',
        color:           esIndividual ? '#3451b2' : '#9a6700',
        fontWeight:      600,
        fontSize:        '0.75rem',
        lineHeight:      1.6,
        whiteSpace:      'nowrap',
        border:          `1px solid ${esIndividual ? '#3451b222' : '#9a670022'}`,
      }}
    >
      {esIndividual ? 'Individual' : 'General'}
    </Box>
  );
};

// ─── Celda "Solicitud": folio + ícono docs online + programa + fecha ──────────

const CeldaSolicitud = ({ row }) => (
  <Box sx={{ py: 1, minWidth: 0 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography variant="body2" fontWeight={600} noWrap>
        {row.folio ?? '—'}
      </Typography>
      {DOCS_ONLINE_APLICA(row.idTipoSolicitud, row.idModalidad) && (
        <Tooltip title="Tiene documentos para sesión online" placement="top">
          <VideocamOutlinedIcon
            sx={{ fontSize: '0.95rem', color: '#1a56db', flexShrink: 0 }}
          />
        </Tooltip>
      )}
    </Box>
    {row.programa && (
      <Typography variant="caption" color="text.secondary" display="block" noWrap>
        {row.programa}
      </Typography>
    )}
    {row.fechaExamen && (
      <Typography variant="caption" color="text.secondary">
        {moment(row.fechaExamen).format('DD/MM/YYYY')}
      </Typography>
    )}
  </Box>
);

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * Tabla principal de solicitudes con tabs de filtro.
 *
 * Props:
 *   solicitudes        {array}    – filas ya filtradas por tab y búsqueda
 *   conteoPorEstatus   {object}   – { total, confirmadas, enRevision, rechazadas }
 *   tabActivo          {number}   – índice del tab activo (0–3)
 *   onTabChange        {function} – callback(nuevoIndice)
 *   isAdmin            {boolean}
 *   onVerDetalle       {function} – callback(solicitud)
 *   onCambiarEstatus   {function} – callback(solicitud)  [solo Admin]
 *   onAsignarFecha     {function} – callback(solicitud)  [solo Admin]
 *   onVerObservaciones {function} – callback(solicitud)
 */
export const SolicitudesTable = ({
  solicitudes        = [],
  conteoPorEstatus   = {},
  tabActivo          = 0,
  onTabChange,
  isAdmin            = false,
  onVerDetalle,
  onCambiarEstatus,
  onAsignarFecha,
  onVerObservaciones,
}) => {
  // ── Definición de columnas (memoizada para que DataGrid no pierda el foco) ─

  const columns = useMemo(() => {
    const cols = [
      // ── Solicitud: folio + docs-online + programa + fecha ──────────────────
      {
        field:      'folio',
        headerName: 'Solicitud',
        flex:       2,
        minWidth:   210,
        renderCell: ({ row }) => <CeldaSolicitud row={row} />,
      },

      // ── Tipo: Individual / General ─────────────────────────────────────────
      {
        field:      'idTipoSolicitud',
        headerName: 'Tipo',
        width:      120,
        renderCell: ({ row }) => <TipoBadge idTipoSolicitud={row.idTipoSolicitud} />,
      },

      // ── Modalidad ──────────────────────────────────────────────────────────
      {
        field:      'idModalidad',
        headerName: 'Modalidad',
        width:      120,
        renderCell: ({ row }) => <ModalidadBadge idModalidad={row.idModalidad} />,
      },

      // ── Estatus: clickable (Admin) o badge estático (Coordinador) ──────────
      {
        field:      'idEstatus',
        headerName: 'Estatus',
        width:      135,
        renderCell: ({ row }) =>
          isAdmin ? (
            <Tooltip title="Clic para cambiar estatus" placement="top">
              <Box
                onClick={(e) => { e.stopPropagation(); onCambiarEstatus(row); }}
                sx={{
                  cursor:   'pointer',
                  display:  'inline-flex',
                  '&:hover': { opacity: 0.75 },
                }}
              >
                <StatusBadge idEstatus={row.idEstatus} />
              </Box>
            </Tooltip>
          ) : (
            <StatusBadge idEstatus={row.idEstatus} />
          ),
      },

      // ── Asignar fecha: solo Admin, solo si Confirmada ──────────────────────
      ...(isAdmin
        ? [
            {
              field:      'asignarFecha',
              headerName: 'Asignar fecha',
              width:      130,
              sortable:   false,
              renderCell: ({ row }) =>
                row.idEstatus === ESTATUS.CONFIRMADA ? (
                  <Tooltip title="Asignar fecha de examen">
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); onAsignarFecha(row); }}
                      sx={{ color: COLOR_IBERO }}
                    >
                      <CalendarMonthOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : null,
            },
          ]
        : []),

      // ── Ver detalle: ojito → ModalDetalle ──────────────────────────────────
      {
        field:      'verDetalle',
        headerName: '',
        width:      52,
        sortable:   false,
        renderCell: ({ row }) => (
          <Tooltip title={isAdmin ? 'Ver detalle' : 'Ver detalle (solo lectura)'}>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onVerDetalle(row); }}
              sx={{ color: '#555' }}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },

      // ── Observaciones ──────────────────────────────────────────────────────
      {
        field:      'totalObservaciones',
        headerName: 'Observaciones',
        width:      155,
        sortable:   false,
        renderCell: ({ row }) => {
          const total = row.totalObservaciones ?? 0;

          // Coordinador: solo muestra si hay observaciones
          if (!isAdmin && total === 0) {
            return (
              <Typography variant="caption" color="text.disabled">
                —
              </Typography>
            );
          }

          return (
            <Button
              size="small"
              variant="text"
              startIcon={<CommentOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />}
              onClick={(e) => { e.stopPropagation(); onVerObservaciones(row); }}
              sx={{
                fontSize:      '0.75rem',
                textTransform: 'none',
                color:         total > 0 ? COLOR_IBERO : '#888',
                minWidth:      0,
                px:            0.5,
              }}
            >
              {isAdmin
                ? total > 0 ? `Ver (${total})` : 'Agregar'
                : `Ver (${total})`}
            </Button>
          );
        },
      },
    ];

    return cols;
  }, [isAdmin, onCambiarEstatus, onVerDetalle, onAsignarFecha, onVerObservaciones]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <Tabs
        value={tabActivo}
        onChange={(_, v) => onTabChange(v)}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          px:           2,
          minHeight:    44,
          '& .MuiTab-root': {
            textTransform: 'none',
            minWidth:      90,
            minHeight:     44,
            fontSize:      '0.85rem',
          },
          '& .Mui-selected': { color: `${COLOR_IBERO} !important`, fontWeight: 700 },
          '& .MuiTabs-indicator': { backgroundColor: COLOR_IBERO },
        }}
      >
        {TABS.map((tab, idx) => {
          const count = conteoPorEstatus[tab.clave];
          return (
            <Tab
              key={tab.label}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  {tab.label}
                  {count !== undefined && (
                    <Box
                      component="span"
                      sx={{
                        backgroundColor: tabActivo === idx ? COLOR_IBERO : '#e0e0e0',
                        color:           tabActivo === idx ? 'white'     : '#666',
                        borderRadius:    '10px',
                        px:              0.75,
                        fontSize:        '0.65rem',
                        fontWeight:      700,
                        lineHeight:      1.8,
                        minWidth:        18,
                        textAlign:       'center',
                        display:         'inline-block',
                      }}
                    >
                      {count}
                    </Box>
                  )}
                </Box>
              }
            />
          );
        })}
      </Tabs>

      {/* ── DataGrid ──────────────────────────────────────────────────────── */}
      <DataGrid
        rows={solicitudes}
        columns={columns}
        autoHeight
        getRowHeight={() => 'auto'}
        estimatedRowHeight={72}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
        disableColumnMenu
        localeText={{
          noRowsLabel: 'No hay solicitudes para mostrar',
          MuiTablePagination: {
            labelRowsPerPage:    'Filas por página:',
            labelDisplayedRows: ({ from, to, count }) =>
              `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`,
          },
        }}
        sx={{
          border: 'none',

          // Cabecera
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f5f5f5',
          },
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
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#fafafa',
          },

          // Footer
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #e0e0e0',
          },
        }}
      />
    </Box>
  );
};
