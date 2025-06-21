// components/Modal.tsx
import React from "react";
import styles from "./Modal.module.css"; // Asegúrate de definir estilos básicos

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
