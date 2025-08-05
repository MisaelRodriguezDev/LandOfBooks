import { useEffect, useState } from "react";
import BookContainer from "@/components/Books/Container/BookContainer";
import { getBooksRequest } from "@/services/books";
import type { Book } from "@/components/Books/Container/BookContainer";

function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBooksRequest();
      if (response.status === 200) {
        setBooks(response.data);
      } else {
        setError("Error al obtener los libros");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <BookContainer 
        books={books} 
        loading={loading} 
        error={error} 
        onRetry={fetchBooks} 
      />
    </div>
  );
}

export default HomePage;
