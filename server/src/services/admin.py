from uuid import UUID
from sqlmodel import Session
from src.models.users import User
from src.schemas.admin import UserInFromAdmin, UserUpdateFromAdmin
from src.repositories.admin import AdminRepository
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger
from .librarian import LibrarianService

class AdminService(LibrarianService):
    def __init__(self, session: Session):
        super().__init__(session)
        self.repository = AdminRepository(session)

    def create_user(self, data: UserInFromAdmin):
        try:
            user = User(**data.model_dump())
            self.repository.create(user)
            return "Usuario creado correctamente"
        except IntegrityError:
            logger.error("Usuario duplicado", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al crear usuario", exc_info=True)
            raise ServerError()
    
    def update_user(self, id: UUID, data: UserUpdateFromAdmin):
        try:
            user = self.get_user(id)  # ya incluye email descifrado
            updates = data.model_dump(exclude_unset=True)
            for key, value in updates.items():
                setattr(user, key, value)
            updated_user = self.repository.update(user)
            email = self.repository.get_by_id(id)[1]  # obtener email descifrado
            updated_user.email = email
            return updated_user
        except IntegrityError:
            logger.error("Error de integridad al actualizar", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al actualizar usuario", exc_info=True)
            raise ServerError()