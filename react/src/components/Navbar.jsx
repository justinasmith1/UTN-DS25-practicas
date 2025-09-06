import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav>
            <ul>
                <li>
                    <Link 
                        to="/" 
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/ficcion" 
                        className={location.pathname === '/ficcion' ? 'active' : ''}
                    >
                        Ficción
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/novela" 
                        className={location.pathname === '/novela' ? 'active' : ''}
                    >
                        Novela
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/historia" 
                        className={location.pathname === '/historia' ? 'active' : ''}
                    >
                        Historia
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/arte" 
                        className={location.pathname === '/arte' ? 'active' : ''}
                    >
                        Arte
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/registro" 
                        className={location.pathname === '/registro' ? 'active' : ''}
                    >
                        Registrarse
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/contacto" 
                        className={location.pathname === '/contacto' ? 'active' : ''}
                    >
                        Contacto
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;