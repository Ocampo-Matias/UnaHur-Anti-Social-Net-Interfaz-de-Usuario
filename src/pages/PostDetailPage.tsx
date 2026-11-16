import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CommentItem from '../components/CommentItem';
import TagPill from '../components/TagPill';
import { useAuth } from '../context/AuthContext';
import {
  getPostById,
  getPostImages,
  getCommentsByPost,
  createComment,
} from '../services/api';
import type { ApiPost } from '../types';
import '../styles/PostDetail.css';

type CommentUI = {
  id: number | string;
  user: string;
  text: string;
};

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn } = useAuth();

  const [post, setPost] = useState<ApiPost | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [comments, setComments] = useState<CommentUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    const postId = id;

    let ignore = false;

    async function loadPostDetails() {
      try {
        setLoading(true);
        setError(null);

        const [postData, postImages, postComments] = await Promise.all([
          getPostById(postId),
          getPostImages(postId).catch(() => []),
          getCommentsByPost(postId).catch(() => []),
        ]);

        if (ignore) return;

        setPost(postData);
        setImages(postImages.map((img) => img.url));
        setComments(
          postComments.map((c) => ({
            id: c.id,
            user: c.User?.nickName || 'Usuario anónimo',
            text: c.content,
          }))
        );
      } catch {
        if (!ignore) {
          setError('No se pudo cargar la publicación. Verifica que el backend esté activo.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPostDetails();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    if (!user) {
      alert('Tenés que iniciar sesión para comentar.');
      return;
    }

    try {
      setSubmittingComment(true);

      const created = await createComment({
        content: commentText.trim(),
        userId: user.id,
        postId: Number(id),
      });

      setComments((prev) => [
        ...prev,
        {
          id: created.id,
          user: user.nickName,
          text: created.content,
        },
      ]);
      setCommentText('');
    } catch {
      alert('Error al enviar el comentario.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="text-center py-5">
            <p className="text-muted">Cargando publicación...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <div className="alert alert-warning text-center my-4">
            <p>{error || 'Publicación no encontrada.'}</p>
            <Link to="/" className="secondary-button secondary-button-small mt-2">
              Volver al inicio
            </Link>
          </div>
        </main>
      </>
    );
  }

  const authorName = post.User?.nickName || 'Usuario anónimo';
  const tagList = post.Tags?.map((t) => `#${t.name}`) || [];

  return (
    <>
      <Navbar />

      <main className="page-shell">
        <div className="detail-card">
          <div className="detail-card-body">
            <div className="detail-header">
              <div>
                <p className="profile-label">Publicación</p>
                <h1 className="page-title">{authorName}</h1>
              </div>
              <Link to="/" className="secondary-button">
                Volver al inicio
              </Link>
            </div>

            <p className="detail-description">{post.description}</p>

            {images.length > 0 && (
              <div className="detail-gallery">
                <div className="gallery-stage">
                  <img
                    src={images[activeImageIndex]}
                    alt={`${authorName} imagen ${activeImageIndex + 1}`}
                    className="gallery-image"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="gallery-arrow left"
                        aria-label="Volver"
                        onClick={handlePrevImage}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="gallery-arrow right"
                        aria-label="Siguiente"
                        onClick={handleNextImage}
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="gallery-dots" aria-label="Indicadores de imagen">
                    {images.map((_, index) => (
                      <span
                        key={`dot-${index}`}
                        className={index === activeImageIndex ? 'dot active' : 'dot'}
                        onClick={() => setActiveImageIndex(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {tagList.length > 0 && (
              <div className="tag-list">
                {tagList.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            )}

            <section className="comments-section">
              <h2 className="section-title">Comentarios ({comments.length})</h2>

              {comments.length === 0 ? (
                <p className="text-muted my-3">No hay comentarios aún. ¡Escribe el primero!</p>
              ) : (
                <div className="comment-list">
                  {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              )}

              {isLoggedIn ? (
                <form className="comment-form mt-4" onSubmit={handleAddComment}>
                  <label className="field-label" htmlFor="comment-text-input">
                    Agregar comentario como {user?.nickName}
                  </label>
                  <textarea
                    id="comment-text-input"
                    className="comment-input"
                    rows={4}
                    placeholder="Escribí tu comentario..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="comment-actions">
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={submittingComment || !commentText.trim()}
                    >
                      {submittingComment ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="alert alert-light border mt-4 text-center">
                  <p className="mb-2">Tenés que iniciar sesión para dejar un comentario.</p>
                  <Link to="/iniciar-sesion" className="primary-button primary-button-small">
                    Iniciar sesión
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
