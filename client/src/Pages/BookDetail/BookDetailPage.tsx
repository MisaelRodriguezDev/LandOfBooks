import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import BookDetail from '@/components/Books/Details/BookDetails';
import type { Book } from '@/components/Books/Container/BookContainer';
import { getBookByIdRequest } from '@/services/books';
import { createLoanRequest } from '@/services/loans';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const locationState = location.state as Book | null;

  const [book, setBook] = useState<Book | null>(locationState || null);

  useEffect(() => {
    // Solo realiza la llamada al backend si no hay estado local
    if (!book && id) {
      const fetchBook = async () => {
        try {
          const response = await getBookByIdRequest(id);
          if (response.status === 200) {
            setBook(response.data);
          }
        } catch (error) {
          console.error('Error fetching book:', error);
        }
      };
      fetchBook();
    }
  }, [book, id]);

  const handleLoan = async (bookId: string) => {
    try {
      const result = await createLoanRequest({book_id: bookId})
      alert(result.data)
    } catch (error) {
      console.error(error)
    }
  };

  const handleReserve = async (bookId: string) => {
    console.log(bookId);
    // Aquí iría tu lógica de reserva
  };

  if (!book) return <p>Cargando libro...</p>;

  return (
    <BookDetail 
      book={book} 
      onRequestLoan={handleLoan}
      onReserve={handleReserve}
    />
  );
};

export default BookDetailPage;
