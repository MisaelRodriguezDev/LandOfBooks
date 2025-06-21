import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import styles from "./Main.module.css"

function Layout() {
    return (
        <>
            <Navbar/>
            <main className={styles.main}>
                <Outlet/>
            </main>
            <Footer/>
        </>
    )
}

export default Layout