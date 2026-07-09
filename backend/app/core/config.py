from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str
    DATABASE_URL: str
    api_version: str = "v1"
    debug: bool = True
    allowed_origins: str = "http://localhost:5173"
    global_rate_limit: str = "100/minute"
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

settings = Settings()