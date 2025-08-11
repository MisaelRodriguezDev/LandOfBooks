import React from 'react';
import styles from './BookDetails.module.css';

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
  //available_copies: number; // <- debes agregar este campo para controlar disponibilidad
}

interface BookDetailProps {
  book: Book;
  onRequestLoan: (bookId: string) => void;
  onReserve: (bookId: string) => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onRequestLoan }) => {
  const getAuthorName = (author: Author): string => {
    const fullName = [author.first_name, author.last_name].filter(Boolean).join(' ');
    return author.pseudonym ? `${fullName} (${author.pseudonym})` : fullName;
  };

  //const canReserve = book.available_copies === 0;
  //const canReserve = false
  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <img src={book.cover} alt={`Portada de ${book.title}`} className={styles.cover} />
        <div className={styles.info}>
          <h2 className={styles.title}>{book.title}</h2>
          <p className={styles.year}>Publicado en: {book.year_of_publication}</p>
          <div className={styles.genres}>
            {book.genres.map((genre) => (
              <span key={genre.id} className={styles.genre}>
                {genre.name}
              </span>
            ))}
          </div>
          <div className={styles.publisher}>
            <img src={book.publisher.image_url} alt={book.publisher.name} className={styles.publisherLogo} />
            <span>{book.publisher.name}</span>
          </div>
        </div>
      </div>

      <div className={styles.authors}>
        <h3>Autores</h3>
        {book.authors.map((author) => (
          <div key={author.id} className={styles.authorItem}>
            <img src={author.photo} alt={getAuthorName(author)} className={styles.authorPhoto} />
            <span>{getAuthorName(author)}</span>
          </div>
        ))}
      </div>

      <div className={styles.description}>
        <h3>Descripción</h3>
        <p>{book.description}</p>
      </div>

      <div className={styles.actions}>
        <button className={styles.loanBtn} onClick={() => onRequestLoan(book.id)}>
          Pedir préstamo
        </button>

        {/*<button
          className={styles.reserveBtn}
          onClick={() => onReserve(book.id)}
          disabled={!canReserve}
          title={!canReserve ? 'El libro aún tiene copias disponibles' : 'Reservar este libro'}
        >
          Reservar
        </button>*/}
      </div>
    </div>
  );
};

export default BookDetail;
