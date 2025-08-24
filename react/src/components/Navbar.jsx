import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav>
        <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="seccion1.html">Ficción</a></li>
            <li><a href="seccion2.html">Ciencia</a></li>
            <li><a href="seccion3.html">Historia</a></li>
            <li><a href="seccion4.html">Arte</a></li>
            <li><a href="registro.html">Registrarse</a></li>
            <li><a href="contacto.html">Contacto</a></li>
        </ul>
        </nav>
    );
};

export default Navbar;