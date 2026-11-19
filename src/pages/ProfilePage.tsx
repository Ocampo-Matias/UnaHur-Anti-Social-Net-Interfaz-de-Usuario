import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { getPosts, getPostImages, getCommentsByPost } from '../services/api';
import type { PostUI } from '../types';
import '../styles/Profile.css';

export default function ProfilePage() {
  const { user, isLoggedIn } = useAuth();
  const [profilePosts, setProfilePosts] = useState<PostUI[]>([]);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let ignore = false;

    async function loadProfilePosts() {
      try {
        setLoading(true);
        setError(null);
        const apiPosts = await getPosts(user!.id);

        if (ignore) return;

        const postsWithData: PostUI[] = await Promise.all(
          apiPosts.map(async (p) => {
            const [images, comments] = await Promise.all([
              getPostImages(p.id).catch(() => []),
              getCommentsByPost(p.id).catch(() => []),
            ]);

            return {
              id: p.id,
              user: user!.nickName,
              description: p.description,
              images: images.map((img) => img.url),
              tags: p.Tags?.map((t) => `#${t.name}`) || [],
              visibleComments: comments.length,
            };
          })
        );

        if (!ignore) {
          setProfilePosts(postsWithData);
        }
      } catch {
        if (!ignore) {
          setProfilePosts([]);
          setError('No se pudieron cargar tus publicaciones. Intentá nuevamente.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProfilePosts();

    return () => {
      ignore = true;
    };
  }, [user]);

  if (!isLoggedIn || !user) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="card text-center p-5 my-4">
            <h2 className="section-title mb-2">No iniciaste sesión</h2>
            <p className="text-muted mb-4">
              Iniciá sesión para ver tu perfil y tus publicaciones compartidas.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/iniciar-sesion" className="primary-button">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="secondary-button">
                Registrarse
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const initial = (user.nickName || 'U').charAt(0).toUpperCase();

  return (
    <>
      <Navbar />

      <main className="page-shell">
        <section className="profile-header">
          <div className="profile-header-body">
            <div className="profile-header-content">
              <div className="profile-avatar">{initial}</div>
              <div>
                <p className="profile-label">Tu Perfil</p>
                <h1 className="page-title">{user.nickName}</h1>
                <p className="text-muted small mb-0">{user.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-posts">
          <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
            <h2 className="section-title mb-0">Tus Publicaciones ({profilePosts.length})</h2>
            <Link to="/crear-publicacion" className="primary-button primary-button-small">
              Nueva publicación
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <p className="text-muted">Cargando tus publicaciones...</p>
            </div>
          ) : error ? (
            <div className="alert alert-warning text-center" role="alert">
              {error}
            </div>
          ) : profilePosts.length === 0 ? (
            <div className="text-center py-5 card p-4">
              <p className="text-muted mb-3">Aún no creaste ninguna publicación.</p>
            </div>
          ) : (
            <div className="profile-posts-grid">
              {profilePosts.map((post) => (
                <PostCard key={post.id} post={post} variant="profile" />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
