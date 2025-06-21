from sqlmodel import Session
from src.services.users import UserService
from src.repositories.librarian import LibrarianRepository
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import SQLAlchemyError
from src.libs.logger import logger

class LibrarianService(UserService):
    def __init__(self, session: Session):
        self.repository = LibrarianRepository(session)

    def list_users(self):
        try:
            logger.info("Listando todos los usuarios")
            results = self.repository.get_all()
            print("res",results)
            return [
                {**user.model_dump(exclude={"email"}),"email": decrypted_email}
                for user, decrypted_email in results
            ]
        except SQLAlchemyError:
            logger.error("Error al obtener los usuarios", exc_info=True)
            raise ServerError()