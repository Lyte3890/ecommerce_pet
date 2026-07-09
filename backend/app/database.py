import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("CRITICAL: DATABASE_URL environment variable is not set.")

# Initialize the async engine with Enterprise connection pooling parameters
engine = create_async_engine(
    DATABASE_URL,
    echo=False,          # Set to True for SQL query debugging
    future=True,
    pool_size=20,        # Maximum number of permanent connections
    max_overflow=10      # Maximum number of temporary additional connections
)

# Create a highly concurrent async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for all SQLAlchemy ORM models
Base = declarative_base()

# Dependency generator for FastAPI endpoints
async def get_db():
    """
    Yields an active database session to a FastAPI endpoint and 
    safely closes it after the request cycle completes.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()