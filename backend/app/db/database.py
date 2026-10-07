from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


engine = None
SessionLocal = None


if settings.database_url and settings.database_url != "your_database_url_here":
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
    )

    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )


def get_db():
    if SessionLocal is None:
        raise RuntimeError("Database is not configured.")

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()