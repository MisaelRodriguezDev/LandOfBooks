import { useLocation } from "react-router-dom";
import BookContainer from "@/components/Books/Container/BookContainer";
import GbooksContainer from "@/components/GBooks/GBooksContainer/GBooksContainer";
import { searchBooksRequest } from "@/services/books";
import { useEffect, useState } from "react";
import type { Book } from "@/components/Books/Container/BookContainer";

function SearchPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get("q") ?? "";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchBooksRequest(q);
      if (response.status === 200) {
        setBooks(response.data);
      } else {
        setError("Error al obtener los libros");
      }
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim() !== "") {
      fetchBooks(query);
    } else {
      // Si no hay query, podrías limpiar resultados o hacer otra acción
      setBooks([]);
      setError(null);
      setLoading(false);
    }
  }, [query]);

  return (
    <div>
      <h2>Resultados para: "{query}"</h2>
      <BookContainer 
        books={books} 
        loading={loading} 
        error={error} 
        onRetry={() => fetchBooks(query)} 
      />
      <GbooksContainer 
        q={query} 
      />
    </div>
  );
}

export default SearchPage;
