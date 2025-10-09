import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setToken } from "../helpers/auth";
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const loginData = { email, password };
            console.log('Sending login data:', loginData);
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error en login");
            }
            
            const { data } = await res.json();
            setToken(data.token);
            navigate("/home");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Iniciar Sesión</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="email"
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            placeholder="Email" 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder="Contraseña" 
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
                <p className="register-link">
                    ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
}