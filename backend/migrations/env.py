import asyncio
import os
import sys
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from dotenv import load_dotenv

from alembic import context

# 1. System Path & Environment Integration
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))

load_dotenv()

from db.database import Base
# Спочатку імпортуємо моделі, щоб вони 100% ініціалізувалися в пам'яті
from modules.products.models import Product, Category

# Тепер імпортуємо Base. 
# Якщо у файлі models.py є імпорт Base, краще імпортувати його прямо звідти:
# from modules.products.models import Base
# Але поки спробуємо залишити стандартний шлях:
from db.database import Base

target_metadata = Base.metadata

# --- ДІАГНОСТИЧНИЙ БЛОК ---
print("\n" + "="*40)
print("ТАБЛИЦІ, ЯКІ БАЧИТЬ ALEMBIC:")
print(target_metadata.tables.keys())
print("="*40 + "\n")
# --------------------------

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 3. Dynamic Database URL injection
db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise ValueError("CRITICAL: DATABASE_URL is missing in .env")
config.set_main_option("sqlalchemy.url", db_url)

# (DO NOT DELETE THE CODE BELOW THIS LINE)
# def run_migrations_offline() -> None:
# ...