import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        alert('¡Registro exitoso! Bienvenido a Librería El Saber.');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    };

    return (
        <div className="register-page">
            <h1>Registro - MiauBooks</h1>
            <p>Únete a nuestra comunidad de gatitos lectores</p>
            
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nombre completo:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />
                </div>
                
                <button type="submit">Registrarse</button>
                
                <p className="login-link">
                    ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
