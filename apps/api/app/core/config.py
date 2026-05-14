import os

from pydantic import BaseModel


class Settings(BaseModel):
    service_name: str = "api"
    dev_mode: bool = os.getenv("DEV_MODE", "true").lower() == "true"
    database_url: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./aetheris_dev.db",
    )
    jwt_secret: str = os.getenv("JWT_SECRET", "dev-secret")
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://aetheris-api-prod.eba-3ijumbws.ap-south-1.elasticbeanstalk.com",
        "https://ic1101.vercel.app",
        "http://ic1101.vercel.app",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ]


settings = Settings()
