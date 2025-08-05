"""crear todas las tablas

Revision ID: 133a8eb14c74
Revises: 3134f554f664
Create Date: 2025-07-22 21:01:28.527199

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '133a8eb14c74'
down_revision: Union[str, None] = '3134f554f664'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('tbl_authors',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('first_name', sa.String(length=50), nullable=False),
        sa.Column('last_name', sa.String(length=50), nullable=False),
        sa.Column('pseudonym', sa.String(length=20), nullable=True),
        sa.Column('photo', sa.String(length=255), nullable=False),
        sa.Column('biography', sa.String(length=2500), nullable=True),
        sa.Column('nationality', sa.String(length=100), nullable=True),
        sa.Column('birth_date', sa.Date(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tbl_authors_first_name'), 'tbl_authors', ['first_name'], unique=False)
    op.create_index(op.f('ix_tbl_authors_last_name'), 'tbl_authors', ['last_name'], unique=False)
    op.create_index(op.f('ix_tbl_authors_pseudonym'), 'tbl_authors', ['pseudonym'], unique=True)

    op.create_table('tbl_genres',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('name', sa.String(length=15), nullable=False),
        sa.Column('description', sa.TEXT(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tbl_genres_name'), 'tbl_genres', ['name'], unique=True)

    op.create_table('tbl_publishers',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('phone', sa.String(length=13), nullable=True),
        sa.Column('image_url', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('tbl_books',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('isbn', sa.String(length=13), nullable=False),
        sa.Column('title', sa.String(length=100), nullable=False),
        sa.Column('description', sa.TEXT(), nullable=False),
        sa.Column('cover', sa.String(length=255), nullable=False),
        sa.Column('year_of_publication', sa.Integer(), nullable=False),
        sa.Column('publisher_id', sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(['publisher_id'], ['tbl_publishers.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tbl_books_isbn'), 'tbl_books', ['isbn'], unique=False)
    op.create_index(op.f('ix_tbl_books_title'), 'tbl_books', ['title'], unique=False)

    op.create_table('tbl_book_author',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('book_id', sa.Uuid(), nullable=False),
        sa.Column('author_id', sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['tbl_authors.id']),
        sa.ForeignKeyConstraint(['book_id'], ['tbl_books.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tbl_book_author_author_id'), 'tbl_book_author', ['author_id'], unique=False)
    op.create_index(op.f('ix_tbl_book_author_book_id'), 'tbl_book_author', ['book_id'], unique=False)

    op.create_table('tbl_book_genre',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('book_id', sa.Uuid(), nullable=False),
        sa.Column('genre_id', sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(['book_id'], ['tbl_books.id']),
        sa.ForeignKeyConstraint(['genre_id'], ['tbl_genres.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tbl_book_genre_book_id'), 'tbl_book_genre', ['book_id'], unique=False)
    op.create_index(op.f('ix_tbl_book_genre_genre_id'), 'tbl_book_genre', ['genre_id'], unique=False)

    op.create_table('tbl_copies',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('book_id', sa.Uuid(), nullable=False),
        sa.Column('barcode', sa.String(length=50), nullable=False),
        sa.Column('status', sa.Enum('AVAILABLE', 'LOANED', 'LOST', 'REMOVED', name='bookcopystatus'), nullable=True),
        sa.ForeignKeyConstraint(['book_id'], ['tbl_books.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('barcode')
    )
    op.create_index(op.f('ix_tbl_copies_book_id'), 'tbl_copies', ['book_id'], unique=False)

    op.create_table('tbl_reservations',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('book_id', sa.Uuid(), nullable=False),
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column('reservation_date', sa.Date(), nullable=False),
        sa.Column('state', sa.Enum('ACTIVE', 'COMPLETED', 'CANCELED', name='reservationstatus'), nullable=False),
        sa.Column('reason', sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(['book_id'], ['tbl_books.id']),
        sa.ForeignKeyConstraint(['user_id'], ['tbl_users.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('tbl_loans',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('copy_id', sa.Uuid(), nullable=False),
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column('loan_date', sa.DateTime(), nullable=True),
        sa.Column('due_date', sa.Date(), nullable=True),
        sa.Column('return_date', sa.DateTime(), nullable=True),
        sa.Column('status', sa.Enum('ON_HOLD', 'ACTIVE', 'RETURNED', 'OVERDUE', 'CANCELED', name='loanstatus'), nullable=True),
        sa.ForeignKeyConstraint(['copy_id'], ['tbl_copies.id']),
        sa.ForeignKeyConstraint(['user_id'], ['tbl_users.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('tbl_penalties',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('loan_id', sa.Uuid(), nullable=False),
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('reason', sa.String(length=100), nullable=True),
        sa.Column('generation_date', sa.Date(), nullable=False),
        sa.Column('payment_date', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['loan_id'], ['tbl_loans.id']),
        sa.ForeignKeyConstraint(['user_id'], ['tbl_users.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.add_column('tbl_addresses', sa.Column('enabled', sa.Boolean(), nullable=False))
    op.add_column('tbl_users', sa.Column('phone', sa.String(length=13), nullable=False, server_default='1234567891011'))
    op.alter_column('tbl_users', 'role',
               existing_type=postgresql.ENUM('USER', 'ADMIN', 'LIBRARIAN', name='roles'),
               nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('tbl_users', 'role',
               existing_type=postgresql.ENUM('USER', 'ADMIN', 'LIBRARIAN', name='roles'),
               nullable=False)
    op.drop_column('tbl_users', 'phone')
    op.drop_column('tbl_addresses', 'enabled')

    op.drop_table('tbl_penalties')
    op.drop_table('tbl_loans')
    op.drop_table('tbl_reservations')

    op.drop_index(op.f('ix_tbl_copies_book_id'), table_name='tbl_copies')
    op.drop_table('tbl_copies')

    op.drop_index(op.f('ix_tbl_book_genre_genre_id'), table_name='tbl_book_genre')
    op.drop_index(op.f('ix_tbl_book_genre_book_id'), table_name='tbl_book_genre')
    op.drop_table('tbl_book_genre')

    op.drop_index(op.f('ix_tbl_book_author_book_id'), table_name='tbl_book_author')
    op.drop_index(op.f('ix_tbl_book_author_author_id'), table_name='tbl_book_author')
    op.drop_table('tbl_book_author')

    op.drop_index(op.f('ix_tbl_books_title'), table_name='tbl_books')
    op.drop_index(op.f('ix_tbl_books_isbn'), table_name='tbl_books')
    op.drop_table('tbl_books')

    op.drop_table('tbl_publishers')

    op.drop_index(op.f('ix_tbl_genres_name'), table_name='tbl_genres')
    op.drop_table('tbl_genres')

    op.drop_index(op.f('ix_tbl_authors_pseudonym'), table_name='tbl_authors')
    op.drop_index(op.f('ix_tbl_authors_last_name'), table_name='tbl_authors')
    op.drop_index(op.f('ix_tbl_authors_first_name'), table_name='tbl_authors')
    op.drop_table('tbl_authors')
