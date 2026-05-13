import FormularioDiplomadosFuera from "../temp/FormularioDiplomadosFuera";
import { useEntityLogic } from "../../../helpers/BaseScreen/Hook/useEntityLogic ";
import { BaseScreen } from "../../../helpers/BaseScreen/BaseScreen";
import { useColumnMemo } from "../../../helpers/BaseScreen/Hook/useColumMemo";
import { columnsDiplomados } from "./GridConfig/Columns";
import { ActionsDiplomados } from "./GridConfig/Actions";
import { useActionMemo } from "../../../helpers/BaseScreen/Hook/useActionMemo";

const DiplomadosScreen = () => {
  // ✅ Usamos el hook genérico, pero pasamos configuración específica de Diplomados
  const {
    records,
    open,
    selectedRecord,
    handleOpenModal,
    handleClose,
    handleSaveRecord,
    handleDeleteRecord,
  } = useEntityLogic([], "Diplomado");



  // Filtros específicos de Diplomados
  const filters = [
    { name: "diplomado", label: "Diplomado", type: "text" },
    { name: "institucion", label: "Institución", type: "text" },
    {
      name: "estatus",
      label: "Estatus",
      type: "select",
      options: [
        { value: "Finalizado", label: "Finalizado" },
        { value: "En Curso", label: "En Curso" },
        { value: "Pendiente", label: "Pendiente" },
      ],
    },
  ];

  // Columnas específicas para la tabla
  // Columnas resumidas para la tabla
  const columns = useColumnMemo(columnsDiplomados);

  // Acciones para la tabla

  const customActions = [
    {
      key: "download",
      label: "Descargar Documento",
      icon: "📄",
      onClick: (row) => {
        console.log(row);

        if (row.id) {
          alert(`Descargando documento desde: ${row.id}`);
        } else {
          alert("Este diplomado no tiene documento asociado.");
        }
      },
    },
  ];

  const handleSearch = (filters) => {
    console.log(filters);
  };

  const handleDispatchSaveRecord = (values) => {
    // Aquí iría la lógica para guardar en el backend con dispatch
    console.log("Guardado :", values);
  };

  const handleDispatchDeleteRecord = (id) => {
    // Aquí iría la lógica para eliminar en el backend con dispatch
    console.log("Eliminado ID:", id);
  };

  const actions = useActionMemo(
    ActionsDiplomados(
      handleOpenModal,
      handleDeleteRecord,
      handleDispatchDeleteRecord
    )
  );
  const AllActions = [...actions, ...customActions];
  return (
    <BaseScreen
      title="Gestión de Diplomados"
      filters={filters}
      columns={columns}
      rows={records}
      actions={AllActions}
      FormComponent={FormularioDiplomadosFuera} // 👈 se inyecta el formulario
      onSaveRecord={handleSaveRecord}
      onSearch={handleSearch}
      open={open}
      selectedRecord={selectedRecord}
      handleOpenModal={handleOpenModal}
      handleClose={handleClose}
      handleDispatchSaveRecord={handleDispatchSaveRecord}
    />
  );
};
export default DiplomadosScreen;