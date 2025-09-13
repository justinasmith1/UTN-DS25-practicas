import { useState, useEffect } from 'react';
import { getToken } from '../helpers/auth';

export default function UserInfo() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = getToken();
        console.log('UserInfo - Token found:', !!token);
        if (token) {
            // Decodificar el token para obtener la información del usuario
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('UserInfo - Decoded payload:', payload);
                setUser(payload);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    if (!user) {
        console.log('No user found in UserInfo');
        return null;
    }

    const getRoleColor = (role) => {
        switch (role) {
            case 'ADMIN': return '#e74c3c'; // Rojo
            case 'MODERATOR': return '#f39c12'; // Naranja
            case 'USER': return '#3498db'; // Azul
            default: return '#95a5a6'; // Gris
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'ADMIN': return 'Administrador';
            case 'MODERATOR': return 'Moderador';
            case 'USER': return 'Usuario';
            default: return 'Usuario';
        }
    };

    return (
        <div className="user-info">
            <div className="user-details">
                <span className="user-email">{user.email}</span>
                <span 
                    className="user-role" 
                    style={{ backgroundColor: getRoleColor(user.role) }}
                >
                    {getRoleName(user.role)}
                </span>
            </div>
        </div>
    );
}
