import { useEffect, useState } from "react";
import Table from "@/components/ui/Table/Table";
import { getAllGenresFromAdminRequest, deleteGenreRequest } from "@/services/genres";
import type{ Genre } from "@/types/genres";
import useDynamicColumns from "@/hooks/useDynamicColumns";
import Button from "@/components/ui/Button/Button";
import styles from '@/styles/Table.module.css'
import CreateGenre from "@/Managment/Genres/Create";
import Modal from "@/components/ui/Modal/Modal";
import UpdateGenre from "@/Managment/Genres/Update";

export default function GenresManagment() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const columns = useDynamicColumns<Genre>(genres, 
    {
      labels: {
        name: "Nombre",
        description: "Descripción",
        enabled: "Status"
      }
    }
  )

  const fetchData = async () => {
    try {
      const result = await getAllGenresFromAdminRequest()
      setGenres(result.data)
    } catch {
      console.error("Error")
    }
  }

  const onSuccessCreated = async() => {
    fetchData()
    setShowRegisterModal(false)
  }

  const onSuccessUpdated = async () => {
    fetchData();
    setShowUpdateModal(false);
    setSelectedGenre(null);
  };

  const onDeleteGenre = async (genre: Genre) => {
  const confirmed = confirm(`¿Seguro que deseas eliminar a ${genre.name}?`);
  if (!confirmed) return;

  try {
    await deleteGenreRequest(genre.id); 
    await fetchData(); 
  } catch (error) {
    console.error("Error eliminando género:", error);
  }
};


  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      {showRegisterModal && (
        <Modal onClose={() => setShowRegisterModal(false)}>
          <CreateGenre onSuccess={onSuccessCreated}/>
        </Modal>
      )}
      {showUpdateModal && selectedGenre && (
  <Modal onClose={() => { setShowUpdateModal(false); setSelectedGenre(null); }}>
    <UpdateGenre
      id={selectedGenre.id}
      initialData={selectedGenre}
      onSuccess={onSuccessUpdated}
    />
  </Modal>
)}
      { genres.length > 0 && <div>
        <Button
          content="Crear género"
          content_loading="Crear género"
          loading={false}
          enabled={true}
          action='create'
          fn={() => setShowRegisterModal(true)}
        />
      </div>}
      <div className={styles.table_wrapper}>
        {genres.length > 0 ? <div className={styles.table_container}>
        <h1>Lista de géneros</h1>
        <Table 
          columns={columns} 
          data={genres} 
          manager={true}
          updatefn={(genre) => {
            setSelectedGenre(genre);
            setShowUpdateModal(true);
          }}
          deletefn={onDeleteGenre}
          hideTimestamps={true}
        />
      </div> : <p>No data</p> }

      </div>
    </div>
  );
}