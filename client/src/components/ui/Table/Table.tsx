import { useState } from "react";
import type { TableProps } from "@/types/table";
import formattedDate from "@/utils/formattedDate";
import styles from "./Table.module.css";

// Campos a ocultar si hideTimestamps está activado
const timeStampFields = ['created_at', 'updated_at'];
const dateFields = ['date'];
const booleanFields = ['enabled'];

// Iconos SVG para acciones
const EditIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

export default function Table<T extends { id: string } & Record<string, unknown>>({ 
  columns, 
  data, 
  manager,
  hideTimestamps = true,
  updatefn,
  deletefn
}: Readonly<TableProps<T>>) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Filtrar columnas según configuración
  const filteredColumns = hideTimestamps
    ? columns.filter(col => !timeStampFields.includes(String(col.key)))
    : columns;

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
          {data.map(row => {
            const isDisabled = booleanFields.some(field => row[field] === false);

            return (
              <tr 
                key={row.id}
                className={`${styles.tr} ${hoveredRow === row.id ? styles.hovered : ''}`}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {filteredColumns.map((col) => (
                  <td 
                    key={String(col.key)} 
                    className={`${styles.td} ${String(col.key) === 'id' ? styles.idCell : ''}`}
                  >
                    {
                      dateFields.includes(String(col.key))
                        ? formattedDate(String(row[col.key]))
                        : typeof row[col.key] === "boolean"
                          ? row[col.key] ? "Activo" : "Eliminado"
                          : String(row[col.key])
                    }
                  </td>
                ))}
                {manager && (
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.btnAction} ${styles.btnEdit}`}
                        onClick={() => updatefn?.(row)}
                        disabled={isDisabled}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className={`${styles.btnAction} ${styles.btnDelete}`}
                        onClick={() => deletefn?.(row)}
                        disabled={isDisabled}
                      >
                        <DeleteIcon />
                      </button>
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
