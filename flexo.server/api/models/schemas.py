from typing import Optional, Any
from pydantic import BaseModel


class QueryResult(BaseModel):
    text: Optional[str] = None
    content_received: Optional[str] = None
    prompt_received: Optional[str] = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None


class QueryInput(BaseModel):
    content: Optional[str] = None
    prompt: Optional[str] = None
    file: Optional[Any] = None
