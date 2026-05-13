// src/ui/components/controls/SelectReactControl.jsx
import React from 'react';
import { useField } from 'formik';
import Select from 'react-select';

export const SelectReactControl = ({ label, name, options, placeholder, isMulti = false, ...props }) => {
  const [field, meta, helpers] = useField(name);

  // Formatear las opciones si no vienen ya en el formato { value: '', label: '' }
  const formattedOptions = options.map(option =>
    typeof option === 'object' && option.value && option.label
      ? option
      : { value: option.value, label: option.label }
  );

  // Determinar el valor actual para react-select
  const getValue = () => {
    if (formattedOptions) {
      if (isMulti) {
        return formattedOptions.filter(option => field.value?.includes(option.value));
      }
      return formattedOptions.find(option => option.value === field.value) || null;
    }
    return isMulti ? [] : null;
  };

  const handleChange = (selectedOption) => {
    if (isMulti) {
      helpers.setValue(selectedOption ? selectedOption.map(option => option.value) : []);
    } else {
      helpers.setValue(selectedOption ? selectedOption.value : '');
    }
  };

  const handleBlur = () => {
    helpers.setTouched(true);
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">{label}</label>
      <Select
        id={name}
        name={name}
        options={formattedOptions}
        value={getValue()}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder || `Selecciona un ${label.toLowerCase()}`}
        isMulti={isMulti}
        classNamePrefix="react-select" // Para aplicar estilos si es necesario
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-danger mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};