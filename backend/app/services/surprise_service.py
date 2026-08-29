import secrets
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models import Surprise
from app.schemas import SurpriseCreate


def generate_token() -> str:
    """Generate a cryptographically secure URL-safe token."""
    return secrets.token_urlsafe(16)


def create_surprise(db: Session, data: SurpriseCreate, user_id: int = None) -> Surprise:
    """Create a new surprise with a unique public token."""
    token = generate_token()
    # Ensure uniqueness
    while db.query(Surprise).filter(Surprise.public_token == token).first():
        token = generate_token()

    # Convert unlock_at to UTC using the provided timezone
    try:
        utc_unlock = data.get_utc_unlock_at()
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail=str(e))

    surprise = Surprise(
        public_token=token,
        user_id=user_id,
        recipient_name=data.recipient_name,
        title=data.title,
        creator_name=data.creator_name,
        occasion=data.occasion,
        occasion_icon=data.occasion_icon,
        greeting=data.greeting,
        message=data.message,
        unlock_at=utc_unlock,
        timezone=data.timezone,
        theme=data.theme,
        box_style=data.box_style,
    )
    db.add(surprise)
    db.flush() # Flush to get surprise.id

    from app.models import SurpriseItem
    for item_data in data.items:
        new_item = SurpriseItem(
            surprise_id=surprise.id,
            type=item_data.type,
            title=item_data.title,
            content=item_data.content,
            media_url=item_data.media_url,
            display_order=item_data.display_order,
        )
        db.add(new_item)

    db.commit()
    db.refresh(surprise)
    return surprise


def get_surprise_by_token(db: Session, token: str) -> Surprise:
    """Get a surprise by its public token. Raises 404 if not found."""
    surprise = db.query(Surprise).filter(Surprise.public_token == token).first()
    if not surprise:
        raise HTTPException(status_code=404, detail="Surprise not found")
    return surprise


def is_surprise_locked(surprise: Surprise) -> bool:
    """Server-side check: is the surprise still locked?"""
    now = datetime.now(timezone.utc)
    unlock_at = surprise.unlock_at
    # Ensure timezone-aware comparison
    if unlock_at.tzinfo is None:
        unlock_at = unlock_at.replace(tzinfo=timezone.utc)
    locked = now < unlock_at
    print(f"DEBUG BACKEND: now={now}, unlock_at={unlock_at}, locked={locked}")
    return locked


def get_surprise_content(db: Session, token: str) -> dict:
    """Get protected content. Raises 403 if locked."""
    surprise = get_surprise_by_token(db, token)

    if is_surprise_locked(surprise):
        raise HTTPException(
            status_code=403,
            detail="This surprise is still locked. Please wait until the unlock time.",
        )

    # Mark as opened
    if not surprise.is_opened:
        surprise.is_opened = True
        db.commit()

    # Get items
    items = []
    for item in surprise.items:
        items.append({
            "id": item.id,
            "type": item.type,
            "title": item.title,
            "content": item.content,
            "media_url": item.media_url,
            "display_order": item.display_order,
        })
    items.sort(key=lambda x: x["display_order"])

    return {
        "message": surprise.message,
        "items": items,
    }
