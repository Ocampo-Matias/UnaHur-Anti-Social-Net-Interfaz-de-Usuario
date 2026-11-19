import Navbar from '../components/Navbar';
import '../styles/About.css';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="page-shell">
        <section className="about-panel">
          <div className="about-panel-body">
            <h1 className="page-title">Sobre nosotros</h1>
            <div className="about-content">
              <p>
                UnaHur Anti-Social es un espacio para compartir ideas, momentos y recomendaciones
                de la vida universitaria. Nació como un proyecto sencillo: conectar a personas que
                quieren contar algo, descubrir nuevas perspectivas y conversar con respeto.
              </p>
              <p>
                Nos gusta lo auténtico: una foto del día, una reflexión, una recomendación o una
                historia breve pueden iniciar una buena conversación. Cada publicación ayuda a darle
                vida a esta comunidad.
              </p>
              <div className="about-values">
                <article>
                  <h2>Compartir</h2>
                  <p>Un lugar para expresar lo que te interesa y lo que vivís.</p>
                </article>
                <article>
                  <h2>Descubrir</h2>
                  <p>Ideas, experiencias y temas nuevos, publicación a publicación.</p>
                </article>
                <article>
                  <h2>Conectar</h2>
                  <p>Conversaciones cercanas, siempre con buena onda y respeto.</p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
