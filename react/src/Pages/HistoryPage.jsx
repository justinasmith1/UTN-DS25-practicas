import React, { useEffect, useState } from 'react';
import './CategoryPage.css';

const HistoryPage = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/books`)
        .then(res => res.json())
        .then(data => {
            const historyBooks = data.books?.filter(book => 
                book.categories?.some(category => 
                    category.name.toLowerCase().includes('historia')
                )
            ) || [];
            setBooks(historyBooks);
        })
        .catch(err => console.error('Error al cargar libros:', err));
    }, []);

    return (
        <div className="category-page">
            <h1>Libros de Historia</h1>
            <p>Explora la historia a través de nuestros libros</p>
            
            <div className="books-grid">
                {books.length > 0 ? (
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
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-books-message">
                        <p>No hay libros de historia disponibles en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
