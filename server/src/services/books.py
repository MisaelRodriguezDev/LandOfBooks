from uuid import UUID
from sqlmodel import Session
from src.services.copies import BookCopyService
from src.models.book_author import BookAuthor
from src.models.book_genre import BookGenre
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
        self.session = session
        self.repository = BookRepository(session)
        self.genre_service = GenreService(session)
        self.author_service = AuthorService(session)
        self.copies_service = BookCopyService(session)

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
            # Crear libro en una transacción
            with self.session.begin_nested():
                # Crear libro base
                book = Book(**data.model_dump(exclude={"genre_ids", "author_ids"}))
                self.repository.create(book)
                
                # Forzar flush para obtener ID
                self.session.flush()
                
                # Manejar relaciones en lote
                if data.genre_ids:
                    self.repository.set_genres(book, data.genre_ids)
                
                if data.author_ids:
                    self.repository.set_authors(book, data.author_ids)
            
            self.session.commit()
            return "Libro creado correctamente"
        except IntegrityError as e:
            self.session.rollback()
            logger.error(f"Error de integridad al crear libro: {e}", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError as e:
            self.session.rollback()
            logger.error(f"Error al crear libro: {e}", exc_info=True)
            raise ServerError()

    def update_book(self, id: UUID, data: BookUpdate):
        try:
            # Actualizar libro en una transacción
            with self.session.begin_nested():
                book = self.repository.get_by_id(id, load_relations=False)
                if not book:
                    raise NotFound()

                # Actualizar campos básicos
                update_data = data.model_dump(exclude_unset=True, exclude={"genre_ids", "author_ids"})
                for key, value in update_data.items():
                    setattr(book, key, value)
                
                # Actualizar relaciones si se proporcionan
                if data.genre_ids is not None:
                    self.repository.set_genres(book, data.genre_ids)
                
                if data.author_ids is not None:
                    self.repository.set_authors(book, data.author_ids)
                
                # Guardar cambios
                self.repository.update(book)
            
            self.session.commit()
            return BookOut.model_validate(book)
        except IntegrityError as e:
            self.session.rollback()
            logger.error(f"Error de integridad al actualizar libro {id}: {e}", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError as e:
            self.session.rollback()
            logger.error(f"Error al actualizar el libro {id}: {e}", exc_info=True)
            raise ServerError()

    def delete_book(self, id: UUID):
        try:
            with self.session.begin_nested():
                book = self.repository.get_by_id(id, load_relations=False)
                if not book:
                    raise NotFound()
                self.repository.delete(book)
                self.copies_service.delete_book_copy_by_book(id)
            self.session.commit()
            return "Libro eliminado correctamente"
        except SQLAlchemyError as e:
            self.session.rollback()
            logger.error(f"Error al eliminar el libro {id}: {e}", exc_info=True)
            raise ServerError()

    def get_books_by_genre(self, genre: str | UUID):
        try:
            books = self.repository.get_by_genre(genre)
            if not books:
                raise NotFound()
            return [BookOut.model_validate(book) for book in books]
        except SQLAlchemyError as e:
            logger.error(f"Error al obtener libros por género: {e}", exc_info=True)
            raise ServerError()
        
    def get_books_by_author(self, author: str | UUID):
        try:
            books = self.repository.get_by_author(author)
            if not books:
                raise NotFound()
            return [BookOut.model_validate(book) for book in books]
        except SQLAlchemyError as e:
            logger.error(f"Error al obtener libros por autor: {e}", exc_info=True)
            raise ServerError()

    def search_books(self, q: str):
        try:
            books = self.repository.search(q)
            if not books:
                raise NotFound()
            return [BookOut.model_validate(book) for book in books]
        except SQLAlchemyError as e:
            logger.error(f"Error al buscar libros: {e}", exc_info=True)
            raise ServerError()

    def add_genre_to_book(self, book_id: UUID, genre_id: UUID):
        try:
            with self.session.begin_nested():
                book = self.repository.get_by_id(book_id, load_relations=False)
                if not book:
                    raise NotFound()

                # Verificar que el género existe
                self.genre_service.get_genre_by_id(genre_id)

                # Verificar que no está ya asignado
                existing = self.repository.get_book_genre(book_id, genre_id)
                if existing:
                    raise ConflictError("Género ya asignado")

                # Crear relación (sin commit individual)
                book_genre = BookGenre(book_id=book_id, genre_id=genre_id)
                self.session.add(book_genre)
            
            self.session.commit()
            return "Género agregado correctamente"
        except SQLAlchemyError as e:
            self.session.rollback()
            logger.error(f"Error al agregar género: {e}", exc_info=True)
            raise ServerError()

    def add_author_to_book(self, book_id: UUID, author_id: UUID):
        try:
            with self.session.begin_nested():
                book = self.repository.get_by_id(book_id, load_relations=False)
                if not book:
                    raise NotFound()

                # Verificar que el autor existe
                self.author_service.get_author_by_id(author_id)

                # Verificar que no está ya asignado
                existing = self.repository.get_book_author(book_id, author_id)
                if existing:
                    raise ConflictError("Autor ya asignado")

                # Crear relación (sin commit individual)
                book_author = BookAuthor(book_id=book_id, author_id=author_id)
                self.session.add(book_author)
            
            self.session.commit()
            return "Autor agregado correctamente"
        except SQLAlchemyError as e:
            self.session.rollback()
            logger.error(f"Error al agregar autor: {e}", exc_info=True)
            raise ServerError()

    def remove_genre_from_book(self, book_id: UUID, genre_id: UUID):
        try:
            with self.session.begin_nested():
                book_genre = self.repository.get_book_genre(book_id, genre_id)
                if not book_genre:
                    raise BadRequest("Relación no encontrada")
                
                # Eliminar relación (sin commit individual)
                self.session.delete(book_genre)
            
            self.session.commit()
            return "Género eliminado correctamente"
        except SQLAlchemyError as e:
            self.session.rollback()
            logger.error(f"Error al eliminar género: {e}", exc_info=True)
            raise ServerError()

    def remove_author_from_book(self, book_id: UUID, author_id: UUID):
        try:
            with self.session.begin_nested():
                book_author = self.repository.get_book_author(book_id, author_id)
                if not book_author:
                    raise BadRequest("Relación no encontrada")
                
                # Eliminar relación (sin commit individual)
                self.session.delete(book_author)
            
            self.session.commit()
            return "Autor eliminado correctamente"
        except SQLAlchemyError as e:
            self.session.rollback()
            logger.error(f"Error al eliminar autor: {e}", exc_info=True)
            raise ServerError()