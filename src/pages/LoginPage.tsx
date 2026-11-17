import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [nickName, setNickName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickName.trim()) {
      setError('Por favor ingresá tu usuario.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor ingresá tu contraseña.');
      return;
    }
    if (password !== '123456') {
      setError('Contraseña incorrecta. Debe ser 123456');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await login(nickName.trim());
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('No se pudo iniciar sesión. Verificá tu usuario.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-card-body">
            <h1 className="page-title auth-title">Iniciar sesión</h1>

            {error && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="field-group field-group-last">
                <label className="field-label" htmlFor="login-nickname">
                  Usuario (nickName)
                </label>
                <input
                  id="login-nickname"
                  type="text"
                  className="auth-input"
                  placeholder="Ej: luna, sol..."
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  disabled={submitting}
                  autoComplete="username"
                  required
                />


              </div>
              <div className="field-group field-group-last">
                <label className="field-label" htmlFor="login-password">
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  className="auth-input"
                  placeholder="Ingresá 123456"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button auth-submit-button"
                disabled={submitting || !nickName.trim() || !password.trim()}
              >
                {submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="auth-footer">
              ¿No tenés una cuenta? <Link to="/registro">Registrate</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
