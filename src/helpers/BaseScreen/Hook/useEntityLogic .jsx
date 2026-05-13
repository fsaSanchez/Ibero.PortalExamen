import { useState, useEffect } from "react";

export const useEntityLogic = (initialData = []) => {
  const [records, setRecords] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);


  useEffect(() => {
    setRecords(initialData);
  }, [initialData]);

  const handleOpenModal = (record = null) => {
    setSelectedRecord(record);
    setOpen(true);
  };

  const handleClose = () => {
    // setSelectedRecord(null);
    setOpen(false);
  };

  const handleSaveRecord = (values, handleDispatchSaveRecord) => {

    //NO actualizacion local por que se obtiene de nuevo desde el servidor con redux

    // let updated;
    // if (values.id) {
    //   updated = records.map((r) => (r.id === values.id ? values : r));
    // } else {
    //   const newId = Math.max(0, ...records.map((r) => r.id)) + 1;
    //   updated = [...records, { ...values, id: newId }];
    // }
    // setRecords(updated);
    // alert(`${entityName} guardado correctamente.`);
    handleDispatchSaveRecord(values);
    handleClose();
  };

  const handleDeleteRecord = (id, handleDispatchDeleteRecord) => {

    // setRecords(records.filter((r) => r.id !== id));
    // setSelectedRecord(records.find((r) => r.id === id) || null);
    handleDispatchDeleteRecord(id);

  };

  return {
    records,
    open,
    selectedRecord,
    handleOpenModal,
    handleClose,
    handleSaveRecord,
    handleDeleteRecord,
  };
};
