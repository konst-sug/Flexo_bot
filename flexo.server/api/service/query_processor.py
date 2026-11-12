#query_processor.py
import httpx 
import logging
import shutil
import tiktoken

from fastapi import UploadFile
from typing import Optional
#from langchain_core.messages import HumanMessage, SystemMessage
from ..config import BASE_PROMPT, WORK_DIR, TEMP_DIR, user_prompt, strong, free_prompt
from ..models import QueryResult
from .extractor import EXTENSION_PATTERNS, ArchiveExtractor, Path
from .text_processor import TextProcessor


class QueryProcessor:

    _logger = logging.getLogger(__name__)

    def __init__(self, llm_client, llm_token, llm_folder):
        self._llm = llm_client
        self.token = llm_token
        self.folder = llm_folder
        self.multi_text = []
        self.extractor = ArchiveExtractor(WORK_DIR)

    async def route_by_content_type(self, query_content):
        result = []
        try:
            if query_content.prompt is not None:
                prompt = query_content.prompt
            else:
                prompt = f"{free_prompt}\n"
            self.multi_text.append(prompt)

            if query_content.content is not None:
                self.multi_text.append(query_content.content)
            if query_content.file is not None:
                file_obj = query_content.file
                file_bytes = await file_obj.read()
                file_name = file_obj.filename
                file_type = file_obj.content_type
                file_size = len(file_bytes)
                path_obj = Path(file_name)
                
                file_extension = path_obj.suffix.lstrip('.')
                if file_extension in EXTENSION_PATTERNS.keys():
                    await self._extract_files(file_obj)
                
                files = await self._append_files()
                self.multi_text.append(files)
            prompt = "\n".join(self.multi_text)
           
            result = await self.call_yandex_model(prompt)
            return result

        except Exception as error:
            self._logger.error("Failed to create request: %s", error)
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
            "completionOptions": {"stream": False, "temperature": 0.5, "maxTokens": "2800"},
            "messages": [{"role": "user", "text": prompt}],
        }
        custom_timeout = httpx.Timeout( 300.0, # Общий таймаут (read + connect). Читаем ответ до 5 минут. 
                                       connect=10.0 # Время на установку соединения с сервером Яндекса. 
                                       )
        
        text_length = count_tokens(prompt) 
        if text_length > 65000: 
            return f"Текст слишком большой: {text_length} токенов"
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=data, timeout=custom_timeout)
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


    async def _extract_files(self, file_obj):
        try:
            file_path = await self.save_upload_file_project(file_obj)
            self.extractor.extract_safe(file_path)

        except Exception as error:
            self._logger.error("Failed to extract file content: %s", error)


    async def _append_files(self):
        files = ''
        processor = TextProcessor(WORK_DIR)
        try:
            files = processor.extract_text_from_folder()
        except Exception as error:
            self._logger.error("Failed to create file content: %s", error)  
        messages = [ 
            "Ты работаешь строго с предоставленным текстом. Не придумывай факты, если данных не хватает.",
            f"\n---\nНАЧАЛО ДОКУМЕНТАЦИИ:\n{files}\n\nКОНЕЦ ДОКУМЕНТАЦИИ."]
        return "\n".join(messages)


    async def save_upload_file_project(self, file: UploadFile) -> Path:
        """
        Сохраняет файл в папку temp_uploads внутри проекта.
        Возвращает путь к сохраненному файлу.
        """
        # Генерируем уникальное имя, чтобы файлы не перезаписывали друг друга
        # Используем uuid и сохраняем исходное расширение
        import uuid
        extension = Path(file.filename).suffix
        unique_name = f"{uuid.uuid4().hex}{extension}"
        
        file_path = TEMP_DIR / unique_name
        TEMP_DIR.mkdir(exist_ok=True, parents=True)
        
        try:
            await file.seek(0)
            with open(file_path, "wb") as buffer:
                # shutil.copyfileobj работает быстрее, чем чтение кусками в цикле
                shutil.copyfileobj(file.file, buffer)
            return file_path
        finally:
            await file.close()    


def serialize_messages(messages):
    """Преобразует список SystemMessage/HumanMessage в JSON-совместимый список."""
    serialized = []
    for msg in messages:
        # Проверяем тип сообщения и берем только данные
        if hasattr(msg, 'content'):
            serialized.append({
                "role": msg.type,  # "system", "human", "ai"
                "content": msg.content
            })
    return serialized


def count_tokens(text: str, model: str = "yandexgpt-lite") -> int:
    # Для YandexGPT используется тот же encoder, что и для GPT-3.5
    enc = tiktoken.get_encoding("cl100k_base") 
    return len(enc.encode(text))

