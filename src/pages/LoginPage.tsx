import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Login.css';

export default function LoginPage() {
  return (
    <>
      <Navbar isLoggedIn={false} />

      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-card-body">
            <h1 className="page-title auth-title">Iniciar sesión</h1>

            <form className="auth-form">
              <div className="field-group">
                <label className="field-label">Usuario</label>
                <input type="text" className="auth-input" placeholder="Ingresá tu usuario" />
              </div>

              <div className="field-group field-group-last">
                <label className="field-label">Email</label>
                <input type="email" className="auth-input" placeholder="Ingresá tu email" />
              </div>

              <button type="button" className="primary-button auth-submit-button">
                Iniciar sesión
              </button>
            </form>

            <p className="auth-footer">
              ¿No tenés una cuenta?{' '}
              <Link to="/registro">Registrate</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
