from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.storage import storage
from app.services.surprise_service import get_surprise_by_token, is_surprise_locked
from pydantic import BaseModel

router = APIRouter()

class UploadResponse(BaseModel):
    media_url: str

@router.post("/upload", response_model=UploadResponse, status_code=201)
async def upload_media(file: UploadFile = File(...)):
    """
    Upload a media file (photo, video, audio).
    Returns a unique identifier to be used in SurpriseItemCreate.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")
    
    # MIME validation
    allowed_types = ["image/jpeg", "image/png", "image/gif", "video/mp4", "audio/mpeg", "audio/wav"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type")
        
    # File size validation (limit to 10MB in memory check if possible, or trust fastapi limits)
    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Reset file pointer for the storage provider to read
    import io
    file.file = io.BytesIO(file_bytes)
        
    media_id = storage.save_file(file.file, file.filename, file.content_type)
    # The URL will be served via the secure GET endpoint below
    media_url = f"/api/media/{media_id}"
    
    return UploadResponse(media_url=media_url)


@router.get("/{media_id}")
async def get_media(media_id: str, token: str = Query(...), db: Session = Depends(get_db)):
    """
    Securely serve a media file. 
    It requires the public_token of the surprise it belongs to, and will only serve it if unlocked.
    """
    surprise = get_surprise_by_token(db, token)
    
    # SECURITY: Do not serve media if the surprise is still locked!
    if is_surprise_locked(surprise):
        raise HTTPException(status_code=403, detail="Surprise is still locked. Media is protected.")
        
    # Check if the requested media belongs to this surprise
    # This prevents someone with a valid unlocked token from accessing other people's media
    valid_media = False
    for item in surprise.items:
        if item.media_url and media_id in item.media_url:
            valid_media = True
            break
            
    if not valid_media:
        raise HTTPException(status_code=403, detail="Media does not belong to this surprise")
        
    try:
        return storage.get_file_response(media_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Media not found")
