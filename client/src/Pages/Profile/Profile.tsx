import { useAuth } from "@/context/AuthProvider";
import styles from "./Profile.module.css"

function ProfilePage() {
    const {user} = useAuth();

    return (
        <div className={styles.profileContent}>
            <aside className={styles.sidebar}>
                <img src={user?.image_url} alt="Profile" className={styles.profileAvatar} />
                <h1 className={styles.profileName}>{user?.first_name} {user?.last_name}</h1>
                <p className={styles.profileUsername}>@{user?.username}</p>
                <p>{user?.email}</p>
                <p>{user?.role}</p>
                <p>{user?.mfa_active}</p>

                {/*<button className={styles.editProfileButton}>Edit profile</button>*/}
            </aside>
            <main className={styles.mainContent}>

            </main>
        </div>
    )

};

export default ProfilePage;