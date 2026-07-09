from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os

# Ensure the driver is postgresql+asyncpg for asynchronous operations
DATABASE_URL = os.getenv("ASYNC_DATABASE_URL", "postgresql+asyncpg://user:password@localhost/dbname")

engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)