from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Persona(Base):
    __tablename__ = "personas"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    project_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(100), nullable=False)

    age: Mapped[int] = mapped_column(nullable=False)

    occupation: Mapped[str] = mapped_column(String(150), nullable=False)

    personality: Mapped[str] = mapped_column(Text, nullable=False)

    behavioral_patterns: Mapped[str] = mapped_column(Text, nullable=False)

    psychological_profile: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    memory_summary: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )