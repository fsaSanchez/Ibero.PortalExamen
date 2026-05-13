export const ActionsDiplomados = (handleOpenModal, handleDeleteRecord,handleDispatchDeleteRecord) => [
  {
    key: "edit",
    label: "Editar",
    icon: "✏️",
    onClick: (row) => handleOpenModal(row),
  },
  {
    key: "delete",
    label: "Eliminar",
    icon: "🗑️",
    onClick: (row) => handleDeleteRecord(row.id, handleDispatchDeleteRecord)
  },
    
  ];