from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    surprises = relationship("Surprise", back_populates="user", cascade="all, delete-orphan")


class Surprise(Base):
    __tablename__ = "surprises"

    id = Column(Integer, primary_key=True, autoincrement=True)
    public_token = Column(String(32), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Optional for backward compatibility / anonymous users
    recipient_name = Column(String(200), nullable=False)
    title = Column(String(500), nullable=False)
    creator_name = Column(String(200), nullable=True)
    occasion = Column(String(100), nullable=False)
    occasion_icon = Column(String(10), nullable=True)
    greeting = Column(Text, nullable=True)
    message = Column(Text, nullable=True)
    unlock_at = Column(DateTime(timezone=True), nullable=False)
    timezone = Column(String(100), default="UTC")
    theme = Column(String(50), default="elegant")
    box_style = Column(String(50), default="classic")
    is_opened = Column(Boolean, default=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="surprises")
    items = relationship("SurpriseItem", back_populates="surprise", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Surprise(id={self.id}, token={self.public_token}, recipient={self.recipient_name})>"


class SurpriseItem(Base):
    __tablename__ = "surprise_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    surprise_id = Column(Integer, ForeignKey("surprises.id"), nullable=False)
    type = Column(String(50), nullable=False)  # text, letter, photo, video, audio, link, coupon
    title = Column(String(500), nullable=True)
    content = Column(Text, nullable=True)
    media_url = Column(String(1000), nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    surprise = relationship("Surprise", back_populates="items")

    def __repr__(self):
        return f"<SurpriseItem(id={self.id}, type={self.type})>"
