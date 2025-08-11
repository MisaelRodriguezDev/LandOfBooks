import { useState, type ReactNode } from "react";
import type { TableProps } from "@/types/table";
import formattedDate from "@/utils/formattedDate";
import styles from "./Table.module.css";
import type { UUID } from "crypto";

// Campos a ocultar si hideTimestamps está activado
const timeStampFields = ["created_at", "updated_at"];
const dateFields = [...timeStampFields, "date", "birth_date"];
const imageField = ["image_url", "photo", "cover"];
const booleanFields = ["enabled"];

// Iconos SVG por defecto
const EditIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
    <path
      fillRule="evenodd"
      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
    />
  </svg>
);

export default function Table<
  T extends { id: UUID } & Record<string, unknown>
>({
  columns,
  data,
  manager,
  hideTimestamps = true,
  updatefn,
  deletefn,
  extraActions = []
}: Readonly<TableProps<T>>) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  console.log(data)
  // Filtrar columnas
  const filteredColumns = hideTimestamps
    ? columns.filter((col) => !timeStampFields.includes(String(col.key)))
    : columns;

  const formatCellValue = (key: string, value: unknown) => {
  if (dateFields.includes(key)) {
    return formattedDate(String(value));
  }

  if (typeof value === "boolean") {
    return value ? "Activo" : "Eliminado";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "-";

    if (typeof value[0] === "object" && value[0] !== null) {
      return value
        .map((item) =>
          "full_name" in item
            ? (item).full_name
            : "name" in item
            ? (item).name
            : "first_name" in item || "last_name" in item
            ? `${(item).first_name ?? ""} ${(item).last_name ?? ""}`.trim()
            : JSON.stringify(item)
        )
        .join(", ");
    }

    return value.join(", ");
  }

  if (value && typeof value === "object") {
    if ("name" in value) {
      return value.name
    }
  }

  return String(value ?? "");
};


  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {filteredColumns.map((col) => (
              <th key={String(col.key)} className={styles.th}>
                {col.header}
              </th>
            ))}
            {data.length > 0 && manager && <th className={styles.th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isDisabled = booleanFields.some((field) => row[field] === false);

            return (
              <tr
                key={row.id}
                className={`${styles.tr} ${hoveredRow === row.id ? styles.hovered : ""}`}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {filteredColumns.map((col) => {
                  const key = String(col.key);
                  const value = row[key];

                  if (imageField.includes(key) && value) {
                    return (
                      <td
                        key={key}
                        className={`${styles.td} ${key === "id" ? styles.idCell : ""}`}
                      >
                        <img
                          src={String(value)}
                          alt={key}
                          className={styles.tableImage}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/default-image.png";
                          }}
                        />
                      </td>
                    );
                  }

                  return (
                    <td
                      key={key}
                      className={`${styles.td} ${key === "id" ? styles.idCell : ""}`}
                    >
                      {formatCellValue(key, value) as ReactNode}
                    </td>
                  );
                })}
                {manager && (
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      {/* Botón Editar */}
                      <button
                        className={`${styles.btnAction} ${styles.btnEdit}`}
                        onClick={() => updatefn?.(row)}
                        disabled={isDisabled}
                        title="Editar"
                      >
                        <EditIcon />
                      </button>
                      {/* Botón Eliminar */}
                      <button
                        className={`${styles.btnAction} ${styles.btnDelete}`}
                        onClick={() => deletefn?.(row)}
                        disabled={isDisabled}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </button>
                      {/* Acciones extra */}
                      {extraActions.map((action, i) => {
                        const visible = action.visible ? action.visible(row) : true;
                        if (!visible) return null;
                        const disabled = action.disabled ? action.disabled(row) : false;
                        return (
                          <button
                            key={i}
                            className={styles.btnAction}
                            onClick={() => action.onClick(row)}
                            disabled={disabled}
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
