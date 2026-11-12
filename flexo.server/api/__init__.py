from .config import app_config, WORK_DIR, TEMP_DIR
from .database import db
from .service import QueryProcessor, ArchiveExtractor
from .models import QueryResult

shutdown = ArchiveExtractor(WORK_DIR).shutdown_executor

