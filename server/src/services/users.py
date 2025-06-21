from uuid import UUID
from sqlmodel import Session
from src.schemas.users import UserIn, UserUpdate
from src.models.users import User
from src.repositories.users import UserRepository
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger

class UserService:
    def __init__(self, session: Session):
        self.repository = UserRepository(session)

    def get_user(self, id: UUID):
        try:
            result = self.repository.get_by_id(id)
            if not result:
                raise NotFound(id)
            user, decrypted_email = result
            user.email = decrypted_email
            return user
        except SQLAlchemyError:
            logger.error(f"Error al obtener el usuario {id}", exc_info=True)
            raise ServerError()
    
    def get_user_by_email(self, email: str):
        try:
            result = self.repository.get_by_email(email)
            if not result:
                raise NotFound("Usuario no encontrado")
            user, decrypted_email = result
            user.email = decrypted_email
            return user
        except SQLAlchemyError:
            logger.error("Error al obtener el usuario", exc_info=True)
            raise ServerError()
        
    def create_user(self, data: UserIn):
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

    def update_user(self, id: UUID, data: UserUpdate):
        try:
            user = self.get_user(id)  
            updates = data.model_dump(exclude_unset=True)
            for key, value in updates.items():
                setattr(user, key, value)
            updated_user = self.repository.update(user)
            email = self.repository.get_by_id(id)[1]  
            updated_user.email = email
            return updated_user
        except IntegrityError:
            logger.error("Error de integridad al actualizar", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al actualizar usuario", exc_info=True)
            raise ServerError()

    def delete_user(self, id: UUID):
        try:
            result = self.repository.get_by_id(id)
            if not result:
                raise NotFound()
            user, _ = result
            self.repository.delete(user)
            return "Usuario eliminado correctamente"
        except IntegrityError:
            logger.error("Error al eliminar usuario", exc_info=True)
            raise BadRequest()
        except SQLAlchemyError:
            logger.error("Error en la BD al eliminar", exc_info=True)
            raise ServerError()

    def activate_account(self, email: str):
        try:
            result = self.repository.get_by_email(email)
            if not result:
                raise NotFound()
            user, _ = result
            user.is_confirmed = True
            self.repository.update(user)
            return "Cuenta activada correctamente"
        except SQLAlchemyError:
            logger.error("Error al activar cuenta", exc_info=True)
            raise ServerError()
