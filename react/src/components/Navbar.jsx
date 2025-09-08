import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav>
        <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/ficcion">Ficción</Link></li>
            <li><Link to="/novela">Novela</Link></li>
            <li><Link to="/historia">Historia</Link></li>
            <li><Link to="/arte">Arte</Link></li>
            <li><Link to="/registro">Registrarse</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
        </ul>
        </nav>
    );
};

export default Navbar;