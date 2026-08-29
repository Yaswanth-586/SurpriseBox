from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "SurpriseBox API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    DATABASE_URL: str = "sqlite:///./surprisebox.db"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Supabase Storage
    SUPABASE_URL: str | None = None
    SUPABASE_KEY: str | None = None
    SUPABASE_STORAGE_BUCKET: str = "surprises"

    # CORS
    @property
    def cors_origins(self) -> List[str]:
        origins = ["http://localhost:5173"]
        if self.FRONTEND_URL and self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
        return origins

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
