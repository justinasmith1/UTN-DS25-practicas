import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import FictionPage from './Pages/FictionPage';
import NovelPage from './Pages/NovelPage';
import ArtPage from './Pages/ArtPage';
import HistoryPage from './Pages/HistoryPage';
import RegisterPage from './Pages/RegisterPage';
import ContactPage from './Pages/ContactPage';
import LoginPage from './Pages/LoginPage';
import CatalogPage from './Pages/CatalogePage';
import AdminDashboard from './Pages/AdminDashboard';
import ModeratorDashboard from './Pages/ModeratorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import { getToken } from './helpers/auth';
import './App.css';
import CreateUserPage from './Pages/CreateUserPage';
import CreateBookPage from './Pages/CreateBookPage';

function App() {
  const getUserRole = () => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const userRole = getUserRole();
  
  return (
    <Router>
      <div className={`app-container ${userRole ? `role-${userRole.toLowerCase()}` : ''}`}>
        <Header />
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            
            {/* Redirigir la página principal al login si no está autenticado */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Rutas protegidas - requieren autenticación */}
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/catalog" element={
              <ProtectedRoute>
                <CatalogPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/moderator" element={
              <ProtectedRoute>
                <ModeratorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/ficcion" element={
              <ProtectedRoute>
                <FictionPage />
              </ProtectedRoute>
            } />
            <Route path="/novela" element={
              <ProtectedRoute>
                <NovelPage />
              </ProtectedRoute>
            } />
            <Route path="/arte" element={
              <ProtectedRoute>
                <ArtPage />
              </ProtectedRoute>
            } />
            <Route path="/historia" element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/contacto" element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            } />
            <Route path="/users/create" element={
              <ProtectedRoute>
                <CreateUserPage />
              </ProtectedRoute>
            } />
            <Route path="/books/create" element={
              <ProtectedRoute>
                <CreateBookPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;