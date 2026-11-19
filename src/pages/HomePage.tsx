import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import CreatePostForm from '../components/CreatePostForm';
import { useAuth } from '../context/AuthContext';
import { getPosts, getPostImages, getCommentsByPost } from '../services/api';
import type { PostUI } from '../types';
import '../styles/Home.css';

async function loadFeedPosts(): Promise<PostUI[]> {
  const apiPosts = await getPosts();

  return Promise.all(
    apiPosts.map(async (post) => {
      const [images, comments] = await Promise.all([
        getPostImages(post.id).catch(() => []),
        getCommentsByPost(post.id).catch(() => []),
      ]);

      return {
        id: post.id,
        user: post.User?.nickName || 'Usuario anónimo',
        description: post.description,
        images: images.map((image) => image.url),
        tags: post.Tags?.map((tag) => `#${tag.name}`) || [],
        visibleComments: comments.length,
      };
    })
  );
}

export default function HomePage() {
  const { isLoggedIn } = useAuth();

  const [posts, setPosts] = useState<PostUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState('all');

  const availableTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) =>
    a.localeCompare(b, 'es', { sensitivity: 'base' })
  );
  const filteredPosts =
    selectedTag === 'all'
      ? posts
      : posts.filter((post) =>
          post.tags.some((tag) => tag.toLocaleLowerCase() === selectedTag.toLocaleLowerCase())
        );

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      setPosts(await loadFeedPosts());
    } catch {
      setError(
        'No se pudo conectar con el backend. Asegurate de que esté corriendo en http://localhost:3001.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadInitialFeed() {
      try {
        setError(null);
        const loadedPosts = await loadFeedPosts();
        if (!ignore) setPosts(loadedPosts);
      } catch {
        if (!ignore) {
          setError(
            'No se pudo conectar con el backend. Asegurate de que esté corriendo en http://localhost:3001.'
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadInitialFeed();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-shell">
        {isLoggedIn ? (
          <CreatePostForm
            onCreated={() => {
              setSelectedTag('all');
              void fetchFeed();
            }}
          />
        ) : (
          <section className="composer-card mb-4 text-center p-4">
            <h3 className="h5 mb-2">¡Bienvenido a UnaHur Anti-Social!</h3>
            <p className="text-muted mb-3">
              Iniciá sesión o registrate para poder publicar fotos, reflexiones y comentar.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/iniciar-sesion" className="primary-button primary-button-small">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="secondary-button secondary-button-small">
                Registrarse
              </Link>
            </div>
          </section>
        )}

        <section className="feed-section">
          <div className="feed-header">
            <h2 className="section-title">Publicaciones</h2>
            {posts.length > 0 && (
              <div className="feed-filter">
                <label htmlFor="feed-tag-filter">Filtrar por etiqueta</label>
                <select
                  id="feed-tag-filter"
                  className="feed-tag-filter"
                  value={selectedTag}
                  onChange={(event) => setSelectedTag(event.target.value)}
                >
                  <option value="all">Todas las etiquetas</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {loading && (
            <div className="text-center py-5">
              <p className="text-muted">Cargando publicaciones desde el backend...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-warning text-center my-3" role="alert">
              <p className="mb-2">{error}</p>
              <button
                type="button"
                className="secondary-button secondary-button-small"
                onClick={fetchFeed}
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">Aún no hay publicaciones. ¡Sé el primero en crear una!</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">No hay publicaciones con esta etiqueta.</p>
            </div>
          )}

          {!loading && !error && filteredPosts.length > 0 && (
            <div className="feed-grid">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
