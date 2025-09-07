import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="contact-page">
            <h1>Contacto - MiauBooks</h1>
            <p>¿Tu gatito tiene alguna pregunta? ¡Contáctanos!</p>
            
            <div className="contact-content">
                <div className="contact-info">
                    <h2>Información de Contacto</h2>
                    <div className="info-item">
                        <h3>Dirección</h3>
                        <p>Av. Principal 123, Ciudad</p>
                    </div>
                    <div className="info-item">
                        <h3>Teléfono</h3>
                        <p>+54 221 1234-5678</p>
                    </div>
                    <div className="info-item">
                        <h3>Email</h3>
                        <p>MiauBooks@gmail.com</p>
                    </div>
                    <div className="info-item">
                        <h3>Horarios</h3>
                        <p>Lunes a Viernes: 9:00 - 19:00<br />
                        Sábados: 9:00 - 14:00</p>
                    </div>
                </div>
                
                <form className="contact-form" onSubmit={handleSubmit}>
                    <h2>Envíanos un Mensaje</h2>
                    <div className="form-group">
                        <label htmlFor="name">Nombre:</label>
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
                        <label htmlFor="message">Mensaje:</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Enviar Mensaje</button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
