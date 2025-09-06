import React from 'react';
import './Header.css';
import logo from '../assets/logo-gato2.png'; 

const Header = () => {
    return (
        <header>
            <div className="logo">
                <img src={logo} alt="Logo de MiauBooks" className="logo-image" />
                <h1>MiauBooks</h1>
            </div>
        </header>
    );
};

export default Header;