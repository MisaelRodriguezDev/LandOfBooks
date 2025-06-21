import styles from "./Error.module.css"
/**
 * Componente de mensajes de error
 * @param {string} message Mensaje de error
 * @returns {JSX.Element} Etiqueta p con el mensaje de error
 */
function ErrorMessage({ message }: Readonly<{ message?: string }>) {
    return (
    <p className={styles.error_message}>{message}</p>
  )
};

export default ErrorMessage