import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import BookSection from './components/BookSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <Navbar />
      <main className="main-content">
        <BookSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;