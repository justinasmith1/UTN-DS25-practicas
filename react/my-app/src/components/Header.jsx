import React from 'react';
import logo from '../assets/logo2.jpg'; // Asegúrate de tener esta imagen en tu carpeta assets
import './Header.css';

const Header = () => {
    return (
        <header>
            <div className="logo">
                <img src={logo} alt="Logo de la librería" />
                <h1>Librería El Saber</h1>
            </div>
        </header>
    );
};

export default Header;