from uuid import UUID
from sqlmodel import Session, select, or_
from sqlalchemy.orm import selectinload
from src.models import Book, Genre, Author, Publisher, BookAuthor, BookGenre

class BookRepository:
    def __init__(self, session:Session):
        self.session = session

    def get_by_id(self, id: UUID):
        stmt = select(Book).where(Book.id == id, Book.enabled).options(
            selectinload(Book.authors),
            selectinload(Book.publisher),
            selectinload(Book.genres)
        )
        return self.session.exec(stmt).first()
    
    def get_all(self):
        stmt = select(Book).where(Book.enabled).options(
            selectinload(Book.authors),
            selectinload(Book.publisher),
            selectinload(Book.genres)
        )
        return self.session.exec(stmt).all()
    
    def create(self, book: Book):
        self.session.add(book)
        self.session.commit()
        return book
    
    def update(self, book: Book):
        self.session.add(book)
        self.session.commit()
        self.session.refresh(book)
        return book
    
    def delete(self, book: Book):
        book.enabled = False
        self.session.add(book)
        self.session.commit()
        self.session.refresh(book)
        return "Book deleted successfully"
    
    def get_by_genre(self, genre: str | UUID):
        try:
            genre_uuid = UUID(str(genre))
            _filter = [Genre.id == genre_uuid]
        except ValueError:
            _filter = [Genre.name == genre]

        stmt = (
            select(Book)
            .join(Book.genres)
            .where(*_filter, Book.enabled).options(
            selectinload(Book.authors),
            selectinload(Book.publisher)
        )
        )
        result = self.session.exec(stmt).all()
        return result
    
    def get_by_author(self, author: str | UUID):
        try:
            author_uuid = UUID(str(author))
            _filter = [Genre.id == author_uuid]
        except ValueError:
            _filter = [Genre.name == author]

        stmt = (
            select(Book)
            .join(Book.authors)
            .where(*_filter, Book.enabled).options(
            selectinload(Book.publisher),
            selectinload(Book.genres)
        )
        )
        result = self.session.exec(stmt).all()
        return result
    
    def get_by_publisher(self, publisher: str | UUID):
        try:
            publisher_uuid = UUID(str(publisher))
            _filter = [Genre.id == publisher_uuid]
        except ValueError:
            _filter = [Genre.name == publisher]

        stmt = (
            select(Book)
            .join(Book.publisher)
            .where(*_filter, Book.enabled).options(
            selectinload(Book.authors),
            selectinload(Book.genres)
        )
        )
        result = self.session.exec(stmt).all()
        return result
    
    def search(self, q: str):
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
        )
        return self.session.exec(stmt).all()
    
    def add_genre(self, book: Book, genre_id: UUID):
        book_genre = BookGenre(book_id=book.id, genre_id=genre_id)
        self.session.add(book_genre)
        self.session.commit()
        self.session.refresh(book)
        return book
    
    def add_author(self, book: Book, author_id: UUID):
        book_author = BookAuthor(book_id=book.id, author_id=author_id)
        self.session.add(book_author)
        self.session.commit()
        self.session.refresh(book)
        return book

    def remove_genre(self, book_genre: BookGenre):
        self.session.delete(book_genre)
        self.session.commit()
        return "Genre deleted successfully"
    
    def remove_author(self, book_author: BookAuthor):
        self.session.delete(book_author)
        self.session.commit()
        return "author deleted successfully"
    
    def get_book_genre(self, book_id: UUID, genre_id: UUID):
        stmt = select(BookGenre).where(BookGenre.book_id == book_id, BookGenre.genre_id == genre_id)
        return self.session.exec(stmt).first()
    
    def get_book_author(self, book_id: UUID, author_id: UUID):
        stmt = select(BookAuthor).where(BookAuthor.book_id == book_id, BookAuthor.author_id == author_id)
        return self.session.exec(stmt).first()