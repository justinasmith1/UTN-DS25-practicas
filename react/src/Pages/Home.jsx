import React, { useEffect, useState } from 'react';
import { getToken } from '../helpers/auth';
import './Home.css';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fromCache, setFromCache] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.role);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    useEffect(() => {
        async function loadBooks() {
            try {
                const res = await fetch('http://localhost:3000/api/books');
                if (!res.ok) throw new Error('Respuesta no OK');
                const data = await res.json();
                console.log('Datos recibidos:', data);
                const list = data.books || [];
                setBooks(list);
                try { localStorage.setItem('booksCache', JSON.stringify(list)); } catch {}
                setFromCache(false);
            } catch (err) {
                console.error('Error al cargar libros:', err);
                try {
                    const cached = localStorage.getItem('booksCache');
                    if (cached) {
                        // Hay datos en caché: los mostramos y avisamos suavemente
                        setBooks(JSON.parse(cached));
                        setError('');
                        setFromCache(true);
                    } else {
                        // No hay caché: mostramos aviso
                        setBooks([]);
                        setError('No se pudo conectar al servidor.');
                        setFromCache(false);
                    }
                } catch {
                    setError('No se pudo conectar al servidor.');
                    setFromCache(false);
                }
            } finally {
                setLoading(false);
            }
        }
        loadBooks();
    }, []);

    const getRoleMessage = () => {
        switch (userRole) {
            case 'ADMIN':
                return {
                    title: '🔧 Panel de Administración - MiauBooks',
                    subtitle: '¡Bienvenido, Administrador! Tienes control total del sistema.',
                    icon: '👑'
                };
            case 'MODERATOR':
                return {
                    title: '🛡️ Panel de Moderación - MiauBooks',
                    subtitle: '¡Bienvenido, Moderador!',
                    icon: '⚖️'
                };
            case 'USER':
                return {
                    title: '👤 Mi Cuenta - MiauBooks',
                    subtitle: '¡Bienvenido! Explora nuestra increíble colección de libros.',
                    icon: '📚'
                };
            default:
                return {
                    title: '🏠 Página de Inicio - MiauBooks',
                    subtitle: '¡Bienvenido a tu librería online favorita!',
                    icon: '🌟'
                };
        }
    };

    const roleInfo = getRoleMessage();

    return (
        <div className={`home-container ${userRole ? `home-${userRole.toLowerCase()}` : ''}`}>
            <h1>{roleInfo.title}</h1>
            <p>{roleInfo.subtitle}</p>
            
            <div className="welcome-section">
                <h2>🌟 Libros Destacados</h2>
                <p>Descubre los libros más populares de nuestra colección</p>
            </div>
            
            {error && (
                <p className="no-books-message" style={{ marginTop: '1rem' }}>{error}</p>
            )}
            {fromCache && !error && (
                <p className="no-books-message" style={{ marginTop: '1rem' }}>
                    Estás viendo datos en caché (sin conexión al servidor).
                </p>
            )}
            <div className="books-grid">
                {loading ? (
                    <p>Cargando libros...</p>
                ) : books.length > 0 ? (
                    books.slice(0, 6).map(book => (
                        <div key={book.id} className="book-card">
                            <div className="book-image">
                                <img 
                                    src={book.img || '/placeholder-book.jpg'} 
                                    alt={`Portada de ${book.title}`} 
                                />
                            </div>
                            <div className="book-info">
                                <h3>{book.title}</h3>
                                <p className="author">Autor: {book.author?.name || 'Desconocido'}</p>
                                <p className="price">${book.price}</p>
                                {/*<p className="published"> 
                                    {book.published ? 'Publicado' : 'Borrador'}
                                </p> */}
                                {book.categories && book.categories.length > 0 && (
                                    <div className="categories">
                                        {book.categories.map(category => (
                                            <span key={category.id} className="category-tag">
                                                {category.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay libros disponibles</p>
                )}
            </div>
            
            <div className="home-actions">
                <a href="/catalog" className="cta-button">Ver Catálogo Completo</a>
            </div>
        </div>
    );
};

export default Home;
