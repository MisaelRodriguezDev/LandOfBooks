from typing import List, Optional
from uuid import UUID
from sqlmodel import Session, select, delete, or_
from sqlalchemy.orm import selectinload
from src.models import Book, Genre, Author, Publisher, BookAuthor, BookGenre

class BookRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, id: UUID, load_relations: bool = True) -> Optional[Book]:
        """Obtiene un libro por ID, opcionalmente cargando relaciones"""
        stmt = select(Book).where(Book.id == id, Book.enabled)
        if load_relations:
            stmt = stmt.options(
                selectinload(Book.authors),
                selectinload(Book.publisher),
                selectinload(Book.genres)
            )
        return self.session.exec(stmt).first()
    
    def get_all(self):
        """Obtiene todos los libros habilitados con relaciones cargadas"""
        stmt = select(Book).where(Book.enabled).options(
            selectinload(Book.authors),
            selectinload(Book.publisher),
            selectinload(Book.genres)
        )
        return self.session.exec(stmt).all()
        
    
    def create(self, book: Book) -> Book:
        """Crea un nuevo libro (sin hacer commit)"""
        self.session.add(book)
        return book
    
    def update(self, book: Book) -> Book:
        """Actualiza un libro existente (sin hacer commit)"""
        self.session.add(book)
        return book
    
    def delete(self, book: Book) -> Book:
        """Marca un libro como eliminado (sin hacer commit)"""
        book.enabled = False
        self.session.add(book)
        return book
    
    def get_by_genre(self, genre: str | UUID):
        """Busca libros por género (ID o nombre)"""
        try:
            genre_uuid = UUID(str(genre))
            _filter = [Genre.id == genre_uuid]
        except ValueError:
            _filter = [Genre.name == genre]

        stmt = (
            select(Book)
            .join(Book.genres)
            .where(*_filter, Book.enabled)
            .options(
                selectinload(Book.authors),
                selectinload(Book.publisher)
            )
        )
        return self.session.exec(stmt).all()
    
    def get_by_author(self, author: str | UUID):
        """Busca libros por autor (ID o nombre)"""
        try:
            author_uuid = UUID(str(author))
            _filter = [Author.id == author_uuid]  # Corregido: usar Author en lugar de Genre
        except ValueError:
            # Asumimos que el modelo Author tiene un campo 'name'
            _filter = [Author.name == author]

        stmt = (
            select(Book)
            .join(Book.authors)
            .where(*_filter, Book.enabled)
            .options(
                selectinload(Book.publisher),
                selectinload(Book.genres)
            )
        )
        return self.session.exec(stmt).all()
    
    def get_by_publisher(self, publisher: str | UUID):
        """Busca libros por editorial (ID o nombre)"""
        try:
            publisher_uuid = UUID(str(publisher))
            _filter = [Publisher.id == publisher_uuid]
        except ValueError:
            _filter = [Publisher.name == publisher]

        stmt = (
            select(Book)
            .join(Book.publisher)
            .where(*_filter, Book.enabled)
            .options(
                selectinload(Book.authors),
                selectinload(Book.genres)
            )
        )
        return self.session.exec(stmt).all()
    
    def search(self, q: str):
        """Busca libros por término en título, autor, género o editorial"""
        stmt = (
            select(Book)
            .join(Book.genres)
            .join(Book.authors)
            .join(Book.publisher)
            .where(or_(
                Book.title.ilike(f'%{q}%'),
                Genre.name.ilike(f'%{q}%'),
                Author.first_name.ilike(f'%{q}%'),
                Author.last_name.ilike(f'%{q}%'),
                Author.pseudonym.ilike(f'%{q}%'),
                Publisher.name.ilike(f'%{q}%')
            ), Book.enabled)
            .options(
                selectinload(Book.authors),
                selectinload(Book.publisher),
                selectinload(Book.genres)
            )
        )
        return self.session.exec(stmt).all()
    
    def set_authors(self, book: Book, author_ids: List[UUID]) -> None:
        """Establece los autores del libro usando operaciones masivas"""
        # Eliminar relaciones existentes
        delete_stmt = delete(BookAuthor).where(BookAuthor.book_id == book.id)
        self.session.exec(delete_stmt)
        
        # Crear nuevas relaciones en lote
        if author_ids:
            book_authors = [
                BookAuthor(book_id=book.id, author_id=author_id)
                for author_id in author_ids
            ]
            self.session.add_all(book_authors)
    
    def set_genres(self, book: Book, genre_ids: List[UUID]) -> None:
        """Establece los géneros del libro usando operaciones masivas"""
        # Eliminar relaciones existentes
        delete_stmt = delete(BookGenre).where(BookGenre.book_id == book.id)
        self.session.exec(delete_stmt)
        
        # Crear nuevas relaciones en lote
        if genre_ids:
            book_genres = [
                BookGenre(book_id=book.id, genre_id=genre_id)
                for genre_id in genre_ids
            ]
            self.session.add_all(book_genres)
    
    # Métodos para operaciones individuales (mantenidos para compatibilidad)
    def get_book_genre(self, book_id: UUID, genre_id: UUID):
        """Obtiene una relación específica libro-género"""
        stmt = select(BookGenre).where(BookGenre.book_id == book_id, BookGenre.genre_id == genre_id)
        return self.session.exec(stmt).first()
    
    def get_book_author(self, book_id: UUID, author_id: UUID):
        """Obtiene una relación específica libro-autor"""
        stmt = select(BookAuthor).where(BookAuthor.book_id == book_id, BookAuthor.author_id == author_id)
        return self.session.exec(stmt).first()