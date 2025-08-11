import ErrorMessage from "../Messages/Error/Error";
import type { SelectProps } from "@/types/form";
import styles from "./SelectField.module.css";

function SelectField<T extends Record<string, unknown>>({
  label,
  id,
  register,
  error,
  options,
  multiple = false,
  defaultValue,
}: Readonly<SelectProps<T>>) {
  // Para múltiples valores, React Hook Form espera un array de strings (value).
  // React recomienda usar `defaultValue` para campos controlados.
  // Para multiple select, defaultValue debe ser array; para single, string.

  const initialValue = multiple
    ? (Array.isArray(defaultValue) ? defaultValue : []) 
    : (typeof defaultValue === "string" ? defaultValue : "");

  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        {...register(id, {
          setValueAs: multiple
            ? (value) => {
                if (!value) return [];
                return Array.isArray(value) ? value : [value];
              }
            : undefined,
        })}
        className={`${styles.formControl} ${error ? styles.error : ""} ${
          multiple ? styles.multipleSelect : ""
        }`}
        multiple={multiple}
        defaultValue={initialValue}
      >
        {!multiple && (
          <option value="" disabled>
            Selecciona una opción
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className={`${styles.errorContainer} ${error ? styles.active : ""}`}>
        {error && <ErrorMessage message={error.message} />}
      </div>
    </div>
  );
}

export default SelectField;
