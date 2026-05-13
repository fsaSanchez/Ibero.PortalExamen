import React, { useState, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import { GridActionsCellItem } from '@mui/x-data-grid';
import FormularioDiplomadosFuera from './FormularioDiplomadosFuera';
import { GeneralDataTable } from '../../../helpers/GeneralDatatable';
import { SearchBarDinamico } from '../../../helpers/SearchBarDinamico';
import { HeaderIbero } from '../../../ui/components/HeaderIbero';


const data = [
  {
    "id": 1,
    "areaEstudio": "Marketing Digital",
    "diplomado": "Diplomado en SEO y SEM Avanzado",
    "pais": "ESPAÑA",
    "institucion": "IEBS Business School",
    "estatus": "Finalizado",
    "anioIngreso": 2022,
    "anioEgresoSemestre": "2023-01"
  },
  {
    "id": 2,
    "areaEstudio": "Gestión de Proyectos",
    "diplomado": "Curso de Preparación para la Certificación PMP",
    "pais": "MEXICO",
    "institucion": "Project Management Institute (Capítulo México)",
    "estatus": "En Curso",
    "anioIngreso": 2024,
    "anioEgresoSemestre": ""
  },
  {
    "id": 3,
    "areaEstudio": "Desarrollo de Software",
    "diplomado": "Bootcamp Full-Stack Developer",
    "pais": "ESTADOS UNIDOS",
    "institucion": "Coursera / Google",
    "estatus": "Finalizado",
    "anioIngreso": 2023,
    "anioEgresoSemestre": "2023-02"
  }
]



const TempScreen = () => {


  const handleUpdate = () => {

    alert(`Sección guardada (simulado).`);
  };


  const [diplomados, setDiplomados] = useState(data);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  /* const [activoIdSeleccionado, setactivoIdSeleccionado] = useState(null);
  const [dialogHorarios, setDialogHorarios] = useState(false); */

  const handleOpenModal = (record = null) => {
    setSelectedRecord(record);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRecord(null);
  };

  const handleSaveRecord = (values) => {
    let updatedDiplomados;
    if (values.id) {
      updatedDiplomados = diplomados.map(d => d.id === values.id ? values : d);
    } else {
      const newId = diplomados.length > 0 ? Math.max(...diplomados.map(d => d.id)) + 1 : 1;
      updatedDiplomados = [...diplomados, { ...values, id: newId }];
    }
    setDiplomados(updatedDiplomados);
    handleUpdate();
    handleClose();
  };

  /* const handleDeleteRecord = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este diplomado?")) {
      const updatedDiplomados = diplomados.filter(d => d.id !== id);
      setDiplomados(updatedDiplomados);
      handleUpdate();
    }
  }; */

  // Columnas resumidas para la tabla
  const columns = useMemo(() => [
    {
      field: 'diplomado',
      headerName: 'Diplomado',
      flex: 1,
      minWidth: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'institucion',
      headerName: 'Institución',
      width: 250,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'estatus',
      headerName: 'Estatus',
      width: 150,
      headerClassName: 'super-app-theme--header',
      align: 'center',
    }

  ], []);



  const actions = [
    {
      key: 'edit',
      label: 'Editar',
      icon: '✏️',
      onClick: () => {
        // dispatch(startGetActivoById(row.id));
        handleClickOpen();
      },
    },
    {
      key: 'horarios',
      label: 'Editar Horarios',
      icon: '🕒',
      onClick: (row) => {
        //dispatch(startGetActivoById(row.id));
        handleClickOpenHorarios(row.id);
      },
      condition: (row) => row?.assetType?.value === 3,
    },
    {
      key: 'metadatos',
      label: 'Metadatos',
      icon: '📄',
      onClick: (row) => {
        handleClickOpenMetadatos(row.id);
      },
    },
    {
      key: 'relacionados',
      label: 'Relacionados',
      icon: '🔗',
      onClick: (row) => {
        handleClickOpenRelacionados(row.id);
      },
    },
  ];
  const handleClickOpen = () => {
    console.log("abrir modal formulario");

  }
  const handleClickOpenMetadatos = (id) => {
    console.log("abrir modal metadatos" + id);


  };


  const handleClickOpenHorarios = (id) => {
    // setactivoIdSeleccionado(id)
    // setDialogHorarios(true);
  }



  const handleClickOpenRelacionados = (id) => {
    console.log("abrir modal relacionados" + id);
  }



  const tableData = Array.isArray(data) ? data : [];
  const assetEstatus = [
    { value: 'Finalizado', label: 'Finalizado' },
    { value: 'En Curso', label: 'En Curso' },
    { value: 'Pendiente', label: 'Pendiente' },
  ];

  const filters = [
    { name: 'Name', label: 'Nombre Activo', type: 'text' },
    { name: 'AssetStatusId', label: 'Estatus', type: 'select', options: assetEstatus }
  ];

  const handleSearch = () => {
    //agregar clientId a los filtros antes de enviarlos
    //   values.ClientId = clienteId;
    //   dispatch(startGetActivos(values));
  }

  return (
    <div className='container-fluid'>

      <div className='row'>
        <div className='col-12'>
          <HeaderIbero handleClickOpen={handleOpenModal} Titulo="Gestion de Activos" TextoBoton="AGREGAR" />
        </div>
        <div className='col-12 mt-3'>
          <SearchBarDinamico filters={filters} onSubmit={handleSearch} />
        </div>
      </div>




      <GeneralDataTable
        columns={columns}
        rows={tableData}
        actions={actions}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        disableEscapeKeyDown={true}
        fullWidth
        maxWidth="md"
      >
        <div className="p-4">
          <h5 id="form-dialog-title">{selectedRecord ? 'Editar Diplomado' : 'Agregar Diplomado'}</h5>
          <FormularioDiplomadosFuera
            closeDialog={handleClose}
            initialData={selectedRecord}
            onSaveForm={handleSaveRecord}
          />
        </div>
      </Dialog>
    </div>
  );
}; export default TempScreen;