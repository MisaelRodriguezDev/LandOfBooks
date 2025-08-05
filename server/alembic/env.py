from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlmodel import SQLModel
from src.core.database import get_engine  # Asegúrate de importar tu motor de BD
from src.models import genres, authors, publishers, books, book_genre, book_author, copies, loans, reservations, penalties, users   # ← incluye aquí 'copies'

# Cargar configuración desde alembic.ini
config = context.config

# Obtener el motor de la BD
target_metadata = SQLModel.metadata  # Aquí Alembic detectará los modelos

def run_migrations_online():
    connectable = get_engine()  # Usa tu configuración de conexión
    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

run_migrations_online()
