import { useState } from 'react';
import './ModeratorDashboard.css';

export default function ModeratorDashboard() {
    const [pendingBooks, setPendingBooks] = useState([
        { id: 1, title: "Libro Pendiente 1", author: "Autor 1", status: "pending" },
        { id: 2, title: "Libro Pendiente 2", author: "Autor 2", status: "pending" }
    ]);

    const handleApprove = (bookId) => {
        setPendingBooks(prev => prev.filter(book => book.id !== bookId));
        alert('Libro aprobado exitosamente');
    };

    const handleReject = (bookId) => {
        setPendingBooks(prev => prev.filter(book => book.id !== bookId));
        alert('Libro rechazado');
    };

    return (
        <div className="moderator-dashboard">
            <h1>🛡️ Panel de Moderación</h1>
            
            <div className="moderator-sections">
                <div className="pending-books">
                    <h2>Libros Pendientes de Aprobación</h2>
                    
                    {pendingBooks.length === 0 ? (
                        <p className="no-pending">No hay libros pendientes de aprobación</p>
                    ) : (
                        <div className="books-list">
                            {pendingBooks.map(book => (
                                <div key={book.id} className="book-item">
                                    <div className="book-info">
                                        <h3>{book.title}</h3>
                                        <p>Por: {book.author}</p>
                                    </div>
                                    <div className="book-actions">
                                        <button 
                                            className="approve-btn"
                                            onClick={() => handleApprove(book.id)}
                                        >
                                            ✅ Aprobar
                                        </button>
                                        <button 
                                            className="reject-btn"
                                            onClick={() => handleReject(book.id)}
                                        >
                                            ❌ Rechazar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="moderator-actions">
                    <h2>Herramientas de Moderación</h2>
                    <div className="action-buttons">
                        <button className="mod-btn primary">
                            Ver Lista de Usuarios
                        </button>
                        <button className="mod-btn secondary">
                            Crear/Editar Libros
                        </button>
                        <button className="mod-btn secondary">
                            Aprobar Libros Pendientes
                        </button>
                        <button className="mod-btn secondary">
                            Investigar Usuarios Específicos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
