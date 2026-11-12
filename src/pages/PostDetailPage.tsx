import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CommentItem from '../components/CommentItem';
import TagPill from '../components/TagPill';
import { posts } from '../data/mockData';
import '../styles/PostDetail.css';

export default function PostDetailPage() {
  const { id } = useParams();
  const selectedPost = posts.find((post) => post.id === id) ?? posts[0];

  return (
    <>
      <Navbar isLoggedIn={true} />

      <main className="page-shell">
        <div className="detail-card">
          <div className="detail-card-body">
            <div className="detail-header">
              <div>
                <p className="profile-label">Publicación</p>
                <h1 className="page-title">{selectedPost.user}</h1>
              </div>
              <Link to="/" className="secondary-button">
                Volver al inicio
              </Link>
            </div>

            <p className="detail-description">{selectedPost.fullDescription}</p>

            <div className="detail-gallery">
              <div className="gallery-stage">
                <img src={selectedPost.images[0]} alt={selectedPost.user} className="gallery-image" />
                {selectedPost.images.length > 1 && (
                  <>
                    <button type="button" className="gallery-arrow left" aria-label="Volver">
                      ‹
                    </button>
                    <button type="button" className="gallery-arrow right" aria-label="Siguiente">
                      ›
                    </button>
                  </>
                )}
              </div>

              {selectedPost.images.length > 1 && (
                <div className="gallery-dots" aria-label="Indicadores de imagen">
                  {selectedPost.images.map((_, index) => (
                    <span key={`${selectedPost.id}-dot-${index}`} className={index === 0 ? 'dot active' : 'dot'} />
                  ))}
                </div>
              )}
            </div>

            <div className="tag-list">
              {selectedPost.tags.map((tag) => (
                <TagPill key={`${selectedPost.id}-${tag}`} tag={tag} />
              ))}
            </div>

            <section className="comments-section">
              <h2 className="section-title">Comentarios</h2>
              <div className="comment-list">
                {selectedPost.comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>

              <form className="comment-form">
                <label className="field-label">Agregar comentario</label>
                <textarea className="comment-input" rows={4} placeholder="Escribí tu comentario..." />
                <div className="comment-actions">
                  <button type="button" className="primary-button">
                    Enviar
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
