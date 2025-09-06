import React, { useEffect, useState } from 'react';
import './CategoryPage.css';

const FictionPage = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/books')
        .then(res => res.json())
        .then(data => {
            // Filtrar libros de ficción (asumiendo que hay una categoría con nombre "Ficción")
            const fictionBooks = data.books?.filter(book => 
                book.categories?.some(category => 
                    category.name.toLowerCase().includes('ficción') || 
                    category.name.toLowerCase().includes('ficcion')
                )
            ) || [];
            setBooks(fictionBooks);
        })
        .catch(err => console.error('Error al cargar libros:', err));
    }, []);

    return (
        <div className="category-page">
            <h1>Libros de Ficción</h1>
            <p>Explora nuestra colección de libros de ficción</p>
            
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
                        <p>No hay libros de ficción disponibles en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FictionPage;
