"""create tables

Revision ID: 3134f554f664
Revises: 243d89800307
Create Date: 2025-07-22 20:45:09.036657

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3134f554f664'
down_revision: Union[str, None] = '243d89800307'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Eliminar columna 'disabled'
    op.drop_column('tbl_users', 'disabled')
    # Agregar columna 'enabled', por defecto True
    op.add_column('tbl_users', sa.Column('enabled', sa.Boolean(), nullable=False, server_default=sa.text('TRUE')))

def downgrade():
    # En reversión: eliminar 'enabled' y restaurar 'disabled'
    op.drop_column('tbl_users', 'enabled')
    op.add_column('tbl_users', sa.Column('disabled', sa.Boolean(), nullable=False, server_default=sa.text('FALSE')))
    # ### end Alembic commands ###
