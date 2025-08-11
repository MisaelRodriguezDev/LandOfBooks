import { useEffect, useState } from "react";
import Table from "@/components/ui/Table/Table";
import { getAllAuthorsFromAdminRequest, deleteAuthorRequest } from "@/services/authors";
import type { Author } from "@/types/authors";
import useDynamicColumns from "@/hooks/useDynamicColumns";
import Button from "@/components/ui/Button/Button";
import styles from '@/styles/Table.module.css';
import CreateAuthor from "@/Managment/Authors/Create";
import Modal from "@/components/ui/Modal/Modal";
import UpdateAuthor from "@/Managment/Authors/Update";

export default function AuthorsManagment() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const columns = useDynamicColumns<Author>(authors, {
    labels: {
      first_name: "Nombre",
      last_name: "Apellido",
      pseudonym: "Pseudónimo",
      nationality: "Nacionalidad",
      enabled: "Estado"
    }
  });

  const fetchData = async () => {
    try {
      const result = await getAllAuthorsFromAdminRequest();
      setAuthors(result.data);
    } catch {
      console.error("Error al obtener autores");
    }
  };

  const onSuccessCreated = async () => {
    await fetchData();
    setShowRegisterModal(false);
  };

  const onSuccessUpdated = async () => {
    await fetchData();
    setShowUpdateModal(false);
    setSelectedAuthor(null);
  };

  const onDeleteAuthor = async (author: Author) => {
    const confirmed = confirm(`¿Seguro que deseas eliminar a ${author.first_name} ${author.last_name}?`);
    if (!confirmed) return;

    try {
      await deleteAuthorRequest(author.id);
      await fetchData();
    } catch (error) {
      console.error("Error eliminando autor:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {showRegisterModal && (
        <Modal onClose={() => setShowRegisterModal(false)}>
          <CreateAuthor onSuccess={onSuccessCreated} />
        </Modal>
      )}
      {showUpdateModal && selectedAuthor && (
        <Modal onClose={() => { setShowUpdateModal(false); setSelectedAuthor(null); }}>
          <UpdateAuthor
            id={selectedAuthor.id}
            initialData={selectedAuthor}
            onSuccess={onSuccessUpdated}
          />
        </Modal>
      )}
      <div>
        <Button
          content="Crear autor"
          content_loading="Creando autor..."
          loading={false}
          enabled={true}
          action="create"
          fn={() => setShowRegisterModal(true)}
        />
      </div>
      <div className={styles.table_wrapper}>
        {authors.length > 0 ? (
          <div className={styles.table_container}>
            <h1>Lista de autores</h1>
            <Table
              columns={columns}
              data={authors}
              manager={true}
              updatefn={(author) => {
                setSelectedAuthor(author);
                setShowUpdateModal(true);
              }}
              deletefn={onDeleteAuthor}
              hideTimestamps={true}
            />
          </div>
        ) : (
          <p>No hay datos</p>
        )}
      </div>
    </div>
  );
}
