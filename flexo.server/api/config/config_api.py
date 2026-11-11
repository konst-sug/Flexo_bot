# config.py
import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class DatabaseConfig:
    host: str = "127.0.0.1"
    port: int = 5432
    database: str = ""
    login: str = ""
    password: str = ""

@dataclass(frozen=True)
class RedisConfig:
    host: str = ""
    port: int = 6379

@dataclass(frozen=True)
class AccessToken:
    api_token: str | None = None
    chat: str = ""

@dataclass(frozen=True)
class ProcessConfig:
    notifier: str | None = None
    live_job: str = ""

@dataclass(frozen=True)
class AppConfig:
    WEBHOOK_TOKEN: str = os.getenv("WEBHOOK_TOKEN", "")
    
    pg: DatabaseConfig = DatabaseConfig(
        host=os.getenv("PG_HOST", "127.0.0.1"),
        port=int(os.getenv("PG_PORT", 5432)),
        database=os.getenv("PG_BASE", ""),
        login=os.getenv("PG_LOGIN", ""),
        password=os.getenv("PG_PASS", "")
    )
    
    redis: RedisConfig = RedisConfig(
        host=os.getenv("REDIS_HOST", ""),
        port=int(os.getenv("REDIS_PORT", 6379))
    )
    
    llm: AccessToken = AccessToken(
        api_token=os.getenv("API_TOKEN", None),
        chat=os.getenv("CHAT", "")
    )

    process: ProcessConfig = ProcessConfig(
        notifier=os.getenv("NOTIFIER", "console"),
        live_job=os.getenv("dict_times")
    )

app_config = AppConfig()