# CLAUDE.md — Frontend Módulo Examen de Grado

## Descripción
Módulo React para el Sistema de Solicitud de Examen de Grado,
Universidad Iberoamericana Ciudad de México.
Se construye dentro de un proyecto React existente que ya tiene
router, autenticación, Redux y menú lateral configurados.

---

## Regla principal
Todo el código nuevo vive dentro de `src/components/ExamenGrado/`.
No se modifica router, guards, store global ni estructura fuera de esa carpeta.

---

## Estructura de carpetas objetivo

```
src/components/ExamenGrado/
├── screens/
│   ├── ProgramacionScreen.jsx       → Admin y Coordinador
│   ├── IndividualScreen.jsx         → Coordinador
│   ├── GeneralScreen.jsx            → Coordinador
│   └── DocumentosScreen.jsx         → Admin
├── components/
│   ├── tabla/
│   │   ├── SolicitudesTable.jsx     → tabla principal con tabs y filtros
│   │   └── SolicitudesTableToolbar.jsx
│   ├── modales/
│   │   ├── ModalDetalle.jsx         → ojito: info + alumnos + docs online
│   │   ├── ModalObservaciones.jsx   → observaciones con cards
│   │   ├── ModalEstatus.jsx         → cambiar estatus (solo Admin)
│   │   └── ModalAsignarFecha.jsx    → asignar fecha (solo Admin)
│   ├── formularios/
│   │   ├── InfoGeneralExamen.jsx    → sección reutilizable: fecha/hora/modalidad/lugar
│   │   ├── FormularioIndividual.jsx → datos alumno + documentos
│   │   ├── FormularioGeneral.jsx    → alumnos participantes
│   │   └── DocumentosOnline.jsx     → docs para sesión virtual/híbrida
│   └── shared/
│       ├── StatusBadge.jsx          → badge de color por estatus
│       ├── ModalidadBadge.jsx       → badge por modalidad
│       ├── ReadonlyNotice.jsx       → aviso azul "solo lectura"
│       ├── MargenFechaNotice.jsx    → aviso amarillo 10/11 días hábiles
│       └── ObservacionCard.jsx      → card individual de observación
├── hooks/
│   ├── useSolicitudes.js            → fetchData de lista y detalle
│   ├── useCatalogos.js              → fetchData de catálogos (carga una vez)
│   └── useDiasHabiles.js            → lógica de margen 10/11 días
└── constants/
    └── examenGrado.constants.js     → ids de estatus, modalidad, tipo doc, profileIds
```

---

## Perfiles de usuario

```js
// Leer del store — única fuente de verdad para permisos
const { isAdmin } = useSelector((state) => state.auth);

// isAdmin === true  → Administrador (profileId 440)
// isAdmin === false → Coordinador   (profileId 441)
```

### Permisos por acción

| Acción                                    | Admin | Coordinador |
|-------------------------------------------|:-----:|:-----------:|
| Ver tabla Programación                    | ✅    | ✅          |
| Ver detalle (modal ojito)                 | ✅    | ✅          |
| Ver observaciones existentes              | ✅    | ✅          |
| Cambiar estatus                           | ✅    | ❌          |
| Eliminar alumnos (modal detalle)          | ✅    | ❌          |
| Agregar / eliminar observaciones          | ✅    | ❌          |
| Asignar fecha al examen                   | ✅    | ❌          |
| Menú Documentos (plantillas)              | ✅    | ❌          |
| Crear solicitud Individual                | ❌    | ✅          |
| Crear solicitud General                   | ❌    | ✅          |
| Descargar docs online                     | ✅    | ✅          |
| Subir doc online lleno                    | ❌    | ✅          |
| Ver doc online lleno                      | ✅    | ❌          |

---

## Comunicación con el backend

```js
const { fetchData, sendData } = useApiData();

// GET
const data = await fetchData('Endpoint/Ruta', { param: valor }, 'Cargando...');

// POST
await sendData('Endpoint', 'post', payload, {}, 'Guardando...');

// PUT
await sendData('Endpoint/UpdateEstatus', 'put', payload, {}, 'Actualizando...');

// DELETE
await sendData('Endpoint/123', 'delete', {}, {}, 'Eliminando...');
```

El hook resuelve internamente token, URL base y headers.
No usar Axios ni fetch directamente. Siempre useApiData.

---

## Endpoints del backend

### Catálogos (sin auth especial)
```
GET /Catalogo/TipoSolicitud
GET /Catalogo/Modalidad
GET /Catalogo/EstatusSolicitud
GET /Catalogo/TipoDocumento
```

### Solicitud
```
GET  /Solicitud/GetAll?idEstatus={id}    → lista con filtro opcional
GET  /Solicitud/GetById/{id}             → detalle con alumnos, docs, obs
POST /Solicitud                          → Coordinador crea
PUT  /Solicitud/UpdateEstatus            → Admin cambia estatus
```

### SolicitudAlumno
```
GET    /SolicitudAlumno/GetBySolicitud/{idSolicitud}
POST   /SolicitudAlumno
DELETE /SolicitudAlumno/{id}             → Admin
```

### SolicitudDocumento
```
GET  /SolicitudDocumento/GetBySolicitud/{idSolicitud}
POST /SolicitudDocumento                 → registra idLaserfiche
PUT  /SolicitudDocumento/{id}            → actualiza idLaserfiche
```

### SolicitudObservacion
```
POST   /SolicitudObservacion             → Admin
DELETE /SolicitudObservacion/{id}        → Admin
```

### PlantillaDocumento
```
GET    /PlantillaDocumento/GetAll
GET    /PlantillaDocumento/GetByTipo/{idTipoDocumento}
POST   /PlantillaDocumento               → Admin
DELETE /PlantillaDocumento/{id}          → Admin
```

---

## Constantes clave

```js
// src/components/ExamenGrado/constants/examenGrado.constants.js

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

export const TIPO_DOCUMENTO_ONLINE = [7, 8, 9, 10];
// 7  = acta_virtual
// 8  = mencion_honorifica
// 9  = kardex_calificacion
// 10 = protesta

export const DOCS_ONLINE_APLICA = (idTipoSolicitud, idModalidad) =>
  idTipoSolicitud === TIPO_SOLICITUD.INDIVIDUAL &&
  (idModalidad === MODALIDAD.VIRTUAL || idModalidad === MODALIDAD.HIBRIDA);
```

---

## Reglas de negocio en frontend

### Margen de 10/11 días hábiles
```js
// hooks/useDiasHabiles.js
// Contar días hábiles (lun-vie) entre hoy y fechaMeta
// Si resultado === 10 u 11 → mostrar MargenFechaNotice en el formulario
// El backend también lo calcula; el frontend solo muestra el aviso visual
```

### Documentos online
- Solo aplican a solicitudes tipo Individual con modalidad Virtual o Híbrida
- Admin: ve si el coordinador ya subió el doc lleno
- Coordinador: descarga la plantilla y sube el doc lleno
- En ModalDetalle: renderizar sección DocumentosOnline solo si DOCS_ONLINE_APLICA

### Observaciones
- Tipo General: aplica a cualquier solicitud
- Tipo Por Alumno: solo en solicitudes tipo General, con selector de alumno
- El switch General/Por Alumno solo aparece si isAdmin && tipoSolicitud === GENERAL
- Coordinador ve las observaciones en modo lectura (ReadonlyNotice)

### Estatus
- Solo Admin puede cambiar estatus
- ModalEstatus muestra los 3 estatus disponibles con badge de color
- Al confirmar muestra SweetAlert2 de confirmación antes de hacer PUT

---

## Stack UI disponible

| Librería            | Uso sugerido                                 |
|---------------------|----------------------------------------------|
| MUI v6              | Componentes base, layout, inputs             |
| MUI DataGrid        | Tabla de solicitudes                         |
| MUI Icons           | Iconografía                                  |
| Formik + Yup        | Formularios y validación                     |
| SweetAlert2         | Confirmaciones antes de acciones destructivas|
| notistack           | Notificaciones de éxito/error                |
| react-select        | Selects con búsqueda                         |
| moment              | Formateo y cálculo de fechas                 |
| styled-components   | Estilos dinámicos por componente             |

**Estilo visual:** Seguir fielmente el mockup aprobado.
Color institucional principal: `#8B0000` (rojo IBERO).
Badges de estatus:
- En revisión → naranja  `#fff3e0` / `#c56000`
- Confirmada  → verde    `#e6f4ea` / `#2e7d32`
- Rechazada   → rojo     `#fce8e8` / `#8B0000`

Badges de modalidad:
- Presencial → gris   `#f0f0f0` / `#666`
- Virtual    → azul   `#e8f0fe` / `#1a56db`
- Híbrida    → morado `#f3e8ff` / `#6b21a8`

---

## Formularios

### IndividualScreen — secciones en orden
1. Información general del examen
   - Fecha examen (date) → disparar useDiasHabiles al cambiar
   - Hora examen (time)
   - Modalidad (select catálogo)
   - Lugar examen (text libre)
   - MargenFechaNotice si días === 10 u 11
2. Datos del alumno
   - Número de cuenta, Nombre completo, Programa
3. Documentos obligatorios (planta sinodales, VA x3, recibo biblioteca)
4. Fotografía digital (opcional)
5. Al enviar:
   - Si margen crítico → modal aviso especial antes de confirmar
   - POST /Solicitud

### GeneralScreen — secciones en orden
1. Información general del examen
   - Fecha examen, Hora examen (SIN modalidad)
   - MargenFechaNotice si aplica
2. Información del examen
   - Programa (select), Planta de sinodales
3. Alumnos participantes
   - Cards dinámicas, agregar/eliminar alumno
4. Al continuar → pantalla de confirmación con lista
5. Al confirmar → POST /Solicitud

### DocumentosScreen (Admin)
- Listado de plantillas por tipo de documento
- Cada fila: tipo documento, idLaserfiche actual, fecha carga, acciones
- Admin puede registrar nuevo idLaserfiche (POST /PlantillaDocumento)
- Admin puede eliminar plantilla (DELETE con SweetAlert2)

---

## Tabla ProgramacionScreen

### Columnas
| Columna       | Admin                        | Coordinador        |
|---------------|------------------------------|--------------------|
| Solicitud     | folio + programa + fecha     | igual              |
| Tipo          | badge Individual/General     | igual              |
| Modalidad     | badge color                  | igual              |
| Estatus       | clickable → ModalEstatus     | badge solo lectura |
| Asignar fecha | botón si confirmada          | —                  |
| Ver detalle   | ícono ojito → ModalDetalle   | igual, solo lectura|
| Observaciones | Ver obs (N) → ModalObs       | solo lectura si hay|

### Tabs de filtro
Todas | Confirmadas | En revisión | Rechazadas

### Indicador docs online
Mostrar ícono 🎥 junto al folio si la solicitud tiene docs online pendientes

---

## Modales

### ModalDetalle
- Info row: folio, tipo, modalidad, fecha examen, hora, lugar, programa, estatus
- Si DOCS_ONLINE_APLICA → sección DocumentosOnline
- Lista de alumnos
  - Admin: botón eliminar con SweetAlert2
  - Coordinador: ReadonlyNotice, sin botón eliminar

### ModalObservaciones
- Lista de ObservacionCard (tipo badge + meta + texto)
- Admin: switch General/Por Alumno (solo si tipo=General)
  selector de alumno si switch activo
  textarea + botón agregar
  botón eliminar en cada card
- Coordinador: ReadonlyNotice, solo lectura

### ModalEstatus (Admin)
- Lista de 3 estatus con badge
- Marcar el actual
- SweetAlert2 de confirmación antes de PUT /Solicitud/UpdateEstatus

### ModalAsignarFecha (Admin)
- Fecha, Hora, Lugar
- PUT o POST según corresponda

---

## Orden de construcción para Claude Code

Seguir estrictamente este orden, un mensaje por vez:

1. **Constantes y hooks**
   `examenGrado.constants.js`, `useCatalogos.js`,
   `useSolicitudes.js`, `useDiasHabiles.js`

2. **Componentes shared**
   `StatusBadge`, `ModalidadBadge`, `ReadonlyNotice`,
   `MargenFechaNotice`, `ObservacionCard`

3. **ProgramacionScreen + tabla**
   `SolicitudesTable`, `SolicitudesTableToolbar`,
   tabs de filtro, búsqueda, columnas con permisos

4. **Modales de Programación**
   `ModalEstatus`, `ModalDetalle`, `ModalObservaciones`,
   `ModalAsignarFecha`

5. **Formularios compartidos**
   `InfoGeneralExamen`, `DocumentosOnline`

6. **IndividualScreen**
   Secciones en orden, validación Formik+Yup,
   lógica de margen crítico, POST /Solicitud

7. **GeneralScreen**
   Cards de alumnos, pantalla de confirmación,
   POST /Solicitud

8. **DocumentosScreen**
   Tabla de plantillas, registro de idLaserfiche,
   eliminación con SweetAlert2

9. **Verificación final**
   Revisar que isAdmin protege todas las acciones,
   que useApiData se usa en toda comunicación,
   que los badges y colores siguen el mockup,
   que no hay imports fuera de ExamenGrado/ excepto
   hooks globales del proyecto (useApiData, useSelector)
