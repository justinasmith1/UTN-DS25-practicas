import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fromCache, setFromCache] = useState(false);

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

    return (
        <div className="home-container">
            <h1>¡Bienvenido a MiauBooks!</h1>
            <p>Libros que hacen ronronear a los gatitos lectores</p>
            
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
                    books.map(book => (
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
                                <p className="published">
                                    {book.published ? 'Publicado' : 'Borrador'}
                                </p>
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
                    <p>Cargando libros...</p>
                )}
            </div>
        </div>
    );
};

export default Home;
