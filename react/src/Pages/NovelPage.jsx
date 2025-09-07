import React, { useEffect, useState } from 'react';
import './CategoryPage.css';

const NovelPage = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/books')
        .then(res => res.json())
        .then(data => {
            const novelBooks = data.books?.filter(book => 
                book.categories?.some(category => 
                    category.name.toLowerCase().includes('novela') ||
                    category.name.toLowerCase().includes('novel')
                )
            ) || [];
            setBooks(novelBooks);
        })
        .catch(err => console.error('Error al cargar libros:', err));
    }, []);

    return (
        <div className="category-page">
            <h1>Libros de Novela</h1>
            <p>Descubre nuestras mejores novelas</p>
            
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
                        <p>No hay libros de novela disponibles en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NovelPage;

