import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import PostDetailPage from './pages/PostDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-page">
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={true} />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/iniciar-sesion" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/publicacion/:id" element={<PostDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
