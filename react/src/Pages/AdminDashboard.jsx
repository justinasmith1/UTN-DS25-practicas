import { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener estadísticas de libros
    const { data: statsData, loading: statsLoading, error: statsError } = useFetch(`${import.meta.env.VITE_API_URL}/api/books/stats`, {}, { requireAuth: true });
    
    // Obtener lista de usuarios
    const { data: usersData, loading: usersLoading, error: usersError } = useFetch(`${import.meta.env.VITE_API_URL}/api/users`, {}, { requireAuth: true });
    
    useEffect(() => {
        if (statsData) {
            console.log('📊 Stats data received:', statsData);
            setStats(statsData.data);
        }
        if (usersData) {
            console.log('👥 Users data received:', usersData);
            /*setUsers(usersData.data || []);*/
            setUsers(usersData.users || usersData.data?.users || []);
        }
        
        // Solo mostrar loading si ambas peticiones están cargando
        if (!statsLoading && !usersLoading) {
            setLoading(false);
        }
        
        if (statsError || usersError) {
            console.error('❌ Error in AdminDashboard:', statsError || usersError);
            setError(statsError || usersError);
            setLoading(false);
        }
    }, [statsData, usersData, statsLoading, usersLoading, statsError, usersError]);

    if (loading) return <div className="admin-dashboard">Cargando...</div>;
    
    if (error) return <div className="admin-dashboard">Error: {error.message}</div>;

    return (
        <div className="admin-dashboard">
            <h1>🔧 Panel de Administración</h1>
            
            <div className="admin-sections">
                <div className="stats-section">
                    <h2>📊 Estadísticas de la Librería</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total de Libros</h3>
                            <p className="stat-number">{stats?.totalBooks || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Libros Publicados</h3>
                            <p className="stat-number">{stats?.publishedBooks || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Libros No Publicados</h3>
                            <p className="stat-number">{stats?.unpublishedBooks || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total de Autores</h3>
                            <p className="stat-number">{stats?.totalAuthors || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total de Categorías</h3>
                            <p className="stat-number">{stats?.totalCategories || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Precio Promedio</h3>
                            <p className="stat-number">${stats?.averagePrice ? stats.averagePrice.toFixed(2) : 0}</p>
                        </div>
                    </div>
                </div>

                <div className="users-section">
                    <h2>👥 Usuarios Registrados</h2>
                    <div className="users-list">
                        {users.length > 0 ? (
                            users.map(user => (
                                <div key={user.id} className="user-card">
                                    <div className="user-info">
                                        <h4>{user.name}</h4>
                                        <p>{user.email}</p>
                                        <div className="user-role-container">
                                            <span className="role-label"></span>
                                            <span className={`role-badge ${user.role.toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay usuarios registrados</p>
                        )}
                    </div>
                </div>

                <div className="admin-actions">
                    <h2>Acciones de Administración</h2>
                    <div className="action-buttons">
                        <button className="admin-btn primary" onClick={() => window.location.href = '/users/create'}>
                            Gestionar Usuarios (CRUD Completo)
                        </button>
                        <button className="admin-btn secondary" onClick={() => window.location.href = '/books/create'}>
                            Gestionar Libros (CRUD Completo)
                        </button>
                        <button className="admin-btn danger">
                            Eliminar Libros 
                        </button>
                        <button className="admin-btn secondary">
                            Gestionar Autores
                        </button>
                        <button className="admin-btn secondary">
                            Gestionar Categorías
                        </button>
                        <button className="admin-btn danger2">
                            Configuración del Sistema
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
