

import React, { useEffect, useState } from 'react';
import './BookSection.css';

    const BookSection = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/books')
        .then(res => res.json())
        .then(data => setBooks(data.books))
        .catch(err => console.error('Error al cargar libros:', err));
    }, []);
    console.log(books);
    return (
        <div className="book-sections">
        {books.map(book => (
            <section key={book.id} className="tema">
            <h2>{book.title}</h2>
            {/* Si tu backend devuelve image, usalo. Si no, podés usar una imagen placeholder: */}
            <img src={book.img} alt={`Libro ${book.title}`} />
            <p><strong>{book.title}</strong> - {book.author}</p>
            </section>
        ))}
        </div>
    );
    };

export default BookSection;
