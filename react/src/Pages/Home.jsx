import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/books')
        .then(res => res.json())
        .then(data => {
            console.log('Datos recibidos:', data);
            setBooks(data.books || []);
        })
        .catch(err => console.error('Error al cargar libros:', err));
    }, []);

    return (
        <div className="home-container">
            <h1>¡Bienvenido a MiauBooks!</h1>
            <p>Descubre nuestra colección de libros favoritos de los gatitos lectores</p>
            
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
