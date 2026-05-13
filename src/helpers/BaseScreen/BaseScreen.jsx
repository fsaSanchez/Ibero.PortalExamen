// BaseScreen.jsx
import React from 'react'
import { HeaderIbero } from '../../ui/components/HeaderIbero'
import { SearchBarDinamico } from '../SearchBarDinamico'
import { GeneralDataTable } from '../GeneralDatatable'
import { EntityDialog } from './EntityDialog'


export const BaseScreen = ({
  title = "Gestión de registros",
  filters = [],
  columns = [],
  rows = [],
  actions = [],
  FormComponent, // 👈 el formulario dinámico
  formTitle = { add: "Agregar", edit: "Editar" },
  onSearch = () => { },
  onSaveRecord = () => { },
  open = false,
  selectedRecord = null,
  handleOpenModal = () => { },
  handleClose = () => { },
  handleDispatchSaveRecord = () => { },

}) => {

  return (
    <div className="container-fluid">
      <HeaderIbero
        handleClickOpen={() => handleOpenModal()}
        Titulo={title}
        TextoBoton="AGREGAR"
      />

      {filters.length > 0 && (
        <div className="mt-3">
          <SearchBarDinamico filters={filters} onSearch={onSearch} />
        </div>
      )}
      {filters.length < 1 && (
        <>
          <br />
          <br />
          <br />
        </>
      )}


      <GeneralDataTable
        columns={columns}
        rows={rows}
        actions={actions.map(a => ({
          ...a,
          onClick: (row) => {
            if (a.key === 'edit') handleOpenModal(row)
            else a.onClick?.(row)
          },
        }))}
        columnsHide={{ id: false }}
      />

      <EntityDialog
        open={open}
        onClose={handleClose}
        title={
          selectedRecord
            ? `${formTitle.edit} ${title}`
            : `${formTitle.add} ${title}`
        }
      >
        {FormComponent && (
          <FormComponent
            closeDialog={handleClose}
            initialData={selectedRecord}
            onSaveForm={(values) => {
              onSaveRecord(values, handleDispatchSaveRecord)
              handleClose()
            }}
          />
        )}
      </EntityDialog>
    </div>
  )
}
