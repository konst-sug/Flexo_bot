from typing import Optional
from pydantic import BaseModel


class QueryResult(BaseModel):
    text: Optional[str] = None
    content_received: Optional[str] = None
    prompt_received: Optional[str] = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None
