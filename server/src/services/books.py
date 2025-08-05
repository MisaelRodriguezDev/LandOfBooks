from uuid import UUID
from sqlmodel import Session
from src.schemas.books import BookIn, BookUpdate, BookOut
from src.models import Book
from src.repositories.books import BookRepository
from .genres import GenreService
from .authors import AuthorService
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger


class BookService:
    def __init__(self, session: Session):
        self.repository = BookRepository(session)
        self.genre_service = GenreService(session)
        self.author_service = AuthorService(session)

    def get_book_by_id(self, id: UUID):
        try:
            book = self.repository.get_by_id(id)
            if not book:
                raise NotFound(id)
            return BookOut.model_validate(book)
        except SQLAlchemyError:
            logger.error(f"Error al obtener el libro {id}", exc_info=True)
            raise ServerError()

    def get_all_books(self):
        try:
            books = self.repository.get_all()
            if not books:
                raise NotFound()
            return [BookOut.model_validate(book) for book in books]
        except SQLAlchemyError:
            logger.error("Error al obtener los libros", exc_info=True)
            raise ServerError()

    def create_book(self, data: BookIn):
        try:
            book = Book(**data.model_dump())
            self.repository.create(book)
            return "Libro creado correctamente"
        except IntegrityError:
            logger.error("Libro duplicado", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al crear libro", exc_info=True)
            raise ServerError()

    def update_book(self, id: UUID, data: BookUpdate):
        try:
            book = self.repository.get_by_id(id)
            if not book:
                raise NotFound()

            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(book, key, value)

            return self.repository.update(book)
        except SQLAlchemyError:
            logger.error(f"Error al actualizar el libro: {id}", exc_info=True)
            raise ServerError()

    def delete_book(self, id: UUID):
        try:
            book = self.repository.get_by_id(id)
            if not book:
                raise NotFound()
            return self.repository.delete(book)
        except SQLAlchemyError:
            logger.error(f"Error al eliminar el libro {id}", exc_info=True)
            raise ServerError()

    def get_books_by_genre(self, genre: str | UUID):
        try:
            books = self.repository.get_by_genre(genre)
            if not books:
                raise NotFound()
            return books
        except SQLAlchemyError:
            logger.error("Error al obtener los libros por género", exc_info=True)
            raise ServerError()
        
    def get_books_by_author(self, author: str | UUID):
        try:
            books = self.repository.get_by_author(author)
            if not books:
                raise NotFound()
            return books
        except SQLAlchemyError:
            logger.error("Error al obtener los libros por autor", exc_info=True)
            raise ServerError()        

    def search_books(self, q: str):
        try:
            books = self.repository.search(q)
            if not books:
                raise NotFound()
            return [BookOut.model_validate(book) for book in books]
        except SQLAlchemyError:
            logger.error("Error al buscar libros", exc_info=True)
            raise ServerError()

    def add_genre_to_book(self, book_id: UUID, genre_id: UUID):
        try:
            book = self.repository.get_by_id(book_id)
            if not book:
                raise NotFound()

            self.genre_service.get_genre_by_id(genre_id)

            if any(g.id == genre_id for g in book.genres):
                raise ConflictError("Género ya asignado")

            return self.repository.add_genre(book, genre_id)
        except SQLAlchemyError:
            logger.error(f"Error al agregar género al libro {book_id}", exc_info=True)
            raise ServerError()

    def add_author_to_book(self, book_id: UUID, author_id: UUID):
        try:
            book = self.repository.get_by_id(book_id)
            if not book:
                raise NotFound()

            self.author_service.get_author_by_id(author_id)

            if any(a.id == author_id for a in book.authors):
                raise ConflictError("Autor ya asignado")

            return self.repository.add_author(book, author_id)
        except SQLAlchemyError:
            logger.error(f"Error al agregar autor al libro {book_id}", exc_info=True)
            raise ServerError()

    def remove_genre_from_book(self, book_id: UUID, genre_id: UUID):
        try:
            book_genre = self.repository.get_book_genre(book_id, genre_id)
            if not book_genre:
                raise BadRequest(f"El libro {book_id} no tiene asignado el género {genre_id}.")

            return self.repository.remove_genre(book_genre)
        except SQLAlchemyError as e:
            logger.error(f"Error al eliminar género del libro {book_id}: {e}", exc_info=True)
            raise ServerError()

    def remove_author_from_book(self, book_id: UUID, author_id: UUID):
        try:
            book_author = self.repository.get_book_author(book_id, author_id)
            if not book_author:
                raise BadRequest(f"El libro {book_id} no tiene asignado el autor {author_id}.")

            return self.repository.remove_author(book_author)
        except SQLAlchemyError as e:
            logger.error(f"Error al eliminar autor del libro {book_id}: {e}", exc_info=True)
            raise ServerError()
