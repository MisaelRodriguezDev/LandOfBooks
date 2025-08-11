import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "@/assets/logo.svg";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import {
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiHome,
  FiBookOpen,
  FiLogOut,
  FiUsers,
  FiTag,
  FiBook,
  FiFileText,
  FiClipboard,
  FiCopy
} from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();

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

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (path: string) => activePath === path;
  const isPartialMatch = (path: string) =>
    activePath.startsWith(path) && path !== "/";

  // Verifica si el usuario es bibliotecario o admin
  const canAccessLibraryMenu =
    user && ["librarian", "admin"].includes(user.role);

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
                <Link to="/" className={isActive("/") ? styles.active : ""}>
                  <FiHome className={styles.navIcon} />
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className={isActive("/catalog") ? styles.active : ""}
                >
                  <FiBookOpen className={styles.navIcon} />
                  <span>Catálogo</span>
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className={
                        isActive("/profile") || isPartialMatch("/profile")
                          ? styles.active
                          : ""
                      }
                    >
                      <FiUser className={styles.navIcon} />
                      <span>Mi Cuenta</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className={`${styles.navLink} ${styles.logoutButton}`}
                      type="button"
                    >
                      <FiLogOut className={styles.navIcon} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className={isActive("/login") ? styles.active : ""}
                    >
                      <span>Iniciar Sesión</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className={`${isActive("/register") ? styles.active : ""} ${
                        styles.highlight
                      }`}
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

      {/* --- Menú extra para bibliotecarios y admins (desktop) --- */}
      {canAccessLibraryMenu && (
        <div className={styles.libraryMenuDesktop}>
          <nav className={styles.nav}>
            <ul>
              {user.role == "admin" && <li>
                <Link
                  to="/dashboard/users"
                  className={isActive("/dashboard/users") ? styles.active : ""}
                >
                  <FiUsers className={styles.navIcon} />
                  <span>Usuarios</span>
                </Link>
              </li>}
              <li>
                <Link
                  to="/dashboard/genres"
                  className={isActive("/dashboard/genres") ? styles.active : ""}
                >
                  <FiTag className={styles.navIcon} />
                  <span>Géneros</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/books"
                  className={isActive("/dashboard/books") ? styles.active : ""}
                >
                  <FiBook className={styles.navIcon} />
                  <span>Libros</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/copies"
                  className={isActive("/dashboard/copies") ? styles.active : ""}
                >
                  <FiCopy className={styles.navIcon} />
                  <span>Copias</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/authors"
                  className={isActive("/dashboard/authors") ? styles.active : ""}
                >
                  <FiFileText className={styles.navIcon} />
                  <span>Autores</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/loans"
                  className={isActive("/dashboard/loans") ? styles.active : ""}
                >
                  <FiClipboard className={styles.navIcon} />
                  <span>Préstamos</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* --- Menú móvil --- */}
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
                className={isActive("/") ? styles.active : ""}
                onClick={closeMenu}
              >
                <FiHome className={styles.navIcon} />
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link
                to="/catalog"
                className={isActive("/catalog") ? styles.active : ""}
                onClick={closeMenu}
              >
                <FiBookOpen className={styles.navIcon} />
                <span>Catálogo</span>
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className={
                      isActive("/profile") || isPartialMatch("/profile")
                        ? styles.active
                        : ""
                    }
                    onClick={closeMenu}
                  >
                    <FiUser className={styles.navIcon} />
                    <span>Mi Cuenta</span>
                  </Link>
                </li>

                {/* Menú extra móvil para bibliotecarios y admins */}
                {canAccessLibraryMenu && (
                  <>
                    <li>
                      <Link
                        to="/dashboard/users"
                        className={
                          isActive("/dashboard/users") ? styles.active : ""
                        }
                        onClick={closeMenu}
                      >
                        <FiUsers className={styles.navIcon} />
                        <span>Usuarios</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/genres"
                        className={
                          isActive("/dashboard/genres") ? styles.active : ""
                        }
                        onClick={closeMenu}
                      >
                        <FiTag className={styles.navIcon} />
                        <span>Géneros</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/books"
                        className={
                          isActive("/dashboard/books") ? styles.active : ""
                        }
                        onClick={closeMenu}
                      >
                        <FiBook className={styles.navIcon} />
                        <span>Libros</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/copies"
                        className={isActive("/dashboard/copies") ? styles.active : ""}
                        onClick={closeMenu}
                      >
                        <FiCopy className={styles.navIcon} />
                        <span>Copias</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/authors"
                        className={
                          isActive("/dashboard/authors") ? styles.active : ""
                        }
                        onClick={closeMenu}
                      >
                        <FiFileText className={styles.navIcon} />
                        <span>Autores</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/loans"
                        className={
                          isActive("/dashboard/loans") ? styles.active : ""
                        }
                        onClick={closeMenu}
                      >
                        <FiClipboard className={styles.navIcon} />
                        <span>Préstamos</span>
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className={`${styles.navLink} ${styles.logoutButton}`}
                    type="button"
                  >
                    <FiLogOut className={styles.navIcon} />
                    <span>Cerrar Sesión</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={isActive("/login") ? styles.active : ""}
                    onClick={closeMenu}
                  >
                    <span>Iniciar Sesión</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={`${isActive("/register") ? styles.active : ""} ${
                      styles.highlight
                    }`}
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
