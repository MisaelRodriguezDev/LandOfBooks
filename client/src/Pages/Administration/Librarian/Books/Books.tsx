import { useEffect, useState } from "react";
import Table from "@/components/ui/Table/Table";
import Button from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal/Modal";
import CreateBook from "@/Managment/Books/Create";
import UpdateBook from "@/Managment/Books/Update";
import { getBooksRequest, deleteBookRequest } from "@/services/books";
import { getAllAuthorsFromAdminRequest } from "@/services/authors";
import { getAllPublishersFromAdminRequest } from "@/services/publishers";
import { getAllGenresFromAdminRequest } from "@/services/genres";
import type { Book } from "@/types/books";
import useDynamicColumns from "@/hooks/useDynamicColumns";
import styles from "@/styles/Table.module.css";

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Estos deberían venir de un endpoint /stores (pueden agregarse hooks o context)
  const [publishers, setPublishers] = useState<{ id: string; name: string }[]>([]);
  const [authors, setAuthors] = useState<{ id: string; full_name: string }[]>([]);
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);

  const fetchBooks = async () => {
    try {
      const res = await getBooksRequest();
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Similares fetch para publishers, authors, genres
  const fetchPublishers = async () => {
    try {
        const data = await getAllPublishersFromAdminRequest()
        setPublishers(data.data)
    } catch (error) {
        console.error(error)
    }
  };
  const fetchAuthors = async () => {
  try {
    const data = await getAllAuthorsFromAdminRequest();
    setAuthors(
      data.data.map((author) => ({
        id: author.id,
        full_name: `${author.first_name} ${author.last_name}`,
      }))
    );
  } catch (error) {
    console.error(error);
  }
};

  const fetchGenres = async () => {
    try {
        const data = await getAllGenresFromAdminRequest()
        setGenres(data.data)
    } catch (error) {
        console.error(error)
    }
    
  };

  useEffect(() => {
    fetchBooks();
    fetchPublishers();
    fetchAuthors();
    fetchGenres();
  }, []);

  const columns = useDynamicColumns<Book>(books, {
    labels: {
      isbn: "ISBN",
      title: "Título",
      year_of_publication: "Año",
      publisher_id: "Editorial",
      // Puedes mejorar para mostrar nombre editoral, autores y géneros concatenados
    },
  });

  const onSuccessCreated = () => {
    fetchBooks();
    setShowCreateModal(false);
  };

  const onSuccessUpdated = () => {
    fetchBooks();
    setShowUpdateModal(false);
    setSelectedBook(null);
  };

  const onDeleteBook = async (book: Book) => {
    if (!confirm(`¿Seguro que deseas eliminar el libro "${book.title}"?`)) return;

    try {
      await deleteBookRequest(book.id);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const bookToUpdateInitialData = (book: Book) => ({
  isbn: book.isbn,
  title: book.title,
  description: book.description,
  cover: book.cover,
  year_of_publication: book.year_of_publication,
  publisher_id: book.publisher.id,
  author_ids: book.authors.map(a => a.id),
  genre_ids: book.genres.map(g => g.id),
});

  return (
    <div>
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <CreateBook
            onSuccess={onSuccessCreated}
            publishers={publishers}
            authors={authors}
            genres={genres}
          />
        </Modal>
      )}

      {showUpdateModal && selectedBook && (
        <Modal onClose={() => { setShowUpdateModal(false); setSelectedBook(null); }}>
          <UpdateBook
            id={selectedBook.id}
            onSuccess={onSuccessUpdated}
            initialData={bookToUpdateInitialData(selectedBook)}
            publishers={publishers}
            authors={authors}
            genres={genres}
          />
        </Modal>
      )}

      <div>
        <Button
          content="Crear libro"
          content_loading="Creando libro..."
          loading={false}
          enabled={true}
          action="create"
          fn={() => setShowCreateModal(true)}
        />
      </div>

      <div className={styles.table_wrapper}>
        {books.length > 0 ? (
          <div className={styles.table_container}>
            <h1>Lista de libros</h1>
            <Table
              columns={columns}
              data={books}
              manager={true}
              updatefn={(book) => {
                setSelectedBook(book);
                setShowUpdateModal(true);
              }}
              deletefn={onDeleteBook}
              hideTimestamps={true}
            />
          </div>
        ) : (
          <p>No hay datos</p>
        )}
      </div>
    </div>
  );
}
