import React from 'react';
import { useSelector } from 'react-redux';
import { useField } from 'formik';
import Select from 'react-select';

export const SelectGroupControl = ({ label, name, placeholder, isMulti = false, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { structuraAreas } = useSelector((state) => state.documentosStatic) || [];

  if (!structuraAreas?.groups) return null;

  // 🔹 Unificar todas las opciones de todos los grupos
  const allOptions = structuraAreas.groups.flatMap(g => g.options);

  // 🔹 Retornar el valor actual para react-select
  const getValue = () => {
    if (isMulti) {
      return allOptions.filter(opt => field.value?.includes(opt.value));
    }
    return allOptions.find(opt => opt.value === field.value) || null;
  };

  const handleChange = (selectedOption) => {
    if (isMulti) {
      helpers.setValue(selectedOption ? selectedOption.map(o => o.value) : []);
    } else {
      helpers.setValue(selectedOption ? selectedOption.value : '');
    }
  };

  const handleBlur = () => helpers.setTouched(true);

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">{label}</label>

      <Select
        id={name}
        name={name}
        options={structuraAreas.groups}
        value={getValue()}       
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder || "Selecciona..."}
        isMulti={isMulti}
        {...props}
      />

      {meta.touched && meta.error && (
        <div className="text-danger mt-1">{meta.error}</div>
      )}
    </div>
  );
};
