import { useEffect, useState } from "react";
import Table from "./components/ui/Table/Table";
import { getAllUsers } from "./services/librarian";
import { deleteUserFromAdminRequest } from "./services/admin";
import type{ UserProfile } from "./types/user";
import useDynamicColumns from "./hooks/useDynamicColumns";
import Button from "./components/ui/Button/Button";
import styles from './styles/Table.module.css'
import CreateUser from "./Managment/Users/Create";
import Modal from "./components/ui/Modal/Modal";
import UpdateUser from "./Managment/Users/Update";

export default function App() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const columns = useDynamicColumns<UserProfile>(users, 
    {
      exclude: ['image_url', 'mfa_active'], 
      labels: {
        first_name: "Nombres", 
        last_name: "Apellidos", 
        email: "Correo", 
        enabled: "Status"
      }
    }
  )

  const fetchData = async () => {
    try {
      const result = await getAllUsers()
      setUsers(result.data)
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
    setSelectedUser(null);
  };

  const onDeleteUser = async (user: UserProfile) => {
  const confirmed = confirm(`¿Seguro que deseas eliminar a ${user.first_name}?`);
  if (!confirmed) return;

  try {
    await deleteUserFromAdminRequest(user.id); 
    await fetchData(); 
  } catch (error) {
    console.error("Error eliminando usuario:", error);
  }
};


  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      {showRegisterModal && (
        <Modal onClose={() => setShowRegisterModal(false)}>
          <CreateUser onSuccess={onSuccessCreated}/>
        </Modal>
      )}
      {showUpdateModal && selectedUser && (
  <Modal onClose={() => { setShowUpdateModal(false); setSelectedUser(null); }}>
    <UpdateUser
      id={selectedUser.id}
      initialData={{
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser.role
      }}
      onSuccess={onSuccessUpdated}
    />
  </Modal>
)}
      { users.length > 0 && <div>
        <Button
          content="Crear usuario"
          content_loading="Crear usuario"
          loading={false}
          enabled={true}
          action='create'
          fn={() => setShowRegisterModal(true)}
        />
      </div>}
      <div className={styles.table_wrapper}>
        {users.length > 0 ? <div className={styles.table_container}>
        <h1>Lista de usuarios</h1>
        <Table 
          columns={columns} 
          data={users} 
          manager={true}
          updatefn={(user) => {
            setSelectedUser(user);
            setShowUpdateModal(true);
          }}
          deletefn={onDeleteUser}
          hideTimestamps={true}
        />
      </div> : <p>No data</p> }

      </div>
    </div>
  );
}