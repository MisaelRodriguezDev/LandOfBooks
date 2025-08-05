import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLogo}>
        </div>
        <h1 className={styles.headerTitle}>AVISO DE PRIVACIDAD</h1>
        <p className={styles.headerSubtitle}>Land Of Books está comprometido con la protección de tus datos personales</p>
      </header>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <div className={styles.sectionIcon}></div>
            Responsable de tus datos
          </h2>
          <div className={styles.infoBox}>
            <p className={styles.infoBoxText}><strong>Nombre de la empresa:</strong> Land Of Books</p>
            <p className={styles.infoBoxText}><strong>Domicilio:</strong> Blvrd Juan Pablo II 1302, Ex hacienda la Cantera, 20200 Aguascalientes, Ags.</p>
            <p className={styles.infoBoxText}>Somos el responsable del uso y protección de sus datos personales.</p>
          </div>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <div className={styles.sectionIcon}></div>
            Finalidades Primarias
          </h2>
          <p className={styles.sectionText}>Los datos personales que recabamos de usted, los utilizaremos para las siguientes finalidades que son necesarias para el servicio que solicita:</p>
          <ul className={styles.sectionList}>
            <li className={styles.sectionListItem}>Respuesta a mensajes del formulario de contacto</li>
            <li className={styles.sectionListItem}>Prestación de cualquier servicio solicitado</li>
            <li className={styles.sectionListItem}>Atender y dar seguimiento a solicitudes realizadas a través del formulario de contacto</li>
            <li className={styles.sectionListItem}>Gestionar sanciones o penalizaciones conforme al reglamento de uso del servicio</li>
            <li className={styles.sectionListItem}>Realizar estadísticas internas sobre el uso del sitio y de los servicios bibliotecarios, con fines de mejora continua</li>
          </ul>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <div className={styles.sectionIcon}></div>
            Datos Personales Recabados
          </h2>
          <p className={styles.sectionText}>Para las finalidades señaladas en el presente aviso de privacidad, podemos recabar los siguientes datos personales:</p>
          <div className={styles.infoBox}>
            <ul className={styles.sectionList}>
              <li className={styles.sectionListItem}>Datos de identificación (nombre completo, fecha de nacimiento, etc.)</li>
              <li className={styles.sectionListItem}>Datos de contacto (correo electrónico, teléfono, dirección)</li>
              <li className={styles.sectionListItem}>Comentarios y opiniones proporcionadas voluntariamente</li>
              <li className={styles.sectionListItem}>Preferencias de lectura e intereses literarios</li>
              <li className={styles.sectionListItem}>Historial de servicios utilizados</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <div className={styles.sectionIcon}></div>
            Transferencia de Datos
          </h2>
          <p className={styles.sectionText}>Le informamos que sus datos personales son compartidos fuera del país con las siguientes personas, empresas, organizaciones o autoridades distintas a nosotros, para los siguientes fines:</p>
          <div className={styles.infoBox}>
            <p className={styles.infoBoxText}><strong>Proveedores de servicios tecnológicos:</strong> Almacenamiento, gestión y mantenimiento de la base de datos y plataforma del sitio web.</p>
            <p className={styles.infoBoxText}><strong>Proveedores de servicios de correo electrónico:</strong> Envío de notificaciones, recordatorios, boletines y comunicaciones relacionadas con el servicio.</p>
          </div>
          <p className={styles.sectionText}>En todos los casos, requerimos que dichos terceros mantengan la confidencialidad de sus datos personales y los utilicen exclusivamente para los fines para los cuales fueron contratados.</p>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <div className={styles.sectionIcon}></div>
            Derechos ARCO
          </h2>
          <p className={styles.sectionText}>Usted tiene derecho a:</p>
          <ul className={styles.sectionList}>
            <li className={styles.sectionListItem}><strong>Acceso:</strong> Conocer qué datos personales tenemos de usted y para qué los utilizamos</li>
            <li className={styles.sectionListItem}><strong>Rectificación:</strong> Solicitar la corrección de su información personal si está desactualizada, es inexacta o incompleta</li>
            <li className={styles.sectionListItem}><strong>Cancelación:</strong> Solicitar que eliminemos sus datos de nuestros registros</li>
            <li className={styles.sectionListItem}><strong>Oposición:</strong> Oponerse al uso de sus datos personales para fines específicos</li>
          </ul>
          <div className={styles.infoBox}>
            <p className={styles.infoBoxText}>Para ejercer cualquiera de estos derechos, presente su solicitud a través del mismo correo electrónico desde donde realizó su solicitud original.</p>
            <p className={styles.infoBoxText}><strong>Plazo de respuesta:</strong> Atenderemos su solicitud en un plazo máximo de 15 días hábiles.</p>
          </div>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <div className={styles.sectionIcon}></div>
            Datos Recabados por el Sitio Web
          </h2>
          <p className={styles.sectionText}>Nuestro sitio web recaba automáticamente los siguientes datos:</p>
          <div className={styles.infoBox}>
            <ul className={styles.sectionList}>
              <li className={styles.sectionListItem}>Identificadores, nombre de usuario y contraseñas de sesión</li>
              <li className={styles.sectionListItem}>Idioma preferido por el usuario</li>
              <li className={styles.sectionListItem}>Región en la que se encuentra el usuario</li>
              <li className={styles.sectionListItem}>Fecha y hora del inicio y final de una sesión de un usuario</li>
              <li className={styles.sectionListItem}>Páginas web visitadas por un usuario</li>
              <li className={styles.sectionListItem}>Búsquedas realizadas por un usuario</li>
              <li className={styles.sectionListItem}>Dirección IP</li>
              <li className={styles.sectionListItem}>Datos técnicos del dispositivo (navegador, sistema operativo, etc.)</li>
              <li className={styles.sectionListItem}>Datos voluntarios que el usuario proporcione mediante formularios</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.contactSection}>
          <div className={styles.contactCard}>
            <h3 className={styles.contactCardTitle}>Contacto</h3>
            <p className={styles.contactCardText}>Para más información sobre este aviso de privacidad, puede contactarnos en:</p>
            <p className={styles.contactCardText}><strong>Correo electrónico:</strong> <a href="mailto:220667@utags.edu.mx" className={styles.contactCardLink}>220667@utags.edu.mx</a></p>
            <p className={styles.contactCardText}><strong>Sitio web:</strong> <a href="https://localhost:5173" target="_blank" rel="noopener noreferrer" className={styles.contactCardLink}>https://localhost:5173</a></p>
          </div>
          
          <div className={styles.contactCard}>
            <h3 className={styles.contactCardTitle}>Protección de Datos</h3>
            <p className={styles.contactCardText}>Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger sus datos personales contra daño, pérdida, alteración, destrucción o el uso, acceso o tratamiento no autorizado.</p>
            <p className={styles.contactCardText}>Solo el personal autorizado tiene acceso a la información personal, y únicamente para los fines establecidos en este aviso.</p>
          </div>
        </div>
        
        <div className={styles.updateInfo}>
          <div className={styles.updateInfoIcon}></div>
          <p className={styles.updateInfoText}><strong>Última actualización:</strong> 2 de julio de 2025</p>
        </div>
      </div>
      
      <footer className={styles.footer}>
        <p className={styles.footerText}>&copy; 2025 Land Of Books. Todos los derechos reservados.</p>
        <p className={styles.footerText}>Este aviso de privacidad establece la forma en que recopilamos, utilizamos y protegemos su información personal.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;