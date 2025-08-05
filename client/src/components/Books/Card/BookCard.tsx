import React from 'react';
import styles from './BookCard.module.css';

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
}

interface Publisher {
  id: string;
  name: string;
  image_url: string;
}

interface Book {
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

interface BookCardProps {
  book: Book;
  onViewDetails?: (book: Book) => void; // función opcional para el botón
}

const BookCard: React.FC<BookCardProps> = ({ book, onViewDetails }) => {
  const getAuthorName = (author: Author): string => {
    const fullName = [author.first_name, author.last_name].filter(Boolean).join(' ');
    if (fullName && author.pseudonym) {
      return `${fullName} (${author.pseudonym})`;
    }
    return fullName || author.pseudonym || '';
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={book.cover} 
          alt={`Portada de ${book.title}`} 
          className={styles.cover}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{book.title}</h3>
        
        <div className={styles.authorContainer}>
          {book.authors.map(author => (
            <div key={author.id} className={styles.author}>
              <img 
                src={author.photo} 
                alt={getAuthorName(author)} 
                className={styles.authorPhoto}
              />
              <span className={styles.authorName}>{getAuthorName(author)}</span>
            </div>
          ))}
        </div>
        
        <div className={styles.details}>
          <p className={styles.year}>Publicado en: {book.year_of_publication}</p>
          
          <div className={styles.genres}>
            {book.genres.map(genre => (
              <span key={genre.id} className={styles.genreTag}>
                {genre.name}
              </span>
            ))}
          </div>
          
          <div className={styles.publisher}>
            <img 
              src={book.publisher.image_url} 
              alt={book.publisher.name}
              className={styles.publisherLogo}
            />
            <span>{book.publisher.name}</span>
          </div>
        </div>

        {/* Botón para ver detalles */}
        {onViewDetails && (
          <button 
            className={styles.detailsButton} 
            onClick={() => onViewDetails(book)}
            type="button"
          >
            Ver detalles
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
