// ─── Catálogos de IDs ────────────────────────────────────────────────────────

export const ESTATUS = {
  EN_REVISION: 1,
  CONFIRMADA:  2,
  RECHAZADA:   3,
};

export const MODALIDAD = {
  PRESENCIAL: 1,
  VIRTUAL:    2,
  HIBRIDA:    3,
};

export const TIPO_SOLICITUD = {
  INDIVIDUAL: 1,
  GENERAL:    2,
};

// IDs de todos los tipos de documento — confirmar 1-6 con backend
export const TIPO_DOCUMENTO = {
  PLANTA_SINODALES:    1,
  VOCAL_ACADEMICO_1:   2,
  VOCAL_ACADEMICO_2:   3,
  VOCAL_ACADEMICO_3:   4,
  RECIBO_BIBLIOTECA:   5,
  FOTOGRAFIA:          6,
  ACTA_VIRTUAL:        7,
  MENCION_HONORIFICA:  8,
  KARDEX_CALIFICACION: 9,
  PROTESTA:            10,
};

// IDs de tipo de documento que corresponden a docs de sesión online
export const TIPO_DOCUMENTO_ONLINE = [7, 8, 9, 10];
// 7  = acta_virtual
// 8  = mencion_honorifica
// 9  = kardex_calificacion
// 10 = protesta

// ─── Perfiles ────────────────────────────────────────────────────────────────

export const PROFILE_ID = {
  ADMIN:       440,
  COORDINADOR: 441,
};

// ─── Regla: documentos online aplican cuando... ──────────────────────────────

export const DOCS_ONLINE_APLICA = (idTipoSolicitud, idModalidad) =>
  idTipoSolicitud === TIPO_SOLICITUD.INDIVIDUAL &&
  (idModalidad === MODALIDAD.VIRTUAL || idModalidad === MODALIDAD.HIBRIDA);

// ─── Colores de estatus ───────────────────────────────────────────────────────

export const ESTATUS_COLORS = {
  [ESTATUS.EN_REVISION]: { bg: '#fff3e0', text: '#c56000' },
  [ESTATUS.CONFIRMADA]:  { bg: '#e6f4ea', text: '#2e7d32' },
  [ESTATUS.RECHAZADA]:   { bg: '#fce8e8', text: '#8B0000' },
};

export const ESTATUS_LABEL = {
  [ESTATUS.EN_REVISION]: 'En revisión',
  [ESTATUS.CONFIRMADA]:  'Confirmada',
  [ESTATUS.RECHAZADA]:   'Rechazada',
};

// ─── Colores de modalidad ─────────────────────────────────────────────────────

export const MODALIDAD_COLORS = {
  [MODALIDAD.PRESENCIAL]: { bg: '#f0f0f0', text: '#666666' },
  [MODALIDAD.VIRTUAL]:    { bg: '#e8f0fe', text: '#1a56db' },
  [MODALIDAD.HIBRIDA]:    { bg: '#f3e8ff', text: '#6b21a8' },
};

export const MODALIDAD_LABEL = {
  [MODALIDAD.PRESENCIAL]: 'Presencial',
  [MODALIDAD.VIRTUAL]:    'Virtual',
  [MODALIDAD.HIBRIDA]:    'Híbrida',
};

// ─── Color institucional ──────────────────────────────────────────────────────

export const COLOR_IBERO = '#8B0000';

// ─── Margen de días hábiles que dispara el aviso visual ──────────────────────

export const MARGEN_DIAS_HABILES = [10, 11];
