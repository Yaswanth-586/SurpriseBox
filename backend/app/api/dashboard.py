from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database import get_db
from app.models import Surprise, User
from app.schemas import DashboardSurpriseResponse
from app.api.deps import get_current_user
from app.services.surprise_service import is_surprise_locked

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/surprises", response_model=List[DashboardSurpriseResponse])
def get_my_surprises(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    surprises = db.query(Surprise).filter(Surprise.user_id == current_user.id).order_by(Surprise.created_at.desc()).all()
    
    results = []
    now = datetime.now(timezone.utc)
    for s in surprises:
        locked = is_surprise_locked(s)
        unlock_at = s.unlock_at
        if unlock_at and unlock_at.tzinfo is None:
            unlock_at = unlock_at.replace(tzinfo=timezone.utc)
        created_at = s.created_at
        if created_at and created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        response_data = DashboardSurpriseResponse(
            id=s.id,
            public_token=s.public_token,
            recipient_name=s.recipient_name,
            title=s.title,
            creator_name=s.creator_name,
            occasion=s.occasion,
            occasion_icon=s.occasion_icon,
            greeting=s.greeting,
            unlock_at=unlock_at,
            timezone=s.timezone,
            theme=s.theme,
            box_style=s.box_style,
            is_locked=locked,
            server_time=now,
            created_at=created_at,
            url=f"/s/{s.public_token}" # Give frontend an easy path
        )
        results.append(response_data)
        
    return results

@router.delete("/surprises/{surprise_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_surprise(surprise_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    surprise = db.query(Surprise).filter(Surprise.id == surprise_id, Surprise.user_id == current_user.id).first()
    if not surprise:
        raise HTTPException(status_code=404, detail="Surprise not found")
    
    db.delete(surprise)
    db.commit()
    return None
