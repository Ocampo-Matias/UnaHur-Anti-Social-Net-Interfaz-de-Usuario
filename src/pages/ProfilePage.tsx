import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { posts } from '../data/mockData';
import '../styles/Profile.css';

export default function ProfilePage() {
  const profilePosts = posts.filter((post) => post.user === 'Martina Gómez');

  return (
    <>
      <Navbar isLoggedIn={true} />

      <main className="page-shell">
        <section className="profile-header">
          <div className="profile-header-body">
            <div className="profile-header-content">
              <div className="profile-avatar">M</div>
              <div>
                <p className="profile-label">Perfil</p>
                <h1 className="page-title">Martina Gómez</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-posts">
          <h2 className="section-title">Publicaciones</h2>
          <div className="profile-posts-grid">
            {profilePosts.map((post) => (
              <PostCard key={post.id} post={post} variant="profile" />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
