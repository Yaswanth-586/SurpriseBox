import os
import shutil
import uuid
from pathlib import Path
from typing import IO, Optional
from app.core.config import settings

UPLOAD_DIR = Path("uploads")
# Ensure upload directory exists locally anyway
os.makedirs(UPLOAD_DIR, exist_ok=True)

class BaseStorageProvider:
    def save_file(self, file: IO, filename: str, content_type: str) -> str:
        raise NotImplementedError

    def get_file_response(self, media_id: str):
        raise NotImplementedError


class LocalStorageProvider(BaseStorageProvider):
    def save_file(self, file: IO, filename: str, content_type: str) -> str:
        ext = filename.split(".")[-1] if "." in filename else "bin"
        unique_id = f"{uuid.uuid4().hex}.{ext}"
        file_path = UPLOAD_DIR / unique_id
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file, buffer)
        return unique_id

    def get_file_response(self, media_id: str):
        from fastapi.responses import FileResponse
        secure_name = os.path.basename(media_id)
        path = UPLOAD_DIR / secure_name
        if not path.exists():
            raise FileNotFoundError(f"Media {media_id} not found")
        return FileResponse(path)


class SupabaseStorageProvider(BaseStorageProvider):
    def __init__(self):
        from supabase import create_client, Client
        self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        self.bucket = settings.SUPABASE_STORAGE_BUCKET

    def save_file(self, file: IO, filename: str, content_type: str) -> str:
        ext = filename.split(".")[-1] if "." in filename else "bin"
        unique_id = f"{uuid.uuid4().hex}.{ext}"
        
        file_bytes = file.read()
        self.supabase.storage.from_(self.bucket).upload(
            unique_id, 
            file_bytes, 
            file_options={"content-type": content_type}
        )
        return unique_id

    def get_file_response(self, media_id: str):
        from fastapi.responses import RedirectResponse
        # Generate a signed URL valid for 60 seconds
        res = self.supabase.storage.from_(self.bucket).create_signed_url(media_id, 60)
        if "signedURL" in res:
            return RedirectResponse(res["signedURL"])
        raise FileNotFoundError(f"Media {media_id} not found in Supabase")

# Factory
if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    storage = SupabaseStorageProvider()
else:
    storage = LocalStorageProvider()
