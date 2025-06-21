from sqlmodel import Field
import pyotp
from sqlalchemy import event, func, inspect
from sqlalchemy.dialects.postgresql import BYTEA
from .common import Base
from src.core.security import hash_password, encrypt_data
from src.core.config import CONFIG
from src.schemas.users import Roles


IMAGE = "https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg"

class User(Base, table=True):
    """Representación de la tabla `tbl_users` de la base de datos.

    Args:
        Base (Base): Base común para las tablas
        table (bool, optional): Opción de SQLModel para indicar que es una tabla de la base de datos. True por defecto.
    """

    __tablename__ = "tbl_users"
    
    first_name: str = Field(nullable=False, min_length=5, max_length=100)
    last_name: str = Field(nullable=False, min_length=5, max_length=100)
    username: str = Field(min_length=5, max_length=20, index=True, unique=True)
    email: bytes = Field(nullable=False,index=True, unique=True, sa_type=BYTEA)
    password: str = Field(nullable=False, min_length=8, max_length=255)
    role: Roles = Field(nullable=False, min_length=4, max_length=9, default=Roles.USER)
    is_confirmed: bool = Field(default=False)
    mfa_active: bool = Field(default=False)
    totp_secret: str = Field(nullable=True)
    image_url: str = Field(default=IMAGE, nullable=False, max_length=255)
    disabled: bool = Field(default=False)


@event.listens_for(User, "before_insert")
def hash_password_on_insert(mapper, connection, target: User):
    """""Hash password before user creation"""""
    target.password = hash_password(target.password)

@event.listens_for(User, "before_update")
def hash_password_on_update(mapper, connection, target: User):
    """Hash password only if changed during updates"""
    insp = inspect(target)
    if insp.attrs.password.history.has_changes():
        target.password = hash_password(target.password)

@event.listens_for(User, "before_update")
def encrypt_totp_secret(mapper, connection, target: User):
    """Encrypt TOTP secret when modified and MFA is active"""
    insp = inspect(target)
    
    if not insp.attrs.mfa_active.history.has_changes():
        return
    
    if target.mfa_active and target.totp_secret == None:
        target.totp_secret = encrypt_data(pyotp.random_base32())

@event.listens_for(User, "before_insert")
def encrypt_email_on_insert(mapper, connection, target: User):
    """Encripta el correo del usuario mediante la función pgp_sym_encrypt de PostgreSQL."""
    print(target)
    target.email = connection.execute(
            func.PGP_SYM_ENCRYPT(target.email, CONFIG.CIPHER_KEY)
        ).scalar()

@event.listens_for(User, "before_update")
def encrypt_email_on_update(mapper, connection, target: User):
    """Encripta el correo del usuario si se actualiza mediante la función pgp_sym_encrypt de PostgreSQL."""
    insp = inspect(target)
    if insp.attrs.email.history.has_changes():
        target.email = connection.execute(
            func.PGP_SYM_ENCRYPT(target.email, CONFIG.CIPHER_KEY)
        ).scalar()
''