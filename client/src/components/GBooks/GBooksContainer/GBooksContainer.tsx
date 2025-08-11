import { useState, useEffect } from 'react';
import { getGBooksRequest } from '@/services/gbooks';
import GBookCard from '../GBookCard/GBookCard';
import type { GBooksResponse } from '@/types/gbooks';
import styles from './GBooksContainer.module.css';

const GbooksContainer = ({ q }: { q: string }) => {
  const [booksData, setBooksData] = useState<GBooksResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Aquí iría tu endpoint real de la API
        const response = await getGBooksRequest(q);
        setBooksData(response);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los libros. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchBooks();
  }, [q]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando libros...</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!booksData || booksData.totalItems === 0) {
    return <div className={styles.empty}>No se encontraron libros</div>;
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Resultados de Google Books</h2>
        <p className={styles.count}>{booksData.totalItems} libros encontrados</p>
      </div>

      <div className={styles.grid}>
        {booksData.results.map((book, index) => (
          <GBookCard key={`${book.title}-${index}`} book={book} />
        ))}
      </div>
    </section>
  );
};

export default GbooksContainer;