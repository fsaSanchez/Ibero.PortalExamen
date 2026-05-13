import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Stack,
  Skeleton,
} from '@mui/material';
import ContentCopyIcon        from '@mui/icons-material/ContentCopy';
import CheckIcon              from '@mui/icons-material/Check';
import SaveOutlinedIcon       from '@mui/icons-material/SaveOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

import { useApiData }          from '../../../../hooks/useApiData';
import {
  TIPO_DOCUMENTO_ONLINE,
  COLOR_IBERO,
} from '../../constants/examenGrado.constants';

// ─── Etiquetas de los tipos de documento online ───────────────────────────────

const TIPO_ONLINE_LABEL = {
  7:  'Acta de examen virtual',
  8:  'Mención honorífica',
  9:  'Kárdex de calificaciones',
  10: 'Protesta de ley',
};

// ─── Subcomponente: copy ID de plantilla ──────────────────────────────────────

const CopiadorId = ({ value }) => {
  const [copiado, setCopiado] = useState(false);

  const handleCopiar = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
        {value}
      </Typography>
      <Tooltip title={copiado ? 'Copiado' : 'Copiar ID'}>
        <IconButton size="small" onClick={handleCopiar} sx={{ p: 0.25 }}>
          {copiado
            ? <CheckIcon sx={{ fontSize: '0.85rem', color: '#2e7d32' }} />
            : <ContentCopyIcon sx={{ fontSize: '0.85rem', color: 'text.disabled' }} />
          }
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * Sección de documentos para sesión virtual/híbrida dentro de ModalDetalle.
 *
 * Admin       → ve si el coordinador ya subió el doc (chip Subido/Pendiente + ID).
 * Coordinador → ve el ID de la plantilla para referencia y puede ingresar
 *               el ID Laserfiche del documento completado (POST si nuevo, PUT si ya existe).
 *
 * Props:
 *   idSolicitud {number}  – necesario para GET/POST/PUT de SolicitudDocumento
 *   isAdmin     {boolean}
 */
export const DocumentosOnline = ({ idSolicitud, isAdmin }) => {
  const { fetchData, sendData } = useApiData();

  const [cargando,   setCargando]   = useState(false);
  // plantillas[idTipoDocumento] = { id, idLaserfiche, ... } | null
  const [plantillas, setPlantillas] = useState({});
  // docsSubidos[idTipoDocumento] = { id, idLaserfiche, ... } | undefined
  const [docsSubidos, setDocsSubidos] = useState({});
  // inputs de texto solo visibles para Coordinador
  const [inputs,     setInputs]     = useState(
    () => Object.fromEntries(TIPO_DOCUMENTO_ONLINE.map((id) => [id, ''])),
  );
  const [guardando,  setGuardando]  = useState({});

  // ── Carga inicial ────────────────────────────────────────────────────────────

  const cargar = useCallback(async () => {
    if (!idSolicitud) return;
    setCargando(true);
    try {
      const [docs, ...plantillaResults] = await Promise.all([
        fetchData(
          `SolicitudDocumento/GetBySolicitud/${idSolicitud}`,
          {},
          'Cargando documentos…',
        ),
        ...TIPO_DOCUMENTO_ONLINE.map((id) =>
          fetchData(`PlantillaDocumento/GetByTipo/${id}`, {}, '').catch(() => null),
        ),
      ]);

      // Index plantillas by idTipoDocumento
      const plantillasMap = {};
      TIPO_DOCUMENTO_ONLINE.forEach((id, i) => {
        plantillasMap[id] = plantillaResults[i] ?? null;
      });
      setPlantillas(plantillasMap);

      // Index docs subidos (solo tipos online)
      const docsMap = {};
      (docs ?? [])
        .filter((d) => TIPO_DOCUMENTO_ONLINE.includes(d.idTipoDocumento))
        .forEach((d) => { docsMap[d.idTipoDocumento] = d; });
      setDocsSubidos(docsMap);

      // Pre-llenar inputs del Coordinador con valor ya guardado
      if (!isAdmin) {
        setInputs(() => {
          const next = Object.fromEntries(TIPO_DOCUMENTO_ONLINE.map((id) => [id, '']));
          TIPO_DOCUMENTO_ONLINE.forEach((id) => {
            if (docsMap[id]?.idLaserfiche) next[id] = docsMap[id].idLaserfiche;
          });
          return next;
        });
      }
    } finally {
      setCargando(false);
    }
  }, [idSolicitud, fetchData, isAdmin]);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Guardar (Coordinador) ─────────────────────────────────────────────────

  const handleGuardar = async (idTipoDocumento) => {
    const valor = inputs[idTipoDocumento]?.trim();
    if (!valor) return;

    setGuardando((prev) => ({ ...prev, [idTipoDocumento]: true }));
    try {
      const docExistente = docsSubidos[idTipoDocumento];
      if (docExistente) {
        await sendData(
          `SolicitudDocumento/${docExistente.id}`,
          'put',
          { idLaserfiche: valor },
          {},
          'Actualizando documento…',
        );
      } else {
        await sendData(
          'SolicitudDocumento',
          'post',
          { idSolicitud, idTipoDocumento, idLaserfiche: valor },
          {},
          'Guardando documento…',
        );
      }
      await cargar();
    } finally {
      setGuardando((prev) => ({ ...prev, [idTipoDocumento]: false }));
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  if (cargando) {
    return (
      <Stack spacing={1.5}>
        {TIPO_DOCUMENTO_ONLINE.map((id) => (
          <Skeleton key={id} variant="rounded" height={76} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      {TIPO_DOCUMENTO_ONLINE.map((idTipo) => {
        const plantilla = plantillas[idTipo];
        const docSubido = docsSubidos[idTipo];

        return (
          <Box
            key={idTipo}
            sx={{
              p:               2,
              border:          '1px solid #e8e8e8',
              borderRadius:    2,
              backgroundColor: '#fafafa',
            }}
          >
            {/* Tipo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <DescriptionOutlinedIcon sx={{ fontSize: '1rem', color: COLOR_IBERO }} />
              <Typography variant="body2" fontWeight={700}>
                {TIPO_ONLINE_LABEL[idTipo]}
              </Typography>
            </Box>

            <Box
              sx={{
                display:             'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap:                 2,
              }}
            >
              {/* Plantilla */}
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{
                    display:       'block',
                    mb:            0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Plantilla
                </Typography>
                {plantilla?.idLaserfiche ? (
                  <CopiadorId value={plantilla.idLaserfiche} />
                ) : (
                  <Typography variant="caption" color="text.disabled" fontStyle="italic">
                    Sin plantilla disponible
                  </Typography>
                )}
              </Box>

              {/* Doc subido */}
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{
                    display:       'block',
                    mb:            0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Documento subido
                </Typography>

                {isAdmin ? (
                  /* Admin: solo lectura */
                  docSubido?.idLaserfiche ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label="Subido"
                        size="small"
                        sx={{
                          backgroundColor: '#e6f4ea',
                          color:           '#2e7d32',
                          fontWeight:      700,
                          height:          20,
                          fontSize:        '0.7rem',
                        }}
                      />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                        {docSubido.idLaserfiche}
                      </Typography>
                    </Box>
                  ) : (
                    <Chip
                      label="Pendiente"
                      size="small"
                      sx={{
                        backgroundColor: '#fff3e0',
                        color:           '#c56000',
                        fontWeight:      700,
                        height:          20,
                        fontSize:        '0.7rem',
                      }}
                    />
                  )
                ) : (
                  /* Coordinador: ingresar idLaserfiche */
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                      size="small"
                      placeholder="ID Laserfiche"
                      value={inputs[idTipo]}
                      onChange={(e) =>
                        setInputs((prev) => ({ ...prev, [idTipo]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGuardar(idTipo);
                      }}
                      disabled={guardando[idTipo]}
                      sx={{ flex: 1, '& input': { fontFamily: 'monospace', fontSize: '0.82rem' } }}
                    />
                    <Tooltip title={docSubido ? 'Actualizar' : 'Guardar'}>
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleGuardar(idTipo)}
                          disabled={!inputs[idTipo]?.trim() || guardando[idTipo]}
                          sx={{
                            backgroundColor:  COLOR_IBERO,
                            color:            'white',
                            borderRadius:     1,
                            p:                0.75,
                            '&:hover':        { backgroundColor: '#6a0000' },
                            '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#aaa' },
                          }}
                        >
                          {guardando[idTipo]
                            ? <CircularProgress size={14} color="inherit" />
                            : <SaveOutlinedIcon sx={{ fontSize: '1rem' }} />
                          }
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
};
