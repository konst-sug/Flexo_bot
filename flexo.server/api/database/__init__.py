from config import app_config
from .database import AsyncPGDB

db = AsyncPGDB(*app_config.pg)