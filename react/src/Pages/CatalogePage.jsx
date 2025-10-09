import { useFetch } from '../hooks/useFetch';
import BookCard from '../components/BookCard';

function CatalogPage() {

const url = `${import.meta.env.VITE_API_URL}/api/books?limit=10` ;
const { data, loading, error } = useFetch(url, {}, { requireAuth: true })

if (loading) return <p>Cargando...</p>;
if (error) return <p>Error: {error.message}</p>;

const books = data?.books || [];

return (
    <div className="catalog-page">
        <h2>📖 Catálogo Completo</h2>
        <div className="results-section">
        <p>
            Mostrando {books.length} resultados
        </p>
        
        {loading ? (
            <div>Cargando resultados...</div>
        ) : (
            <div className="books-grid">
            {books.length > 0 ? (
                books.map((book) => <BookCard key={book.id} book={book} />)
            ) : (
                <p>No se encontraron libros"</p>
            )}
            </div>
        )}
        </div>
    </div>
    );
}

export default CatalogPage