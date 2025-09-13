import './BookCard.css';

export default function BookCard({ book }) {
    return (
        <div className="book-card">
            <div className="book-image">
                {book.img ? (
                    <img src={book.img} alt={book.title} />
                ) : (
                    <div className="no-image">📖</div>
                )}
            </div>
            <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">Por: {book.author?.name || 'Autor desconocido'}</p>
                <p className="price">${book.price}</p>
                <div className="categories">
                    {book.categories?.map(category => (
                        <span key={category.id} className="category-tag">
                            {category.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

