import React, { useRef } from 'react';
import { useField } from 'formik';

export const FileUploadControl = ({ label, name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    helpers.setValue(file); // Almacena el objeto File en Formik
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">{label}</label>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={field.value ? field.value.name : ''} // Asegúrate de que siempre haya un valor (vacío si es undefined)
          readOnly
          placeholder="Ningún archivo seleccionado"
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleButtonClick}
        >
          Seleccionar Archivo
        </button>
        <input
          id={name}
          name={name}
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} // Oculta el input de archivo original
          {...props}
        />
      </div>
      {meta.touched && meta.error ? (
        <div className="text-danger mt-1">{meta.error}</div>
      ) : null}
      {/* {field.value && <small className="form-text text-muted mt-1">Archivo actual: {field.value.name}</small>} */}
    </div>
  );
};
