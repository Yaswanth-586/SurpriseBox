from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app.api.surprises import router as surprises_router
from app.api.media import router as media_router
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.models import Surprise, SurpriseItem, User  # noqa: F401 - needed for table creation


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routes
    app.include_router(surprises_router, prefix=settings.API_V1_STR)
    app.include_router(media_router, prefix=f"{settings.API_V1_STR}/media")
    app.include_router(auth_router)
    app.include_router(dashboard_router)

    @app.on_event("startup")
    def on_startup():
        # Create tables
        Base.metadata.create_all(bind=engine)
        # Seed demo data
        from app.seed import create_demo_data
        db = SessionLocal()
        try:
            create_demo_data(db)
        finally:
            db.close()

    @app.get("/")
    def root():
        return {"message": "SurpriseBox API", "version": settings.VERSION}

    @app.get("/health")
    def health_check():
        return {"status": "ok"}

    return app


app = create_app()
