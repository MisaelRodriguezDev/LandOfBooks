import { useState } from "react";
import ErrorMessage from "../Messages/Error/Error";
import type { FormFieldProps } from "../../../types/form";
import styles from "./input.module.css";

function FormField<T extends Record<string, unknown>>({
  label,
  id,
  type,
  register,
  error,
  className
}: Readonly<FormFieldProps<T>>) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={styles.form_group}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.input_wrapper}>
        <input
          id={id}
          type={inputType}
          {...register(id)}
          className={`${styles.form_control} ${error ? styles.error : ""} ${className ?? ""}`}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.eye_button}
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              // 👁️‍🗨️ Icono para mostrar (puedes reemplazar con un componente de ícono)
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="black" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              // 🙈 Icono para ocultar
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="black" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.055 10.055 0 012.52-4.226m3.662-2.168A9.959 9.959 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.978 9.978 0 01-4.293 5.134M15 12a3 3 0 01-3 3" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className={`${styles.error_container} ${error ? styles.active : ""}`}>
        {error?.types &&
          Object.values(error.types).map((msg, i) => {
            if (Array.isArray(msg)) {
              return msg.map((m, j) => (
                <ErrorMessage key={`${i}-${j}`} message={String(m)} />
              ));
            }
            return <ErrorMessage key={i} message={String(msg ?? "")} />;
          })}
      </div>
    </div>
  );
}

export default FormField;
