import React, { useState, useEffect } from "react";
import "./CreateBookPage.css";

function CreateBookPage() {
    const [formData, setFormData] = useState({
        title: "",
        img: "",
        price: "",
        published: true,
        authorId: "",
        categories: [], // Array de IDs
    });
    const [authors, setAuthors] = useState([]); // Lista de autores para select
    const [categoriesList, setCategoriesList] = useState([]); // Lista de categorías para multi-select
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("info");
    const [loading, setLoading] = useState(false);
    const [loadingLists, setLoadingLists] = useState(true);

    // Fetch autores y categorías al cargar
    useEffect(() => {
        fetchAuthors();
        fetchCategories();
    }, []);

    const fetchAuthors = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/authors", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
                },
            });
            const data = await res.json();
            if (res.ok && data.success !== false) {
                setAuthors(data.authors || []);
            }
        } catch (err) {
            console.error("Error cargando autores:", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/categories", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
                },
            });
            const data = await res.json();
            if (res.ok && data.success !== false) {
                setCategoriesList(data.categories || []);
            }
        } catch (err) {
            console.error("Error cargando categorías:", err);
        } finally {
            setLoadingLists(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "categories") {
            // Para multi-select, maneja array
            const options = Array.from(e.target.selectedOptions, (option) => option.value);
            setFormData((p) => ({ ...p, [name]: options }));
        } else if (type === "checkbox") {
            setFormData((p) => ({ ...p, [name]: checked }));
        } else {
            setFormData((p) => ({ ...p, [name]: value }));
        }
        setErrors((p) => ({ ...p, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setErrors({});

        // Validaciones básicas frontend
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = ["El título es requerido"];
        if (!formData.authorId) newErrors.authorId = ["Selecciona un autor"];
        if (!formData.price || formData.price <= 0) newErrors.price = ["El precio debe ser mayor a 0"];
        if (formData.categories.length === 0) newErrors.categories = ["Selecciona al menos una categoría"];
        if (formData.img && !isValidUrl(formData.img)) newErrors.img = ["URL de imagen inválida"];

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price), // Asegura que sea número
                    categoryIds: formData.categories.map(id => parseInt(id)), // Enviar como categoryIds
                }),
            });

            const data = await res.json();

            if (res.ok && data.success !== false) {
                setMessage(data.message || "Libro creado correctamente");
                setMessageType("success");
                setFormData({ title: "", img: "", price: "", published: true, authorId: "", categories: [] });
            } else {
                setMessage(data.message || "No se pudo crear el libro");
                setMessageType("danger");
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

    // Validar URL simple
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
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

    if (loadingLists) {
        return (
            <div className="cb-wrapper">
                <div className="cb-card">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p>Cargando listas...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cb-wrapper">
            <div className="cb-card shadow">
                <div className="cb-header">
                    <h2>Crear Libro</h2>
                    <p>Completá los datos para registrar un nuevo libro</p>
                </div>

                {message && (
                    <div className={`alert alert-${messageType} mb-3`} role="alert">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="title" className="cb-label d-block">Título *</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            className={`form-control cb-input ${errors.title ? "is-invalid" : ""}`}
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Título del libro"
                            required
                        />
                        {fieldErrorBlock("title")}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="authorId" className="cb-label d-block">Autor *</label>
                        <select
                            id="authorId"
                            name="authorId"
                            className={`form-select cb-input ${errors.authorId ? "is-invalid" : ""}`}
                            value={formData.authorId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona un autor</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                        {fieldErrorBlock("authorId")}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="categories" className="cb-label d-block">Categoría </label>
                        <select
                            id="categories"
                            name="categories"
                            multiple
                            className={`form-select cb-input ${errors.categories ? "is-invalid" : ""}`}
                            value={formData.categories}
                            onChange={handleChange}
                            size={Math.min(5, categoriesList.length)} // Muestra hasta 5 opciones
                        >
                            {categoriesList.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {fieldErrorBlock("categories")}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="price" className="cb-label d-block">Precio *</label>
                        <input
                            id="price"
                            type="number"
                            name="price"
                            className={`form-control cb-input ${errors.price ? "is-invalid" : ""}`}
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="12000"
                            min="0"
                            step="0.01"
                            required
                        />
                        {fieldErrorBlock("price")}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="img" className="cb-label d-block">URL de Imagen (opcional)</label>
                        <input
                            id="img"
                            type="url"
                            name="img"
                            className={`form-control cb-input ${errors.img ? "is-invalid" : ""}`}
                            value={formData.img}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        {fieldErrorBlock("img")}
                    </div>

                    <div className="mb-3">
                        <div className="form-check">
                            <input
                                id="published"
                                type="checkbox"
                                name="published"
                                className="form-check-input"
                                checked={formData.published}
                                onChange={handleChange}
                            />
                            <label htmlFor="published" className="cb-label form-check-label">
                                Publicado (visible en el sitio)
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn cb-btn w-100"
                        disabled={loading}
                    >
                        {loading ? "Creando..." : "Crear Libro"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateBookPage;