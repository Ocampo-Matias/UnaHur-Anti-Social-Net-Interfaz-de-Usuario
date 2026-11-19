import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

type NavbarProps = {
  isLoggedIn?: boolean;
};

export default function Navbar({ isLoggedIn: propIsLoggedIn }: NavbarProps) {
  const { user, isLoggedIn: authIsLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : authIsLoggedIn;

  const toggleNav = () => setIsNavCollapsed((prev) => !prev);
  const closeNav = () => setIsNavCollapsed(true);

  const handleLogout = () => {
    closeNav();
    logout();
    navigate('/');
  };

  const menuItems = isLoggedIn
    ? [
        { label: 'Home', to: '/' },
        { label: 'Sobre nosotros', to: '/sobre-nosotros' },
        { label: 'Perfil', to: '/perfil' },
      ]
    : [
        { label: 'Home', to: '/' },
        { label: 'Sobre nosotros', to: '/sobre-nosotros' },
        { label: 'Iniciar sesión', to: '/iniciar-sesion' },
        { label: 'Registrarse', to: '/registro' },
      ];

  return (
    <header className="top-navbar">
      <nav className="navbar navbar-expand-md custom-navbar p-0">
        <div className="container-fluid navbar-shell d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand brand-logo" onClick={closeNav}>
            <img className="brand-mark" src="/logo-180.png" alt="" />
            <span className="brand-name">
              UnaHur <span className="brand-accent">Anti-Social</span>
            </span>
          </Link>

          <button
            className="navbar-toggler custom-toggler"
            type="button"
            onClick={toggleNav}
            aria-controls="mainNavbar"
            aria-expanded={!isNavCollapsed}
            aria-label="Abrir menú de navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`}
            id="mainNavbar"
          >
            <ul className="navbar-nav ms-auto align-items-md-center gap-1 gap-md-2 mt-3 mt-md-0 mb-0">
              {menuItems.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link custom-nav-link ${isActive ? 'active' : ''}`
                    }
                    onClick={closeNav}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}

              {isLoggedIn && (
                <li className="nav-item ms-md-2">
                  <button
                    type="button"
                    className="nav-link custom-nav-link text-danger border-0 bg-transparent"
                    onClick={handleLogout}
                    title={user?.nickName ? `Conectado como ${user.nickName}` : undefined}
                  >
                    Cerrar sesión
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
