#query_processor.py
from typing import Optional
from models import QueryResult


class QueryProcessor:

    def __init__(self, llm_client):
        self._llm = llm_client
    
    async def process_query(
        self,
        content: str,
        prompt: Optional[str] = None,
        file_name: Optional[str] = None,
        file_type: Optional[str] = None,
        file_bytes: Optional[bytes] = None,
    ) -> QueryResult:
        # временный мок — потом здесь будет pipeline
        return QueryResult(
            text=file_name,
            content_received=content,
            prompt_received=prompt,
            file_name=file_name,
            file_type=file_type,
            file_size=len(file_bytes) if file_bytes is not None else None,
        )


