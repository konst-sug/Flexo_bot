from ..config import app_config
from .database import AsyncPGDB

db = AsyncPGDB(app_config.pg.host, app_config.pg.port, app_config.pg.database,
               app_config.pg.login, app_config.pg.password)