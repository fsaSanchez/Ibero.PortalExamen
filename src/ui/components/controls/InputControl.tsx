import { Field, useFormikContext, ErrorMessage } from 'formik';
import React, { useState, useEffect } from 'react';
import { IconIbero, IconName } from "../../../ui/components/icons/index";

interface Props {
  type: string;
  name?: string;
  className?: string;
  placeholder?: string;
  icon?: IconName;
  label?: string;
  readOnly?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
  onValueChange?: (value: any) => void;
}

export const InputControl: React.FC<Props> = ({
  type = 'text',
  name,
  className = 'form-control',
  placeholder,
  label,
  icon,
  readOnly = false,
  disabled = false,
  rows = 3,
  maxLength,
  showCounter = true,
  onValueChange,
}) => {

  const { values, errors, touched, handleChange } = useFormikContext<any>();
  const value = name ? values[name] : '';

  const [charCount, setCharCount] = useState(
    typeof value === 'string' ? value.length : 0
  );

  useEffect(() => {
    if (typeof value === 'string') {
      setCharCount(value.length);
    }
  }, [value]);

  const commonStyle = { paddingLeft: icon ? "36px" : "12px" };

  const hasError = name && errors[name] && touched[name];
  const isValid = name && touched[name] && !errors[name];

  const getBadgeClass = () => {
    if (!maxLength) return "bg-secondary";
    const percentage = (charCount / maxLength) * 100;
    if (percentage >= 100) return "bg-danger";
    if (percentage >= 80) return "bg-warning text-dark";
    return "bg-secondary";
  };

  const getInputMode = () => {
    if (type === "number") return "numeric";
    if (type === "tel") return "tel";
    if (type === "email") return "email";
    return undefined;
  };

  // ----- CHECKBOX -----
  if (type === "checkbox") {
    return (
      <div className="form-check">
        <Field
          type="checkbox"
          name={name}
          id={name}
          className="form-check-input"
          checked={value}
          disabled={disabled || readOnly}
          onChange={(e: any) => {
            handleChange(e);
            onValueChange?.(e.target.checked);
          }}
        />

        <label className="form-check-label" htmlFor={name}>
          {label ?? placeholder}
        </label>

        {name && (
          <ErrorMessage
            name={name}
            component="div"
            className="text-danger small mt-1"
          />
        )}
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-1 position-relative">

      {type !== "hidden" && (
        <span className="caption-3">{label ?? placeholder}</span>
      )}

      <div style={{ position: "relative" }}>

        {/* Icono */}
        {icon && (
          <IconIbero
            icon={icon}
            size="20px"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.8
            }}
          />
        )}

        {/* ------- EDITABLE ------- */}
        {!readOnly ? (
          <>
            {type === "textarea" ? (
              <Field
                as="textarea"
                name={name}
                rows={rows}
                maxLength={maxLength}
                id={name}
                disabled={disabled}
                placeholder={placeholder}
                className={`${className} modern-input ${hasError ? "is-invalid" : ""} ${isValid ? "" : ""}`} //is-valid
                style={commonStyle}
                onChange={(e: any) => {
                  handleChange(e);
                  onValueChange?.(e.target.value);
                }}
              />
            ) : (
              <Field
                type={type}
                name={name}
                id={name}
                disabled={disabled}
                placeholder={
                  placeholder ?? (type === "email" ? "correo@ejemplo.com" : "")
                }
                className={`${className} modern-input ${hasError ? "is-invalid" : ""} ${isValid ? "" : ""}`} //is-valid
                autoComplete={type === "email" ? "email" : "off"}
                inputMode={getInputMode()}
                style={commonStyle}
                onChange={(e: any) => {
                  handleChange(e);
                  onValueChange?.(e.target.value);
                }}
              />
            )}

            {/* Contador textarea */}
            {showCounter && type === "textarea" && maxLength && (
              <span
                className={`badge rounded-pill position-absolute ${getBadgeClass()}`}
                style={{
                  bottom: "8px",
                  right: "8px",
                  fontSize: "0.75rem",
                  zIndex: 2,
                }}
              >
                {charCount} / {maxLength}
              </span>
            )}

            {/* Error Formik */}
            {name && (
              <ErrorMessage
                name={name}
                component="div"
                className="text-danger small mt-1"
              />
            )}
          </>
        ) : (
          // ------- READONLY -------
          <div
            className={`${className} modern-input-readonly`}
            style={{
              ...commonStyle,
              minHeight: type === "textarea" ? `${rows * 20}px` : "44px",
            }}
          >
            {value || "-"}
          </div>
        )}
      </div>
    </div>
  );
};
