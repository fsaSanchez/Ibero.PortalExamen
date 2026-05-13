import React from 'react';
import { Formik, Form } from 'formik';
import { InputControl } from '../../../ui/components/controls/InputControl';
import { SelectControl } from '../../../ui/components/controls/SelectControl';


// Componentes base del proyecto


const FormularioDiplomadosFuera = ({ initialData, onSaveForm, closeDialog }) => {
  const initialValues = initialData || {
    id: null,
    areaEstudio: '',
    diplomado: '',
    pais: '',
    institucion: '',
    estatus: '',
    anioIngreso: '',
    anioEgresoSemestre: '', // El campo se llama "Año de egreso / Semestre"
  };

  // Catálogos simulados
  const catalogoEstatus = [{ value: "Finalizado", label: "Finalizado" }, { value: "En Curso", label: "En Curso" }, { value: "Abandonado", label: "Abandonado" }];

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        onSaveForm(values);
      }}
      enableReinitialize
    >
      <Form className="d-flex flex-column gap-3">
        <InputControl name="diplomado" label="Nombre del Curso y/o Diplomado" />
        <InputControl name="areaEstudio" label="Área de estudio" />

        <div className="row">
          <div className="col-md-6">
            <InputControl name="pais" label="País" />
          </div>
          <div className="col-md-6">
            <InputControl name="institucion" label="Institución" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <SelectControl name="estatus" label="Estatus:" className="form-control">
              <option value="">Selecciona un estatus</option>
              {catalogoEstatus.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </SelectControl>
          </div>
          <div className="col-md-4">
            <InputControl name="anioIngreso" label="Año de ingreso" type="number" />
          </div>
          <div className="col-md-4">
            <InputControl name="anioEgresoSemestre" label="Año de egreso / Semestre" />
          </div>
        </div>

        <div className="d-flex flex-row justify-content-end gap-3 mt-4">
          <button
            type="button"
            className="button button-s secondary-button"
            onClick={closeDialog}
          >
            Cancelar
          </button>
          <button type="submit" className="button button-s primary-button">
            Guardar Diplomado
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default FormularioDiplomadosFuera;