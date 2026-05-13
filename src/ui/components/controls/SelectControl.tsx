import { Field } from 'formik';
import React from 'react';

interface Props {
  name?: string;
  className?: string;
  label?: string;
  children: React.ReactNode,
  disabled?: boolean;
}

/// Propiedades del componente SelectControl
/// Este componente es un control de selección que utiliza Formik para manejar el estado del formulario.
/// [name] es el nombre del campo en el formulario.
/// [className] es una clase CSS opcional para aplicar estilos.
/// [label] es una etiqueta opcional que se muestra encima del control de selección.
/// [children] son las opciones del select, que deben ser elementos <option>.
/// [disabled] indica si el control está deshabilitado.
export const SelectControl: React.FC<Props> = ({
  name,
  className,
  label,
  children,
  disabled = false,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }}>
      <label className='body-3'>
        { label }
      </label>
      <Field
        name = { name }
        as="select"
        className = { className }
        disabled = { disabled }
      >
        {children}
      </Field>
    </div>
  );
};

