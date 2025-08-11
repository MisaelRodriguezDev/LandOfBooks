import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookCard from '../Card/BookCard';
import styles from './BookContainer.module.css';

export interface Book {
  id: string;
  isbn: string;
  title: string;
  description: string;
  cover: string;
  year_of_publication: number;
  genres: Genre[];
  publisher: Publisher;
  authors: Author[];
}

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  pseudonym?: string;
  photo: string;
}

interface Genre {
  id: string;
  name: string;
  description?: string;
}

interface Publisher {
  id: string;
  name: string;
  phone?: string;
  image_url: string;
}

interface BookContainerProps {
  books: Book[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void; // Función para reintentar
}

const BookContainer: React.FC<BookContainerProps> = ({ books, loading, error, onRetry }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando libros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <p>{error}</p>
        {onRetry && (
          <button className={styles.retryButton} onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  const basePath = location.pathname.startsWith('/books') ? '/books' : '/books';

  return (
    <div className={styles.container}>
      {books.map(book => (
        <div key={book.id} className={styles.bookCardWrapper}>
          <BookCard 
            book={book} 
            onViewDetails={() => navigate(`${basePath}/${book.id}`, { state: book })}
          />
        </div>
      ))}
    </div>
  );
};

export default BookContainer;