import React, { useState } from "react";
import "./CreateUserPage.css";

function CreateUserPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "USER",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: null })); // limpia el error del campo editado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrors({});

    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success !== false) {
        setMessage(data.message || "Usuario creado correctamente");
        setMessageType("success");
        setFormData({ email: "", name: "", password: "", role: "USER" });
      } else {
        // Mensaje general
        setMessage(data.message || "No se pudo crear el usuario");
        setMessageType("danger");

        // Errores por campo en formato { errors: [{field, message}, ...] }
        if (Array.isArray(data.errors)) {
          const newErrors = {};
          data.errors.forEach((err) => {
            if (!newErrors[err.field]) newErrors[err.field] = [];
            newErrors[err.field].push(err.message);
          });
          setErrors(newErrors);
        }
      }
    } catch (err) {
      setMessage(`Error de red: ${err.message}`);
      setMessageType("danger");
    } finally {
      setLoading(false);
    }
  };

  const fieldErrorBlock = (field) =>
    errors[field] ? (
      <div className="invalid-feedback d-block">
        {errors[field].map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
    ) : null;

  return (
    <div className="cu-wrapper">
      <div className="cu-card shadow">
        <div className="cu-header">
          <h2>Crear Usuario</h2>
          <p>Completá los datos para registrar un nuevo usuario</p>
        </div>

        {message && (
          <div className={`alert alert-${messageType} mb-3`} role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="cu-label d-block">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-control cu-input ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
            {fieldErrorBlock("email")}
          </div>

          <div className="mb-3 ">
            <label htmlFor="name" className="cu-label d-block">Nombre</label>
            <input
              id="name"
              type="text"
              name="name"
              className={`form-control cu-input ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              required
            />
            {fieldErrorBlock("name")}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="cu-label d-block">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-control cu-input ${errors.password ? "is-invalid" : ""}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            {fieldErrorBlock("password")}
          </div>

          <div className="mb-8">
            <label htmlFor="role" className="cu-label d-block">Rol</label>
            <select
              id="role"
              name="role"
              className={`form-select cu-input ${errors.role ? "is-invalid" : ""}`}
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">Usuario</option>
              <option value="MODERATOR">Moderador</option>
              <option value="ADMIN">Administrador</option>
            </select>
            {fieldErrorBlock("role")}
          </div>

          <button
            type="submit"
            className="btn cu-btn w-100"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Usuario"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPage;
