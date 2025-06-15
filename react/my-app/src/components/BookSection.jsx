import React from 'react';
import ficcionImg from '../assets/ficcion1.webp';
import cienciaImg from '../assets/ciencia1.jpg';
import historiaImg from '../assets/historia1.jpg';
import arteImg from '../assets/arte1.webp';
import './BookSection.css';

const BookSection = () => {
    const sections = [
        {
        id: 1,
        title: "Ficción",
        link: "seccion1.html",
        image: ficcionImg,
        bookTitle: "La naranja Mecánica",
        author: "Anthony Burguess"
        },
        {
        id: 2,
        title: "Ciencia",
        link: "seccion2.html",
        image: cienciaImg,
        bookTitle: "Breve historia del tiempo",
        author: "Stephen Hawking"
        },
        {
        id: 3,
        title: "Historia",
        link: "seccion3.html",
        image: historiaImg,
        bookTitle: "Sapiens, de animales a dioses: Una breve historia de la Humanidad",
        author: "Yuval Noah Harari"
        },
        {
        id: 4,
        title: "Arte",
        link: "seccion4.html",
        image: arteImg,
        bookTitle: "¿Qué estás mirando? 150 años de arte moderno en un abrir y cerrar de ojos",
        author: "Will Gompertz"
        }
    ];

    return (
        <div className="book-sections">
        {sections.map(section => (
            <section key={section.id} className="tema">
            <h2><a href={section.link}>{section.title}</a></h2>
            <img src={section.image} alt={`Libro ${section.title}`} />
            <p><strong>{section.bookTitle}</strong> - {section.author}</p>
            </section>
        ))}
        </div>
    );
};

    export default BookSection;