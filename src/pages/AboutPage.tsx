import Navbar from '../components/Navbar';
import '../styles/About.css';

export default function AboutPage() {
  return (
    <>
      <Navbar isLoggedIn={false} />

      <main className="page-shell">
        <section className="about-panel">
          <div className="about-panel-body">
            <h1 className="page-title">Sobre nosotros</h1>
            <div className="about-placeholder">
              <p>
                Esta sección está preparada para incorporar la información institucional y la historia
                de la comunidad.
              </p>
              <div className="placeholder-block"></div>
              <div className="placeholder-block short"></div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
