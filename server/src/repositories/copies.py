from uuid import UUID
from sqlmodel import Session, select, update
from src.models import BookCopy
from src.schemas.books import BookCopyStatus as Status

class BookCopyRepository:
    def __init__(self, session: Session):
        self.session = session

    def _save_and_refresh(self, instance: BookCopy):
        self.session.add(instance)
        self.session.commit()
        self.session.refresh(instance)
        return instance

    def get_by_id(self, id: UUID):
        stmt = select(BookCopy).where(BookCopy.id == id, BookCopy.enabled)
        return self.session.exec(stmt).first()
    
    def get_all(self):
        stmt = select(BookCopy).where(BookCopy.enabled)
        return self.session.exec(stmt).all()

    def get_all_from_admin(self):
        stmt = select(BookCopy)
        return self.session.exec(stmt).all()
    
    def get_all_available(self):
        stmt = select(BookCopy).where(BookCopy.status ==  Status.AVAILABLE,BookCopy.enabled)
        return self.session.exec(stmt).all()
    
    def get_available_by_book(self, book_id: UUID):
        stmt = select(BookCopy).where(BookCopy.book_id == book_id, BookCopy.status == Status.AVAILABLE, BookCopy.enabled)
        return self.session.exec(stmt).all()
        
    def get_by_barcode(self, barcode: str):
        stmt = select(BookCopy).where(BookCopy.barcode == barcode, BookCopy.enabled)
        return self.session.exec(stmt).first()
    
    def create(self, book_copy: BookCopy):
        return self._save_and_refresh(book_copy)
    
    def update(self, book_copy: BookCopy):
        return self._save_and_refresh(book_copy)
    
    def delete(self, book_copy: BookCopy):
        book_copy.status = Status.REMOVED
        book_copy.enabled = False
        return self._save_and_refresh(book_copy)
    
    def delete_by_book(self, book_id: UUID):
        stmt = (
            update(BookCopy)
            .where(BookCopy.book_id == book_id)
            .values(enabled = False, status = Status.REMOVED)
        )
        
        self.session.exec(stmt)
        return "Copias deshabilitadas"
    
    def mark_book_as_lost(self, book_copy: BookCopy):
        book_copy.status = Status.LOST
        book_copy.enabled = False
        return self._save_and_refresh(book_copy)
    
    def update_status(self, book_copy: BookCopy, status: Status):
        book_copy.status = status
        return self._save_and_refresh(book_copy)