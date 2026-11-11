from .config_api import app_config, load_dotenv
from .logging_config import LOGGING_CONFIG, Path

load_dotenv()

import logging.config
logging.config.dictConfig(LOGGING_CONFIG)

BASE_PROMPT = ''