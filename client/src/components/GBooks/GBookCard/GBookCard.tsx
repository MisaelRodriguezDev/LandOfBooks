import React from 'react';
import styles from './GBookCard.module.css';
import type { GBook } from '@/types/gbooks';
import formattedDate from '@/utils/formattedDate';

interface GBookCardProps {
  book: GBook;
}

const GBookCard: React.FC<GBookCardProps> = ({ book }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={book.thumbnail} 
          alt={`Portada de ${book.title}`} 
          className={styles.image}
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150x220?text=No+Imagen')}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{book.title}</h3>
        
        <div className={styles.meta}>
          <span className={styles.authors}>
            {book.authors ? book.authors.join(', ') : 'Autor desconocido'}
          </span>
          <span className={styles.date}>
            {formattedDate(book.published_date)}
          </span>
        </div>
        
        <p className={styles.description}>
          {book.description?.substring(0, 100) ?? "Sin descripción"}...
        </p>
        
        <a 
          href={book.info_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.link}
        >
          Ver detalles
        </a>
      </div>
    </div>
  );
};

export default GBookCard;