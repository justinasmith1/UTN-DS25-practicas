import React, { useState, useEffect } from 'react';
import { getToken, clearToken } from '../helpers/auth';
import './Header.css';
import logo from '../assets/logo-gato5.png'; 
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const updateUser = () => {
            const token = getToken();
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setUser(payload);
                } catch (error) {
                    console.error('Error decoding token:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        // Actualizar usuario al montar el componente
        updateUser();

        // Escuchar eventos personalizados de token
        const handleTokenUpdate = () => updateUser();
        const handleTokenCleared = () => updateUser();

        window.addEventListener('tokenUpdated', handleTokenUpdate);
        window.addEventListener('tokenCleared', handleTokenCleared);

        return () => {
            window.removeEventListener('tokenUpdated', handleTokenUpdate);
            window.removeEventListener('tokenCleared', handleTokenCleared);
        };
    }, []);

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'ADMIN': return '#e74c3c';
            case 'MODERATOR': return '#f39c12';
            case 'USER': return '#3498db';
            default: return '#7f8c8d';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN': return '👑';
            case 'MODERATOR': return '⚖️';
            case 'USER': return '👤';
            default: return '🌟';
        }
    };

    return (
        <header>
            <div className="logo">
                <img src={logo} alt="Logo de MiauBooks" className="logo-image" />
                <h1>MiauBooks</h1>
            </div>
            
            {user && (
                <div className="user-info">
                    <div className="user-details">
                        <span className="user-email">{user.email}</span>
                        <div className="user-role">
                            <span className="role-icon">{getRoleIcon(user.role)}</span>
                            <span 
                                className="role-badge" 
                                style={{ backgroundColor: getRoleColor(user.role) }}
                            >
                                {user.role}
                            </span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;