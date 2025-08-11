import { useEffect, useState } from "react";
import Table from "@/components/ui/Table/Table";
import Button from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal/Modal";
import CreateBookCopy from "@/Managment/Copies/Create";
import UpdateBookCopy from "@/Managment/Copies/Update";
import styles from "@/styles/Table.module.css";
import {
  getAllBookCopiesFromAdminRequest,
  deleteBookCopyRequest,
} from "@/services/copies";
import { getBooksRequest } from "@/services/books";

import type { BookCopy } from "@/types/copies"; // Asume que tienes un tipo BookCopy
import useDynamicColumns from "@/hooks/useDynamicColumns";
import type { UUID } from "crypto";

export default function BookCopiesManagement() {
 const [books, setBooks] = useState<{id: UUID, title: string}[]>([]);
  const [copies, setCopies] = useState<BookCopy[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCopy, setSelectedCopy] = useState<BookCopy | null>(null);

  const fetchBooks = async () => {
    try {
        const result = await getBooksRequest()
        setBooks(result.data)
    } catch (error) {
        console.error(error)
    }
  }
  const fetchData = async () => {
    try {
      const result = await getAllBookCopiesFromAdminRequest();
      setCopies(result.data);
    } catch (error) {
      console.error("Error fetching book copies:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBooks();
  }, []);

  const onSuccessCreated = async () => {
    await fetchData();
    setShowCreateModal(false);
  };

  const onSuccessUpdated = async () => {
    await fetchData();
    setShowUpdateModal(false);
    setSelectedCopy(null);
  };

  const onDeleteCopy = async (copy: BookCopy) => {
    const confirmed = confirm(`¿Seguro que deseas eliminar la copia con ID ${copy.id}?`);
    if (!confirmed) return;

    try {
      await deleteBookCopyRequest(copy.id);
      await fetchData();
    } catch (error) {
      console.error("Error eliminando copia de libro:", error);
    }
  };

  // Define columnas dinámicas según tu tipo BookCopy
  const columns = useDynamicColumns<BookCopy>(copies, {
    labels: {
      barcode: "Código de barras",
      status: "Estado",
      book_title: "Título del libro",
      // agrega otros campos que quieras mostrar
    },
  });

  return (
    <div>
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <CreateBookCopy onSuccess={onSuccessCreated} books={books} />
        </Modal>
      )}
      {showUpdateModal && selectedCopy && (
        <Modal
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedCopy(null);
          }}
        >
          <UpdateBookCopy
            id={selectedCopy.id}
            initialData={selectedCopy}
            onSuccess={onSuccessUpdated}
            books={books}
          />
        </Modal>
      )}

      <div style={{ marginBottom: 10 }}>
        <Button
          content="Crear copia de libro"
          content_loading="Creando..."
          loading={false}
          enabled={true}
          action="create"
          fn={() => setShowCreateModal(true)}
        />
      </div>

      <div className={styles.table_wrapper}>
        {copies.length > 0 ? (
          <div className={styles.table_container}>
            <h1>Lista de copias de libros</h1>
            <Table
              columns={columns}
              data={copies}
              manager={true}
              updatefn={(copy) => {
                setSelectedCopy(copy);
                setShowUpdateModal(true);
              }}
              deletefn={onDeleteCopy}
              hideTimestamps={true}
            />
          </div>
        ) : (
          <p>No hay copias registradas</p>
        )}
      </div>
    </div>
  );
}
