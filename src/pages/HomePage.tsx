import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import {
  getPosts,
  getTags,
  getPostImages,
  getCommentsByPost,
  createPost,
  createPostImage,
} from '../services/api';
import type { PostUI, Tag } from '../types';
import '../styles/Home.css';

export default function HomePage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostUI[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);

      const [apiPosts, apiTags] = await Promise.all([getPosts(), getTags()]);
      setTags(apiTags);

      const postsWithData: PostUI[] = await Promise.all(
        apiPosts.map(async (p) => {
          const [images, comments] = await Promise.all([
            getPostImages(p.id).catch(() => []),
            getCommentsByPost(p.id).catch(() => []),
          ]);

          return {
            id: p.id,
            user: p.User?.nickName || 'Usuario anónimo',
            description: p.description,
            images: images.map((img) => img.url),
            tags: p.Tags?.map((t) => `#${t.name}`) || [],
            visibleComments: comments.length,
          };
        })
      );

      setPosts(postsWithData);
    } catch {
      setError(
        'No se pudo conectar con el backend. Asegurate de que esté corriendo en http://localhost:3001.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadInitial() {
      try {
        setError(null);
        const [apiPosts, apiTags] = await Promise.all([getPosts(), getTags()]);
        if (ignore) return;
        setTags(apiTags);

        const postsWithData: PostUI[] = await Promise.all(
          apiPosts.map(async (p) => {
            const [images, comments] = await Promise.all([
              getPostImages(p.id).catch(() => []),
              getCommentsByPost(p.id).catch(() => []),
            ]);

            return {
              id: p.id,
              user: p.User?.nickName || 'Usuario anónimo',
              description: p.description,
              images: images.map((img) => img.url),
              tags: p.Tags?.map((t) => `#${t.name}`) || [],
              visibleComments: comments.length,
            };
          })
        );

        if (!ignore) {
          setPosts(postsWithData);
        }
      } catch {
        if (!ignore) {
          setError(
            'No se pudo conectar con el backend. Asegurate de que esté corriendo en http://localhost:3001.'
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      ignore = true;
    };
  }, []);


  const handleImageUrlChange = (index: number, value: string) => {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  };

  const handleAddImageField = () => {
    setImageUrls((prev) => [...prev, '']);
  };

  const handleRemoveImageField = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };


  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreatePost = async () => {
    if (!description.trim() || !user) return;

    try {
      setSubmitting(true);
      const newPost = await createPost({
        description: description.trim(),
        userId: user.id,
        tagIds: selectedTagIds,
      });

      const validUrls = imageUrls.map((url) => url.trim()).filter(Boolean);
      for (const url of validUrls) {
        await createPostImage({ url, postId: newPost.id });
      }

      setDescription('');
      setImageUrls(['']);
      setSelectedTagIds([]);

      navigate(`/publicacion/${newPost.id}`);
    } catch {
      alert('Ocurrió un error al crear la publicación.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-shell">
        {isLoggedIn ? (
          <section className="composer-card">
            <div className="composer-card-body">
              <h2 className="section-title">
                ¿Qué estás pensando{user?.nickName ? `, @${user.nickName}` : ''}?
              </h2>

              <div className="composer-field">
                <textarea
                  className="composer-input"
                  rows={4}
                  placeholder="Escribí tu publicación..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="composer-row">
                <div className="upload-box">
                  <span className="upload-label d-block mb-2">
                    Imágenes (URL) — podés agregar más de una
                  </span>

                  {imageUrls.map((url, index) => (
                    <div key={index} className="d-flex align-items-center gap-2 mb-2">
                      <input
                        type="url"
                        className="composer-input mb-0"
                        placeholder={`https://ejemplo.com/imagen${index + 1}.jpg`}
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          className="secondary-button secondary-button-small"
                          onClick={() => handleRemoveImageField(index)}
                          aria-label="Eliminar campo de imagen"
                          title="Eliminar"
                          style={{ flexShrink: 0 }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="secondary-button secondary-button-small mt-1"
                    onClick={handleAddImageField}
                  >
                    + Agregar otra imagen
                  </button>
                </div>

                <div className="tag-selector">
                  <span className="upload-label d-block mb-2">Etiquetas</span>
                  <div className="tag-list tag-list-inline">
                    {tags.length > 0 ? (
                      tags.map((tag) => {
                        const isSelected = selectedTagIds.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            className={`chip-button ${isSelected ? 'active' : ''}`}
                            onClick={() => handleTagToggle(tag.id)}
                          >
                            #{tag.name}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-muted small">Cargando etiquetas...</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="publish-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleCreatePost}
                  disabled={submitting || !description.trim()}
                >
                  {submitting ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </section>
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
            <Link to="/sobre-nosotros" className="text-link">
              Explorar
            </Link>
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

          {!loading && !error && posts.length > 0 && (
            <div className="feed-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
