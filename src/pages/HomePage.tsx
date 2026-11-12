import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { availableTags, posts } from '../data/mockData';
import '../styles/Home.css';

type HomePageProps = {
  isLoggedIn: boolean;
};

export default function HomePage({ isLoggedIn }: HomePageProps) {
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="page-shell">
        {isLoggedIn && (
          <section className="composer-card">
            <div className="composer-card-body">
              <h2 className="section-title">Crear publicación</h2>

              <div className="composer-field">
                <textarea
                  className="composer-input"
                  rows={4}
                  placeholder="¿Qué estás pensando?"
                />
              </div>

              <div className="composer-row">
                <div className="upload-box">
                  <span className="upload-label">Agregar imágenes</span>
                  <button type="button" className="secondary-button secondary-button-small">
                    Seleccionar imágenes
                  </button>
                </div>

                <div className="tag-selector">
                  <span className="upload-label">Etiquetas</span>
                  <div className="tag-list tag-list-inline">
                    {availableTags.map((tag) => (
                      <button key={tag} type="button" className="chip-button">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="publish-actions">
                <button type="button" className="primary-button">
                  Publicar
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="feed-section">
          <div className="feed-header">
            <h2 className="section-title">Publicaciones</h2>
            <Link to="/sobre-nosotros" className="text-link">Explorar</Link>
          </div>

          <div className="feed-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
