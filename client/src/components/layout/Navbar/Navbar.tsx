// Navbar.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "@/assets/logo.svg";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { FiSearch, FiMenu, FiX, FiUser, FiHome, FiBookOpen } from "react-icons/fi";

function Navbar() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();

  // Actualizar ruta activa cuando cambia la ubicación
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Función para determinar si un enlace está activo
  const isActive = (path: string) => {
    return activePath === path;
  };

  // Función para determinar si una ruta coincide parcialmente (para secciones con subrutas)
  const isPartialMatch = (path: string) => {
    return activePath.startsWith(path) && path !== "/";
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo Biblioteca" />
          <h1>Land Of Books</h1>
        </div>

        <div className={styles.desktopNav}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar libros..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" aria-label="Buscar">
              <FiSearch size={20} />
            </button>
          </form>

          <nav className={styles.nav}>
            <ul>
              <li>
                <Link 
                  to="/" 
                  className={`${isActive("/") ? styles.active : ""}`}
                >
                  <FiHome className={styles.navIcon} />
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/catalog" 
                  className={`${isActive("/catalog") ? styles.active : ""}`}
                >
                  <FiBookOpen className={styles.navIcon} />
                  <span>Catálogo</span>
                </Link>
              </li>
              {user ? (
                <li>
                  <Link 
                    to="/profile" 
                    className={`${isActive("/profile") || isPartialMatch("/profile") ? styles.active : ""}`}
                  >
                    <FiUser className={styles.navIcon} />
                    <span>Mi Cuenta</span>
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className={`${isActive("/login") ? styles.active : ""}`}
                    >
                      <span>Iniciar Sesión</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className={`${isActive("/register") ? styles.active : ""} ${styles.highlight}`}
                    >
                      <span>Registrate</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        <button 
          className={styles.menuToggle} 
          onClick={toggleMenu} 
          aria-label="Menú"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
        <form className={styles.mobileSearch} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar libros..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            <FiSearch />
          </button>
        </form>

        <nav className={styles.mobileNav}>
          <ul>
            <li>
              <Link 
                to="/" 
                className={`${isActive("/") ? styles.active : ""}`}
                onClick={closeMenu}
              >
                <FiHome className={styles.navIcon} />
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/catalog" 
                className={`${isActive("/catalog") ? styles.active : ""}`}
                onClick={closeMenu}
              >
                <FiBookOpen className={styles.navIcon} />
                <span>Catálogo</span>
              </Link>
            </li>
            {user ? (
              <li>
                <Link 
                  to="/profile" 
                  className={`${isActive("/profile") || isPartialMatch("/profile") ? styles.active : ""}`}
                  onClick={closeMenu}
                >
                  <FiUser className={styles.navIcon} />
                  <span>Mi Cuenta</span>
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className={`${isActive("/login") ? styles.active : ""}`}
                    onClick={closeMenu}
                  >
                    <span>Iniciar Sesión</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className={`${isActive("/register") ? styles.active : ""} ${styles.highlight}`}
                    onClick={closeMenu}
                  >
                    <span>Registrate</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;