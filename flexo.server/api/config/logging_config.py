import json
import logging
from pathlib import Path

Path("logs").mkdir(exist_ok=True)

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": self.formatTime(record, "%Y-%m-%dT%H:%M:%S.%fZ"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage()
        }
        return json.dumps(log_record, ensure_ascii=False)

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    
    'formatters': {
        'json': {
            '()': JsonFormatter
        },
        'console': { 'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s' },
    },
    
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/app.log',
            'maxBytes': 50 * 1024 * 1024,  # 50 МБ на файл
            'backupCount': 5,              # Хранить 5 старых файлов
            'encoding': 'utf-8',
            'formatter': 'json',
        },
        'console': {
            'level': 'INFO',  
            'class': 'logging.StreamHandler', 
            'formatter': 'console', 
            },
    },
    
        'loggers': {
        'api': {'level': 'INFO', 'propagate': True},
        'app': {'level': 'INFO', 'propagate': True},
        'security': {'level': 'INFO', 'propagate': True},
        'query_processor': {'level': 'INFO', 'propagate': True},

        # шумные сторонние библиотеки — заглушить до WARNING
        'httpx': {'level': 'INFO', 'propagate': True},
        'httpcore': {'level': 'WARNING', 'propagate': True},
        'urllib3': {'level': 'WARNING', 'propagate': True},
        'uvicorn.access': {'level': 'WARNING', 'propagate': False},
    },
    'root': {
        'level': 'INFO',
        'handlers': ['file', 'console']
    },

}