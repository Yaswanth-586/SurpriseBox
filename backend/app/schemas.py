from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime, timezone


# --- Request Schemas ---

class UserCreate(BaseModel):
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=8)

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    
    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str


# --- Surprise Schemas ---

class SurpriseItemCreate(BaseModel):
    type: str = Field(..., max_length=50) # text, letter, photo, video, audio, link
    title: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = None
    media_url: Optional[str] = Field(None, max_length=1000)
    display_order: int = 0

class SurpriseCreate(BaseModel):
    recipient_name: str = Field(..., min_length=1, max_length=200)
    title: str = Field(..., min_length=1, max_length=500)
    creator_name: Optional[str] = Field(None, max_length=200)
    occasion: str = Field(..., min_length=1, max_length=100)
    occasion_icon: Optional[str] = Field(None, max_length=10)
    greeting: Optional[str] = None
    message: Optional[str] = None # Legacy support, or default first item
    items: List[SurpriseItemCreate] = [] # Multiple items
    unlock_at: datetime
    timezone: str = Field(default="UTC", max_length=100)
    theme: str = Field(default="elegant", max_length=50)
    box_style: str = Field(default="classic", max_length=50)


    @field_validator("unlock_at")
    @classmethod
    def validate_unlock_at(cls, v: datetime) -> datetime:
        # If naive datetime, assume UTC for now (model_validator will re-interpret with timezone)
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        return v

    def get_utc_unlock_at(self) -> datetime:
        """Convert unlock_at to UTC using the provided timezone field."""
        from dateutil import tz as dateutil_tz
        unlock = self.unlock_at

        # If the datetime is naive, interpret it in the given timezone
        if unlock.tzinfo is None or unlock.tzinfo == timezone.utc:
            user_tz = dateutil_tz.gettz(self.timezone)
            if user_tz and self.timezone != "UTC":
                # Re-interpret: the user meant this time in their timezone
                naive = unlock.replace(tzinfo=None)
                unlock = naive.replace(tzinfo=user_tz)

        # Convert to UTC and strip tzinfo for consistent DB storage
        utc_unlock = unlock.astimezone(timezone.utc).replace(tzinfo=None)

        # Validate: must be in the future
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        if utc_unlock <= now:
            raise ValueError("Unlock time must be in the future")

        return utc_unlock



# --- Response Schemas ---

class SurpriseCreatedResponse(BaseModel):
    public_token: str
    recipient_name: str
    title: str
    unlock_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}


class SurprisePublicResponse(BaseModel):
    """Public surprise info - NEVER includes the secret message."""
    public_token: str
    recipient_name: str
    title: str
    creator_name: Optional[str] = None
    occasion: str
    occasion_icon: Optional[str] = None
    greeting: Optional[str] = None
    unlock_at: datetime
    timezone: str
    theme: str
    box_style: str
    is_locked: bool
    server_time: datetime
    created_at: datetime

    model_config = {"from_attributes": True}


class SurpriseItemResponse(BaseModel):
    id: int
    type: str
    title: Optional[str] = None
    content: Optional[str] = None
    media_url: Optional[str] = None
    display_order: int
    
    model_config = {"from_attributes": True}


class SurpriseContentResponse(BaseModel):
    """Protected content - only returned when unlocked."""
    message: Optional[str] = None
    items: List[SurpriseItemResponse] = []


class DashboardSurpriseResponse(SurprisePublicResponse):
    """Surprise info for the dashboard."""
    id: int
    url: str = "" # To be populated by the router

    model_config = {"from_attributes": True}


class OccasionResponse(BaseModel):
    id: str
    name: str
    icon: str
    default_greeting: str


class ServerTimeResponse(BaseModel):
    server_time: datetime
