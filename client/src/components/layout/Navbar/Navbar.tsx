import styles from "./Navbar.module.css"
import logo from "../../../assets/logo.svg"

function Navbar() {
    return (
        <header>
            <div className={styles.logo}>
                <img src={logo} alt="Logo Biblioteca"/>
                <h1>Land Of Books</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Catálogo</a></li>
                    <li><a href="#">Contacto</a></li>
                    <li><a href="#">Mi Cuenta</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar