import styles from "./Footer.module.css"

function Footer() {
    return (
        <footer>
        <div className={styles.footer_grid}>
            <div className={styles.footer_column}>
                <h3>Horarios</h3>
                <ul>
                    <li>Lunes-Viernes: 9am - 7pm</li>
                    <li>Sábados: 9am - 2pm</li>
                    <li>Domingos: Cerrado</li>
                </ul>
            </div>


            <div className={styles.footer_column}>
                <h3>Contacto</h3>
                <ul>
                    <li>Calle Libro 123, Ciudad</li>
                    <li>Tel: 555-1234</li>
                    <li>Email: contacto@biblioteca.org</li>
                </ul>

                <div className={styles.social_links}>
                    <a href="#">📘</a>
                    <a href="#">📱</a>
                    <a href="#">✉️</a>
                    <a href="#">🔔</a>
                </div>
            </div>
        </div>

        <div className={styles.copyright}>
            © 2025 Land Of Books. Todos los derechos reservados.
        </div>
    </footer>
    )
};

export default Footer;