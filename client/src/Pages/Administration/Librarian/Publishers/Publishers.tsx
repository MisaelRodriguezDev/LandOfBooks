import { useEffect, useState } from "react";
import Table from "@/components/ui/Table/Table";
import { getAllPublishersFromAdminRequest, deletePublisherRequest } from "@/services/publishers";
import type { Publisher } from "@/types/publishers";
import useDynamicColumns from "@/hooks/useDynamicColumns";
import Button from "@/components/ui/Button/Button";
import styles from '@/styles/Table.module.css';
import CreatePublisher from "@/Managment/Publishers/Create";
import Modal from "@/components/ui/Modal/Modal";
import UpdatePublisher from "@/Managment/Publishers/Update";

export default function PublishersManagment() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const columns = useDynamicColumns<Publisher>(publishers, {
    labels: {
      name: "Nombre",
      phone: "Teléfono",
      image_url: "Imagen",
      enabled: "Estado"
    }
  });

  const fetchData = async () => {
    try {
      const result = await getAllPublishersFromAdminRequest();
      setPublishers(result.data);
    } catch {
      console.error("Error al obtener editoriales");
    }
  };

  const onSuccessCreated = async () => {
    await fetchData();
    setShowRegisterModal(false);
  };

  const onSuccessUpdated = async () => {
    await fetchData();
    setShowUpdateModal(false);
    setSelectedPublisher(null);
  };

  const onDeletePublisher = async (publisher: Publisher) => {
    const confirmed = confirm(`¿Seguro que deseas eliminar a ${publisher.name}?`);
    if (!confirmed) return;

    try {
      await deletePublisherRequest(publisher.id);
      await fetchData();
    } catch (error) {
      console.error("Error eliminando editorial:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {showRegisterModal && (
        <Modal onClose={() => setShowRegisterModal(false)}>
          <CreatePublisher onSuccess={onSuccessCreated} />
        </Modal>
      )}
      {showUpdateModal && selectedPublisher && (
        <Modal onClose={() => { setShowUpdateModal(false); setSelectedPublisher(null); }}>
          <UpdatePublisher
            id={selectedPublisher.id}
            initialData={selectedPublisher}
            onSuccess={onSuccessUpdated}
          />
        </Modal>
      )}
      <div>
        <Button
          content="Crear editorial"
          content_loading="Creando editorial..."
          loading={false}
          enabled={true}
          action="create"
          fn={() => setShowRegisterModal(true)}
        />
      </div>
      <div className={styles.table_wrapper}>
        {publishers.length > 0 ? (
          <div className={styles.table_container}>
            <h1>Lista de editoriales</h1>
            <Table
              columns={columns}
              data={publishers}
              manager={true}
              updatefn={(publisher) => {
                setSelectedPublisher(publisher);
                setShowUpdateModal(true);
              }}
              deletefn={onDeletePublisher}
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
