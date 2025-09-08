import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import FictionPage from './Pages/FictionPage';
import NovelPage from './Pages/NovelPage';
import ArtPage from './Pages/ArtPage';
import HistoryPage from './Pages/HistoryPage';
import RegisterPage from './Pages/RegisterPage';
import ContactPage from './Pages/ContactPage';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ficcion" element={<FictionPage />} />
            <Route path="/novela" element={<NovelPage />} />
            <Route path="/arte" element={<ArtPage />} />
            <Route path="/historia" element={<HistoryPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/contacto" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;