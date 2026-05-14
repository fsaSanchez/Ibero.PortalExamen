import React, { useEffect, useState } from 'react';
import { useNavigate }        from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SchoolOutlinedIcon        from '@mui/icons-material/SchoolOutlined';
import GroupOutlinedIcon         from '@mui/icons-material/GroupOutlined';
import PersonAddOutlinedIcon     from '@mui/icons-material/PersonAddOutlined';
import DeleteOutlineIcon         from '@mui/icons-material/DeleteOutline';
import DescriptionOutlinedIcon   from '@mui/icons-material/DescriptionOutlined';
import ChevronRightIcon          from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon           from '@mui/icons-material/ChevronLeft';
import SendOutlinedIcon          from '@mui/icons-material/SendOutlined';
import CheckCircleOutlineIcon    from '@mui/icons-material/CheckCircleOutline';
import { Formik, Form, FieldArray, getIn, useFormikContext } from 'formik';
import * as Yup                  from 'yup';
import Swal                      from 'sweetalert2';
import moment                    from 'moment';
import 'moment/locale/es';

import { useSolicitudes }     from './hooks/useSolicitudes';
import { useDiasHabiles }     from './hooks/useDiasHabiles';
import { InfoGeneralExamen }  from './components/formularios/InfoGeneralExamen';
import { MargenFechaNotice }  from './components/shared';
import {
  TIPO_SOLICITUD,
  TIPO_DOCUMENTO,
  COLOR_IBERO,
} from './constants/examenGrado.constants';

moment.locale('es');

// ─── Constantes ───────────────────────────────────────────────────────────────

const ALUMNO_VACIO = { numeroCuenta: '', nombre: '', programa: '' };

// ─── SectionCard ─────────────────────────────────────────────────────────────

const SectionCard = ({ title, icon: Icon, children, action }) => (
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
        justifyContent:  'space-between',
        backgroundColor: '#fafafa',
        borderBottom:    '1px solid #e8e8e8',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        {Icon && <Icon sx={{ fontSize: '1.1rem', color: COLOR_IBERO }} />}
        <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
      </Box>
      {action}
    </Box>
    <Box sx={{ p: 3 }}>{children}</Box>
  </Paper>
);

// ─── AlumnoCard ───────────────────────────────────────────────────────────────

const AlumnoCard = ({ index, canRemove, onRemove }) => {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext();

  // Acceso seguro a valores/errores anidados
  const base = `alumnos[${index}]`;
  const val  = (f) => getIn(values,  `${base}.${f}`) ?? '';
  const err  = (f) => getIn(touched, `${base}.${f}`) && getIn(errors, `${base}.${f}`);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow:     'hidden',
        mb:           2,
        borderColor:  '#e0e0e0',
      }}
    >
      {/* Cabecera de la card */}
      <Box
        sx={{
          px:              2,
          py:              1,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          backgroundColor: '#f9f9f9',
          borderBottom:    '1px solid #efefef',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width:           26,
              height:          26,
              borderRadius:    '50%',
              backgroundColor: COLOR_IBERO,
              color:           'white',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              fontSize:        '0.7rem',
              fontWeight:      700,
              flexShrink:      0,
            }}
          >
            {index + 1}
          </Box>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Alumno {index + 1}
          </Typography>
        </Box>

        {canRemove && (
          <Tooltip title="Eliminar alumno">
            <IconButton
              size="small"
              onClick={onRemove}
              sx={{ color: COLOR_IBERO, '&:hover': { backgroundColor: '#fce8e8' } }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Campos */}
      <Box
        sx={{
          p:                   2,
          display:             'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap:                 2,
        }}
      >
        <TextField
          name={`${base}.numeroCuenta`}
          label="Número de cuenta"
          value={val('numeroCuenta')}
          onChange={handleChange}
          onBlur={handleBlur}
          error={Boolean(err('numeroCuenta'))}
          helperText={err('numeroCuenta')}
          size="small"
          fullWidth
          required
          placeholder="Ej. 123456789"
        />

        <TextField
          name={`${base}.nombre`}
          label="Nombre completo"
          value={val('nombre')}
          onChange={handleChange}
          onBlur={handleBlur}
          error={Boolean(err('nombre'))}
          helperText={err('nombre')}
          size="small"
          fullWidth
          required
        />

        <TextField
          name={`${base}.programa`}
          label="Programa académico"
          value={val('programa')}
          onChange={handleChange}
          onBlur={handleBlur}
          error={Boolean(err('programa'))}
          helperText={err('programa')}
          size="small"
          fullWidth
          required
          sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
        />
      </Box>
    </Paper>
  );
};

// ─── Vista de confirmación ────────────────────────────────────────────────────

const InfoRow = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      fontWeight={700}
      color="text.secondary"
      sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 0.25 }}
    >
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>{value || '—'}</Typography>
  </Box>
);

const ConfirmacionView = ({ values, diasHabiles }) => (
  <Box>
    {/* Aviso margen crítico si aplica */}
    <MargenFechaNotice diasHabiles={diasHabiles} sx={{ mb: 2.5 }} />

    {/* Info del examen */}
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
      <Box sx={{ px: 3, py: 1.75, backgroundColor: '#fafafa', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <CalendarTodayOutlinedIcon sx={{ fontSize: '1.1rem', color: COLOR_IBERO }} />
        <Typography variant="subtitle1" fontWeight={700}>Información del examen</Typography>
      </Box>
      <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
        <InfoRow label="Fecha"    value={values.fechaExamen ? moment(values.fechaExamen).format('DD [de] MMMM YYYY') : ''} />
        <InfoRow label="Hora"     value={values.horaExamen} />
        <InfoRow label="Programa" value={values.programa} />
        <InfoRow label="Lugar"    value={values.lugar} />
        <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
          <InfoRow
            label="Planta de sinodales (ID Laserfiche)"
            value={values.plantaSinodales}
          />
        </Box>
      </Box>
    </Paper>

    {/* Lista de alumnos */}
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
      <Box sx={{ px: 3, py: 1.75, backgroundColor: '#fafafa', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <GroupOutlinedIcon sx={{ fontSize: '1.1rem', color: COLOR_IBERO }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Alumnos participantes
          </Typography>
        </Box>
        <Box
          component="span"
          sx={{
            backgroundColor: COLOR_IBERO,
            color:           'white',
            borderRadius:    '10px',
            px:              1,
            fontSize:        '0.72rem',
            fontWeight:      700,
            lineHeight:      1.8,
          }}
        >
          {values.alumnos.length}
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {values.alumnos.map((a, i) => (
          <Box
            key={i}
            sx={{
              display:      'flex',
              alignItems:   'flex-start',
              gap:          1.5,
              py:           1.5,
              borderBottom: i < values.alumnos.length - 1 ? '1px solid #f5f5f5' : 'none',
            }}
          >
            {/* Número */}
            <Box
              sx={{
                width:           26,
                height:          26,
                minWidth:        26,
                borderRadius:    '50%',
                border:          `1px solid ${COLOR_IBERO}`,
                color:           COLOR_IBERO,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                fontSize:        '0.7rem',
                fontWeight:      700,
                mt:              0.25,
              }}
            >
              {i + 1}
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={600}>{a.nombre}</Typography>
              <Typography variant="caption" color="text.secondary">
                Cuenta: {a.numeroCuenta}
                {a.programa ? ` · ${a.programa}` : ''}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  </Box>
);

// ─── Esquema de validación ────────────────────────────────────────────────────

const alumnoSchema = Yup.object({
  numeroCuenta: Yup.string().trim().required('Requerido'),
  nombre:       Yup.string().trim().required('Requerido'),
  programa:     Yup.string().trim().required('Requerido'),
});

const validationSchema = Yup.object({
  fechaExamen:     Yup.string().required('La fecha del examen es obligatoria'),
  horaExamen:      Yup.string().required('La hora del examen es obligatoria'),
  lugar:           Yup.string().trim().min(3, 'Mínimo 3 caracteres').max(200).required('El lugar es obligatorio'),
  programa:        Yup.string().trim().required('El programa es obligatorio'),
  plantaSinodales: Yup.string().trim().required('El ID Laserfiche es obligatorio'),
  alumnos:         Yup.array()
    .of(alumnoSchema)
    .min(1, 'Agrega al menos un alumno participante')
    .required(),
});

const initialValues = {
  fechaExamen:     '',
  horaExamen:      '',
  lugar:           '',
  programa:        '',
  plantaSinodales: '',
  alumnos:         [{ ...ALUMNO_VACIO }],
};

// ─── Screen principal ─────────────────────────────────────────────────────────

export default function GeneralScreen() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState('formulario');

  const { crearSolicitud, agregarAlumno, registrarDocumento } = useSolicitudes();
  const { diasHabiles, enMargenCritico, calcular, limpiar }   = useDiasHabiles();

  // Scroll arriba al entrar en confirmación
  useEffect(() => {
    if (paso === 'confirmacion') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [paso]);

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Paso 1: validación completa pasada → pasar a confirmación
    if (paso === 'formulario') {
      setPaso('confirmacion');
      setSubmitting(false);
      return;
    }

    // Paso 2: confirmar y enviar al backend
    try {
      // Advertencia si margen crítico
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

      // 1 — Crear solicitud (tipo General, sin idModalidad)
      const solicitudResult = await crearSolicitud({
        idTipoSolicitud: TIPO_SOLICITUD.GENERAL,
        fechaExamen:     values.fechaExamen,
        horaExamen:      values.horaExamen,
        lugar:           values.lugar.trim(),
        programa:        values.programa.trim(),
      });
      if (!solicitudResult) return;

      const idSolicitud = solicitudResult.id ?? solicitudResult;

      // 2 — Agregar cada alumno de la lista
      for (const alumno of values.alumnos) {
        await agregarAlumno({
          idSolicitud,
          numeroCuenta: alumno.numeroCuenta.trim(),
          nombre:       alumno.nombre.trim(),
          programa:     alumno.programa.trim(),
        });
      }

      // 3 — Registrar planta de sinodales
      await registrarDocumento({
        idSolicitud,
        idTipoDocumento: TIPO_DOCUMENTO.PLANTA_SINODALES,
        idLaserfiche:    values.plantaSinodales.trim(),
      });

      // Éxito
      resetForm();
      limpiar();
      setPaso('formulario');
      navigate(-1);

    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: '100%', px: 3, py: 3 }}>

      {/* Encabezado dinámico según paso */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: COLOR_IBERO, mb: 0.5 }}>
          {paso === 'formulario'
            ? 'Nueva solicitud — General'
            : 'Confirmar solicitud'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {paso === 'formulario'
            ? 'Completa la información del examen y la lista de alumnos participantes.'
            : 'Revisa los datos antes de enviar. Puedes volver a editar si necesitas corregir algo.'}
        </Typography>

        {/* Indicador de pasos */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
          {['Formulario', 'Confirmación'].map((label, i) => {
            const activo   = (i === 0 && paso === 'formulario') || (i === 1 && paso === 'confirmacion');
            const completado = i === 0 && paso === 'confirmacion';
            return (
              <React.Fragment key={label}>
                {i > 0 && (
                  <Box sx={{ width: 24, height: 1, backgroundColor: completado ? COLOR_IBERO : '#ddd' }} />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width:           20,
                      height:          20,
                      borderRadius:    '50%',
                      backgroundColor: activo || completado ? COLOR_IBERO : '#e0e0e0',
                      color:           activo || completado ? 'white'     : '#999',
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                      fontSize:        '0.65rem',
                      fontWeight:      700,
                    }}
                  >
                    {completado ? '✓' : i + 1}
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={activo ? 700 : 400}
                    color={activo ? COLOR_IBERO : 'text.secondary'}
                  >
                    {label}
                  </Typography>
                </Box>
              </React.Fragment>
            );
          })}
        </Box>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange={false}
      >
        {(formik) => (
          <Form noValidate>

            {/* ══════════════════════════════════════════════════════════════
                PASO 1 — FORMULARIO
            ══════════════════════════════════════════════════════════════ */}
            {paso === 'formulario' && (
              <>
                {/* Sección 1: Info general (sin modalidad) */}
                <SectionCard title="Información general del examen" icon={CalendarTodayOutlinedIcon}>
                  <InfoGeneralExamen
                    diasHabiles={diasHabiles}
                    onFechaChange={(fecha) => calcular(fecha)}
                    conModalidad={false}
                  />
                </SectionCard>

                {/* Sección 2: Programa y planta de sinodales */}
                <SectionCard title="Información del examen" icon={SchoolOutlinedIcon}>
                  <Box
                    sx={{
                      display:             'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap:                 2.5,
                    }}
                  >
                    {/* Programa académico */}
                    <TextField
                      name="programa"
                      label="Programa académico"
                      value={formik.values.programa}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.programa && Boolean(formik.errors.programa)}
                      helperText={formik.touched.programa && formik.errors.programa}
                      size="small"
                      fullWidth
                      required
                      placeholder="Ej. Maestría en Administración"
                    />

                    {/* Planta de sinodales */}
                    <TextField
                      name="plantaSinodales"
                      label="Planta de sinodales"
                      value={formik.values.plantaSinodales}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.plantaSinodales && Boolean(formik.errors.plantaSinodales)}
                      helperText={formik.touched.plantaSinodales && formik.errors.plantaSinodales}
                      size="small"
                      fullWidth
                      required
                      placeholder="ID Laserfiche"
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
                  </Box>
                </SectionCard>

                {/* Sección 3: Alumnos participantes */}
                <SectionCard
                  title={`Alumnos participantes (${formik.values.alumnos.length})`}
                  icon={GroupOutlinedIcon}
                >
                  <FieldArray name="alumnos">
                    {({ push, remove }) => (
                      <>
                        {/* Cards de alumnos */}
                        {formik.values.alumnos.map((_, idx) => (
                          <AlumnoCard
                            key={idx}
                            index={idx}
                            canRemove={formik.values.alumnos.length > 1}
                            onRemove={() => remove(idx)}
                          />
                        ))}

                        {/* Error array-level (mínimo 1) */}
                        {formik.submitCount > 0 && typeof formik.errors.alumnos === 'string' && (
                          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
                            {formik.errors.alumnos}
                          </Alert>
                        )}

                        {/* Botón agregar */}
                        <Button
                          type="button"
                          variant="outlined"
                          size="small"
                          startIcon={<PersonAddOutlinedIcon />}
                          onClick={() => push({ ...ALUMNO_VACIO })}
                          sx={{
                            borderStyle:  'dashed',
                            borderColor:  '#bbb',
                            color:        '#555',
                            borderRadius: 2,
                            '&:hover': {
                              borderStyle:     'dashed',
                              borderColor:     COLOR_IBERO,
                              color:           COLOR_IBERO,
                              backgroundColor: '#fce8e8',
                            },
                          }}
                        >
                          Agregar alumno
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </SectionCard>

                {/* Banner de error al intentar continuar con campos inválidos */}
                {formik.submitCount > 0 &&
                  Object.keys(formik.errors).some((k) => k !== 'alumnos' || typeof formik.errors.alumnos === 'string') && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
                    Revisa los campos marcados en rojo antes de continuar.
                  </Alert>
                )}

                {/* Botones paso 1 */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pb: 2 }}>
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
                    endIcon={<ChevronRightIcon />}
                    sx={{
                      backgroundColor:  COLOR_IBERO,
                      '&:hover':        { backgroundColor: '#6a0000' },
                      '&.Mui-disabled': { backgroundColor: '#e0e0e0' },
                      minWidth:         160,
                    }}
                  >
                    Continuar
                  </Button>
                </Box>
              </>
            )}

            {/* ══════════════════════════════════════════════════════════════
                PASO 2 — CONFIRMACIÓN
            ══════════════════════════════════════════════════════════════ */}
            {paso === 'confirmacion' && (
              <>
                <ConfirmacionView
                  values={formik.values}
                  diasHabiles={diasHabiles}
                />

                {/* Aviso informativo */}
                <Alert
                  icon={<CheckCircleOutlineIcon fontSize="small" />}
                  severity="success"
                  sx={{ mb: 3, borderRadius: 1.5 }}
                >
                  La revisión se realiza en un plazo máximo de{' '}
                  <strong>7 días hábiles</strong> a partir del envío.
                </Alert>

                {/* Botones paso 2 */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pb: 2 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    color="inherit"
                    startIcon={<ChevronLeftIcon />}
                    onClick={() => setPaso('formulario')}
                    disabled={formik.isSubmitting}
                  >
                    Editar lista
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
                      minWidth:         180,
                    }}
                  >
                    {formik.isSubmitting ? 'Enviando…' : 'Confirmar y enviar'}
                  </Button>
                </Box>
              </>
            )}

          </Form>
        )}
      </Formik>
    </Box>
  );
}
