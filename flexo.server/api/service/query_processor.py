#query_processor.py
import httpx 
import logging
from typing import Optional
from ..config import BASE_PROMPT
from ..models import QueryResult
from .extractor import EXTENSION_PATTERNS, ArchiveExtractor


class QueryProcessor:

    _logger = logging.getLogger(__name__)

    def __init__(self, llm_client, llm_token, llm_folder):
        self._llm = llm_client
        self.token = llm_token
        self.folder = llm_folder
        self.multi_text = None
    

    async def route_by_content_type(self, query_content):
        try:
            if query_content.content is not None:
                return await self.call_yandex_model(query_content.content)
            if query_content.prompt is not None:
                prompt = query_content.prompt
            else:
                prompt = BASE_PROMPT

            if query_content.file is not None:
                file_obj = query_content.file
                file_bytes = await file_obj.read()
                file_name = file_obj.filename,
                file_type = file_obj.content_type,
                file_size = len(file_bytes)
                if file_name in EXTENSION_PATTERNS:
                    self.multi_text = await self._extract_file(file_obj)
                else:
                    self.multi_text = await self._append_files(file_obj)
                return await self.call_yandex_model(self.multi_text)
        except Exception as error:
            self._logger.error("Обработка запроса не удалась: %s", error)
            return QueryResult(
            text="Извините, не удалось обработать запрос. Попробуйте позже.",
            error=str(error),
        )


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


    async def call_yandex_model(self, prompt: str):
        url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
        headers = {
            "Authorization": f"Api-Key {self.token}",
            "Content-Type": "application/json",
        }
        data = {
            "modelUri": f"gpt://{self.folder}/{self._llm}/latest",
            "completionOptions": {"stream": False, "temperature": 0.5, "maxTokens": "2000"},
            "messages": [{"role": "user", "text": prompt}],
        }
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=data, timeout=30.0)
                response.raise_for_status()
                result = response.json()

                alternatives = result.get("result", {}).get("alternatives", [])
                if alternatives:
                    return alternatives[0].get("message", {}).get("text", "")
                return ""

        except httpx.TimeoutException:
            self._logger.error("YandexGPT: timeout при запросе (prompt: %.100s...)", prompt)
            raise
        except httpx.HTTPStatusError as e:
            self._logger.error(
                "YandexGPT: HTTP %s от API. Ответ: %s",
                e.response.status_code,
                e.response.text,
            )
            raise
        except httpx.RequestError as e:
            self._logger.error("YandexGPT: ошибка сети — %s", e)
            raise

    async def _extract_file(self, file_obj):
        pass

    async def _append_files(self, file_obj):
        pass

    
