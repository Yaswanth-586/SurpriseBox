from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List

from app.database import get_db
from app.schemas import (
    SurpriseCreate,
    SurpriseCreatedResponse,
    SurprisePublicResponse,
    SurpriseContentResponse,
    OccasionResponse,
    ServerTimeResponse,
)
from app.services.surprise_service import (
    create_surprise,
    get_surprise_by_token,
    is_surprise_locked,
    get_surprise_content,
)

router = APIRouter()

# Predefined occasions
OCCASIONS: List[dict] = [
    {"id": "birthday", "name": "Birthday", "icon": "\U0001F382", "default_greeting": "Happy Birthday! Wishing you a day filled with happiness, laughter, and beautiful memories."},
    {"id": "anniversary", "name": "Anniversary", "icon": "\U0001F48D", "default_greeting": "Happy Anniversary! Celebrating the beautiful journey you\u2019ve shared together."},
    {"id": "valentines", "name": "Valentine's Day", "icon": "\u2764\uFE0F", "default_greeting": "Happy Valentine\u2019s Day! You make every moment special."},
    {"id": "christmas", "name": "Christmas", "icon": "\U0001F384", "default_greeting": "Merry Christmas! May your day be filled with warmth, joy, and love."},
    {"id": "new_year", "name": "New Year", "icon": "\U0001F386", "default_greeting": "Happy New Year! Here\u2019s to new beginnings and wonderful adventures."},
    {"id": "diwali", "name": "Diwali", "icon": "\U0001FA94", "default_greeting": "Happy Diwali! May the festival of lights bring joy and prosperity."},
    {"id": "holi", "name": "Holi", "icon": "\U0001F308", "default_greeting": "Happy Holi! May your life be as colorful and joyful as this festival."},
    {"id": "ugadi", "name": "Ugadi", "icon": "\U0001F338", "default_greeting": "Happy Ugadi! Wishing you a wonderful new beginning."},
    {"id": "sankranti", "name": "Sankranti", "icon": "\U0001FA81", "default_greeting": "Happy Sankranti! May this harvest festival bring abundance and happiness."},
    {"id": "eid", "name": "Eid", "icon": "\U0001F319", "default_greeting": "Eid Mubarak! Wishing you peace, happiness, and blessings."},
    {"id": "graduation", "name": "Graduation", "icon": "\U0001F393", "default_greeting": "Congratulations on your graduation! Your hard work has paid off."},
    {"id": "mothers_day", "name": "Mother's Day", "icon": "\U0001F469", "default_greeting": "Happy Mother\u2019s Day! Thank you for being the amazing person you are."},
    {"id": "fathers_day", "name": "Father's Day", "icon": "\U0001F468", "default_greeting": "Happy Father\u2019s Day! Thank you for everything you do."},
    {"id": "friendship_day", "name": "Friendship Day", "icon": "\U0001F91D", "default_greeting": "Happy Friendship Day! Here\u2019s to the incredible bond we share."},
    {"id": "wedding", "name": "Wedding", "icon": "\U0001F490", "default_greeting": "Congratulations on your wedding! Wishing you a lifetime of love and happiness."},
    {"id": "achievement", "name": "Achievement", "icon": "\U0001F389", "default_greeting": "Congratulations on your amazing achievement! You deserve this."},
    {"id": "custom", "name": "Custom Occasion", "icon": "\u2728", "default_greeting": "Something special is waiting for you..."},
]


from app.api.deps import get_optional_current_user
from app.models import User

@router.post("/surprises", response_model=SurpriseCreatedResponse, status_code=201)
def api_create_surprise(data: SurpriseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_optional_current_user)):
    """Create a new time-locked surprise."""
    user_id = current_user.id if current_user else None
    surprise = create_surprise(db, data, user_id=user_id)
    return SurpriseCreatedResponse(
        public_token=surprise.public_token,
        recipient_name=surprise.recipient_name,
        title=surprise.title,
        unlock_at=surprise.unlock_at,
        created_at=surprise.created_at,
    )


@router.get("/surprises/{token}", response_model=SurprisePublicResponse)
def api_get_surprise(token: str, db: Session = Depends(get_db)):
    """Get public surprise information. NEVER returns the secret message."""
    surprise = get_surprise_by_token(db, token)
    locked = is_surprise_locked(surprise)
    now = datetime.now(timezone.utc)

    # Ensure timezone-aware datetimes (SQLite strips tz info)
    unlock_at = surprise.unlock_at
    if unlock_at and unlock_at.tzinfo is None:
        unlock_at = unlock_at.replace(tzinfo=timezone.utc)
    created_at = surprise.created_at
    if created_at and created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    return SurprisePublicResponse(
        public_token=surprise.public_token,
        recipient_name=surprise.recipient_name,
        title=surprise.title,
        creator_name=surprise.creator_name,
        occasion=surprise.occasion,
        occasion_icon=surprise.occasion_icon,
        greeting=surprise.greeting,
        unlock_at=unlock_at,
        timezone=surprise.timezone,
        theme=surprise.theme,
        box_style=surprise.box_style,
        is_locked=locked,
        server_time=now,
        created_at=created_at,
    )


@router.get("/surprises/{token}/content", response_model=SurpriseContentResponse)
def api_get_surprise_content(token: str, db: Session = Depends(get_db)):
    """Get protected surprise content. Returns 403 if still locked."""
    content = get_surprise_content(db, token)
    return SurpriseContentResponse(**content)


@router.get("/occasions", response_model=List[OccasionResponse])
def api_get_occasions():
    """Get list of predefined occasions with default greetings."""
    return [OccasionResponse(**o) for o in OCCASIONS]


@router.get("/server-time", response_model=ServerTimeResponse)
def api_get_server_time():
    """Get current server time for countdown synchronization."""
    return ServerTimeResponse(server_time=datetime.now(timezone.utc))
