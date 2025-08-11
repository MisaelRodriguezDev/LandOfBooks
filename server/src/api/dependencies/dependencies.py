from fastapi import Depends, APIRouter
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import func
from sqlmodel import Session, select
import jwt
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from src.schemas.security import SecurityContext
from src.schemas.users import Roles
from src.models.users import User
from src.core.config import CONFIG
from src.core.database import get_session
from src.core.security import verify_password, ALGORITHM
from src.services.users import UserService
from src.services.librarian import LibrarianService
from src.services.admin import AdminService
from src.exceptions.exceptions import UnauthorizedError, ServerError, ForbiddenError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")
router = APIRouter()


def get_account_by_username(session: Session, username: str):
    """Obtén la cuenta de un usuario en base a su username

    Args:
        username (str): Apodo o nick del usuario

    Returns:
        User: Devuelve un objecto de la clase del usuario o empresa (próximamnte).
        Si no se encuntra al usuario no regresa nada
    """
    result = session.exec(select(User, func.pgp_sym_decrypt(User.email, CONFIG.CIPHER_KEY).label("decrypted_email")).where(User.username == username)).first()
    if result:
        print(result)
        account, decrypted_email = result
        account.email = decrypted_email
        return account

def authenticate_user(session: Session, username: str, password: str):
    """Verifica que las credenciales del usuario sean correctas
    
    Args:
        username (str): Apodo o nick del usuario
        password (str): Contraseña del usuario
    
    Returns:
        User: Si las credenciales son correctas devuelve la cuenta en caso contrario devuelve false
    """    
    account = get_account_by_username(session, username)
    if not account or not account.is_confirmed:
        return False
    if not verify_password(password, account.password):
        return False
    return account

def get_current_account(session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)):
    """Obtén la cuenta del usuario que realiza la petición
    
    Args:
        token (str, optional): Token JWT de para la autorización. Defaults to Depends(oauth2_scheme).
    
    Raises:
        UnauthorizedError: El usuario no esta autenticado
        ServerError: Ocurrió un error inesperado
    
    Returns:
        User: Retorna la cuenta del usuario
    """    
    try:
        payload = jwt.decode(token, CONFIG.SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("username")
        if username is None:
            raise UnauthorizedError()
        account = get_account_by_username(session, username)
        if account is None:
            raise UnauthorizedError()
        return account
    except InvalidTokenError as e:
        raise UnauthorizedError() from e
    except ExpiredSignatureError as e:
        raise UnauthorizedError() from e
    except Exception as e:
        raise ServerError() from e

def get_current_active_account(current_user: User = Depends(get_current_account)):
    """Verifica que la cuenta este activa, es decir, que el usuario la haya confirmado
    
    Args:
        current_user (User, optional): Información del usuario actual Defaults to Depends(get_current_account).
    
    Raises:
        UnauthorizedError: El usuario no esta confirmado
    
    Returns:
        User: Retorna la cuenta del usuario
    """    
    if not current_user.is_confirmed or not current_user.enabled:
        raise UnauthorizedError()
    return current_user

def is_admin(current_user: User = Depends(get_current_active_account)):
    if current_user.role != Roles.ADMIN:
        raise ForbiddenError()
    return current_user

def is_librarian_or_admin(current_user: User = Depends(get_current_active_account)):
    valid_roles = [Roles.ADMIN, Roles.LIBRARIAN]
    if current_user.role not in valid_roles:
        raise ForbiddenError()
    return current_user

def get_security_context(
    current_user: User = Depends(get_current_active_account)
) -> SecurityContext:
    return SecurityContext(
        user=current_user,
        is_admin=current_user.role == Roles.ADMIN,
        is_librarian=current_user.role == Roles.LIBRARIAN
    )

def get_user_service(session: Session = Depends(get_session)) -> UserService:
    return UserService(session)

def get_librarian_service(session: Session = Depends(get_session), _:User = Depends(is_librarian_or_admin)):
    return LibrarianService(session)

def get_admin_service(session: Session = Depends(get_session), _ = Depends(is_admin)):
    return AdminService(session)

def get_service(service):
    def dependency(session: Session = Depends(get_session)):
        return service(session)
    return dependency