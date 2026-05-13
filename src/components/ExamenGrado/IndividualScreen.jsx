import React from 'react';
import { useNavigate }    from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import CalendarTodayOutlinedIcon  from '@mui/icons-material/CalendarTodayOutlined';
import PersonOutlineIcon           from '@mui/icons-material/PersonOutline';
import DescriptionOutlinedIcon     from '@mui/icons-material/DescriptionOutlined';
import PhotoOutlinedIcon           from '@mui/icons-material/PhotoOutlined';
import SendOutlinedIcon            from '@mui/icons-material/SendOutlined';
import { Formik, Form }           from 'formik';
import * as Yup                   from 'yup';
import Swal                       from 'sweetalert2';

import { useCatalogos }           from './hooks/useCatalogos';
import { useSolicitudes }         from './hooks/useSolicitudes';
import { useDiasHabiles }         from './hooks/useDiasHabiles';
import { InfoGeneralExamen }      from './components/formularios/InfoGeneralExamen';
import {
  TIPO_SOLICITUD,
  TIPO_DOCUMENTO,
  COLOR_IBERO,
} from './constants/examenGrado.constants';

// ─── Sección card ─────────────────────────────────────────────────────────────

const SectionCard = ({ title, icon: Icon, children }) => (
  <Paper
    elevation={0}
    sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', mb: 3 }}
  >
    <Box
      sx={{
        px:              3,
        py:              1.75,
        display:         'flex',
        alignItems:      'center',
        gap:             1.25,
        backgroundColor: '#fafafa',
        borderBottom:    '1px solid #e8e8e8',
      }}
    >
      {Icon && <Icon sx={{ fontSize: '1.1rem', color: COLOR_IBERO }} />}
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: 3 }}>{children}</Box>
  </Paper>
);

// ─── Fila de documento ────────────────────────────────────────────────────────

const DocField = ({ name, label, required, formik }) => (
  <TextField
    name={name}
    label={label}
    value={formik.values[name]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched[name] && Boolean(formik.errors[name])}
    helperText={
      (formik.touched[name] && formik.errors[name]) ||
      (!required && 'Opcional')
    }
    size="small"
    fullWidth
    placeholder="ID Laserfiche"
    required={required}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <DescriptionOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      },
    }}
  />
);

// ─── Schema de validación ─────────────────────────────────────────────────────

const validationSchema = Yup.object({
  // Sección 1
  fechaExamen:  Yup.string().required('La fecha del examen es obligatoria'),
  horaExamen:   Yup.string().required('La hora del examen es obligatoria'),
  idModalidad:  Yup.string()
    .notOneOf(['', '0'], 'Selecciona una modalidad')
    .required('La modalidad es obligatoria'),
  lugar: Yup.string()
    .trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(200, 'Máximo 200 caracteres')
    .required('El lugar es obligatorio'),

  // Sección 2
  numeroCuenta:   Yup.string().trim().required('El número de cuenta es obligatorio'),
  nombreAlumno:   Yup.string().trim().required('El nombre del alumno es obligatorio'),
  programaAlumno: Yup.string().trim().required('El programa es obligatorio'),

  // Sección 3 — documentos obligatorios
  docPlantaSinodales:  Yup.string().trim().required('Requerido'),
  docVocalAcademico1:  Yup.string().trim().required('Requerido'),
  docVocalAcademico2:  Yup.string().trim().required('Requerido'),
  docVocalAcademico3:  Yup.string().trim().required('Requerido'),
  docReciboBiblioteca: Yup.string().trim().required('Requerido'),

  // Sección 4 — fotografía opcional
  docFotografia: Yup.string().trim(),
});

const initialValues = {
  fechaExamen:         '',
  horaExamen:          '',
  idModalidad:         '',
  lugar:               '',
  numeroCuenta:        '',
  nombreAlumno:        '',
  programaAlumno:      '',
  docPlantaSinodales:  '',
  docVocalAcademico1:  '',
  docVocalAcademico2:  '',
  docVocalAcademico3:  '',
  docReciboBiblioteca: '',
  docFotografia:       '',
};

// ─── Screen principal ─────────────────────────────────────────────────────────

export default function IndividualScreen() {
  const navigate = useNavigate();

  const { modalidades }                           = useCatalogos();
  const { crearSolicitud, agregarAlumno, registrarDocumento } = useSolicitudes();
  const { diasHabiles, enMargenCritico, calcular, limpiar }   = useDiasHabiles();

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Advertencia especial si estamos en margen crítico (10 u 11 días hábiles)
      if (enMargenCritico) {
        const { isConfirmed } = await Swal.fire({
          title:             'Margen de tiempo ajustado',
          html: `
            La fecha del examen está a <strong>${diasHabiles} días hábiles</strong>
            de hoy, lo que entra en el margen mínimo permitido.<br/><br/>
            Verifica con la coordinación que el trámite puede procesarse en este tiempo.
          `,
          icon:              'warning',
          showCancelButton:  true,
          confirmButtonColor: COLOR_IBERO,
          confirmButtonText: 'Enviar de todas formas',
          cancelButtonText:  'Revisar fecha',
          reverseButtons:    true,
        });
        if (!isConfirmed) return;
      }

      // 1 — Crear solicitud
      const solicitudResult = await crearSolicitud({
        idTipoSolicitud: TIPO_SOLICITUD.INDIVIDUAL,
        fechaExamen:     values.fechaExamen,
        horaExamen:      values.horaExamen,
        idModalidad:     Number(values.idModalidad),
        lugar:           values.lugar.trim(),
      });
      if (!solicitudResult) return;

      const idSolicitud = solicitudResult.id ?? solicitudResult;

      // 2 — Agregar alumno
      await agregarAlumno({
        idSolicitud,
        numeroCuenta: values.numeroCuenta.trim(),
        nombre:       values.nombreAlumno.trim(),
        programa:     values.programaAlumno.trim(),
      });

      // 3 — Registrar documentos obligatorios
      const docs = [
        { idTipoDocumento: TIPO_DOCUMENTO.PLANTA_SINODALES,  idLaserfiche: values.docPlantaSinodales },
        { idTipoDocumento: TIPO_DOCUMENTO.VOCAL_ACADEMICO_1, idLaserfiche: values.docVocalAcademico1 },
        { idTipoDocumento: TIPO_DOCUMENTO.VOCAL_ACADEMICO_2, idLaserfiche: values.docVocalAcademico2 },
        { idTipoDocumento: TIPO_DOCUMENTO.VOCAL_ACADEMICO_3, idLaserfiche: values.docVocalAcademico3 },
        { idTipoDocumento: TIPO_DOCUMENTO.RECIBO_BIBLIOTECA,  idLaserfiche: values.docReciboBiblioteca },
      ];

      // Fotografía solo si se ingresó
      if (values.docFotografia.trim()) {
        docs.push({
          idTipoDocumento: TIPO_DOCUMENTO.FOTOGRAFIA,
          idLaserfiche:    values.docFotografia.trim(),
        });
      }

      for (const doc of docs) {
        await registrarDocumento({ idSolicitud, ...doc });
      }

      // 4 — Éxito: limpiar y volver
      resetForm();
      limpiar();
      navigate(-1);

    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 820, mx: 'auto' }}>

      {/* Encabezado */}
      <Typography variant="h5" fontWeight={700} sx={{ color: COLOR_IBERO, mb: 0.5 }}>
        Nueva solicitud — Individual
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Completa todos los campos obligatorios para registrar la solicitud de examen de grado.
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange={false}
      >
        {(formik) => (
          <Form noValidate>

            {/* ── Sección 1: Información general ───────────────────────── */}
            <SectionCard title="Información general del examen" icon={CalendarTodayOutlinedIcon}>
              <InfoGeneralExamen
                diasHabiles={diasHabiles}
                onFechaChange={(fecha) => calcular(fecha)}
                modalidades={modalidades}
                conModalidad
              />
            </SectionCard>

            {/* ── Sección 2: Datos del alumno ───────────────────────────── */}
            <SectionCard title="Datos del alumno" icon={PersonOutlineIcon}>
              <Box
                sx={{
                  display:             'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap:                 2.5,
                }}
              >
                <TextField
                  name="numeroCuenta"
                  label="Número de cuenta"
                  value={formik.values.numeroCuenta}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.numeroCuenta && Boolean(formik.errors.numeroCuenta)}
                  helperText={formik.touched.numeroCuenta && formik.errors.numeroCuenta}
                  size="small"
                  fullWidth
                  required
                  placeholder="Ej. 123456789"
                />

                <TextField
                  name="nombreAlumno"
                  label="Nombre completo"
                  value={formik.values.nombreAlumno}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nombreAlumno && Boolean(formik.errors.nombreAlumno)}
                  helperText={formik.touched.nombreAlumno && formik.errors.nombreAlumno}
                  size="small"
                  fullWidth
                  required
                  sx={{ gridColumn: { xs: '1', sm: '2' } }}
                />

                <TextField
                  name="programaAlumno"
                  label="Programa académico"
                  value={formik.values.programaAlumno}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.programaAlumno && Boolean(formik.errors.programaAlumno)}
                  helperText={formik.touched.programaAlumno && formik.errors.programaAlumno}
                  size="small"
                  fullWidth
                  required
                  sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
                />
              </Box>
            </SectionCard>

            {/* ── Sección 3: Documentos obligatorios ───────────────────── */}
            <SectionCard title="Documentos obligatorios" icon={DescriptionOutlinedIcon}>
              <Alert severity="info" sx={{ mb: 2.5, fontSize: '0.82rem', borderRadius: 1.5 }}>
                Ingresa el <strong>ID Laserfiche</strong> de cada documento ya cargado en el sistema
                documental.
              </Alert>

              <Box
                sx={{
                  display:             'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap:                 2.5,
                }}
              >
                <DocField
                  name="docPlantaSinodales"
                  label="Planta de sinodales"
                  required
                  formik={formik}
                />
                <DocField
                  name="docVocalAcademico1"
                  label="Vocal Académico 1"
                  required
                  formik={formik}
                />
                <DocField
                  name="docVocalAcademico2"
                  label="Vocal Académico 2"
                  required
                  formik={formik}
                />
                <DocField
                  name="docVocalAcademico3"
                  label="Vocal Académico 3"
                  required
                  formik={formik}
                />
                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <DocField
                    name="docReciboBiblioteca"
                    label="Recibo de biblioteca"
                    required
                    formik={formik}
                  />
                </Box>
              </Box>
            </SectionCard>

            {/* ── Sección 4: Fotografía digital (opcional) ─────────────── */}
            <SectionCard title="Fotografía digital" icon={PhotoOutlinedIcon}>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Este documento es opcional. Solo inclúyelo si ya fue cargado en Laserfiche.
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                <DocField
                  name="docFotografia"
                  label="Fotografía digital"
                  required={false}
                  formik={formik}
                />
              </Box>
            </SectionCard>

            {/* ── Errores de validación al intentar enviar ──────────────── */}
            {formik.submitCount > 0 && Object.keys(formik.errors).length > 0 && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
                Revisa los campos marcados en rojo antes de enviar.
              </Alert>
            )}

            {/* ── Botones de acción ─────────────────────────────────────── */}
            <Box
              sx={{
                display:        'flex',
                justifyContent: 'flex-end',
                gap:            2,
                pb:             2,
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate(-1)}
                disabled={formik.isSubmitting}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
                startIcon={
                  formik.isSubmitting
                    ? <CircularProgress size={16} color="inherit" />
                    : <SendOutlinedIcon fontSize="small" />
                }
                sx={{
                  backgroundColor:  COLOR_IBERO,
                  '&:hover':        { backgroundColor: '#6a0000' },
                  '&.Mui-disabled': { backgroundColor: '#e0e0e0' },
                  minWidth:         160,
                }}
              >
                {formik.isSubmitting ? 'Enviando…' : 'Enviar solicitud'}
              </Button>
            </Box>

          </Form>
        )}
      </Formik>
    </Box>
  );
}
