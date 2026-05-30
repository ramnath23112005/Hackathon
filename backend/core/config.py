import json

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "InternetOS API"
    app_version: str = "0.3.0"
    debug: bool = True

    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    wire_api_key: str = ""
    wire_base_url: str = "https://api.anakin.io/v1"
    wire_timeout: int = 60

    wire_action_x: str = ""
    wire_action_reddit: str = ""
    wire_action_news: str = ""
    wire_action_web: str = ""

    llm_enabled: bool = True
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    openai_temperature: float = 0.3
    openai_timeout: int = 30
    openai_max_retries: int = 2

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v

    class Config:
        env_file = ".env"


settings = Settings()
