from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "InternetOS API"
    app_version: str = "0.1.0"
    debug: bool = True

    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
