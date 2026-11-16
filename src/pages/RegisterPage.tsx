import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickName.trim() || !email.trim()) {
      setError('Por favor completá todos los campos.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await register(nickName.trim(), email.trim());
      navigate('/');
    } catch {
      setError('No se pudo registrar el usuario. Es posible que el nickName ya exista.');
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
            <h1 className="page-title auth-title">Registrarse</h1>

            {error && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label" htmlFor="register-nickname">
                  Usuario (nickName)
                </label>
                <input
                  id="register-nickname"
                  type="text"
                  className="auth-input"
                  placeholder="Ej: nuevoUsuario"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  disabled={submitting}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="field-group field-group-last">
                <label className="field-label" htmlFor="register-email">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  className="auth-input"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  autoComplete="email"
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button auth-submit-button"
                disabled={submitting || !nickName.trim() || !email.trim()}
              >
                {submitting ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>

            <p className="auth-footer">
              ¿Ya tenés una cuenta? <Link to="/iniciar-sesion">Iniciá sesión</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
