import { Link, useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/CreatePostForm';
import Navbar from '../components/Navbar';

export default function CreatePostPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="page-shell">
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <h1 className="page-title mb-0">Crear publicación</h1>
          <Link to="/perfil" className="secondary-button secondary-button-small">
            Volver al perfil
          </Link>
        </div>
        <CreatePostForm onCreated={() => navigate('/perfil')} />
      </main>
    </>
  );
}
