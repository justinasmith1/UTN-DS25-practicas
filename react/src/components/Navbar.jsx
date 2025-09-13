import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, getToken } from '../helpers/auth';
import './Navbar.css';

const Navbar = () => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const updateUserRole = () => {
            const token = getToken();
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setUserRole(payload.role);
                } catch (error) {
                    console.error('Error decoding token:', error);
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }
        };

        // Actualizar rol al montar el componente
        updateUserRole();

        // Escuchar eventos personalizados de token
        const handleTokenUpdate = () => updateUserRole();
        const handleTokenCleared = () => updateUserRole();

        window.addEventListener('tokenUpdated', handleTokenUpdate);
        window.addEventListener('tokenCleared', handleTokenCleared);

        return () => {
            window.removeEventListener('tokenUpdated', handleTokenUpdate);
            window.removeEventListener('tokenCleared', handleTokenCleared);
        };
    }, []);


    return (
        <nav className={`navbar ${userRole ? `navbar-${userRole.toLowerCase()}` : ''}`}>
        <ul>
            {isAuthenticated() ? (
                <>
                    <li><Link to="/home">Inicio</Link></li>
                    <li><Link to="/catalog">Catálogo</Link></li>
                    <li><Link to="/ficcion">Ficción</Link></li>
                    <li><Link to="/novela">Novela</Link></li>
                    <li><Link to="/historia">Historia</Link></li>
                    <li><Link to="/arte">Arte</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                    {userRole === 'ADMIN' && <li><Link to="/admin">Admin</Link></li>}
                    {userRole === 'MODERATOR' && <li><Link to="/moderator">Moderador</Link></li>}
                </>
            ) : (
                <>
                    <li><Link to="/ficcion">Ficción</Link></li>
                    <li><Link to="/novela">Novela</Link></li>
                    <li><Link to="/historia">Historia</Link></li>
                    <li><Link to="/arte">Arte</Link></li>
                    <li><Link to="/registro">Registrarse</Link></li>
                    <li><Link to="/login">Iniciar Sesión</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                </>
            )}
        </ul>
        </nav>
    );
};

export default Navbar;