import os
import logging
import pytesseract
import pdfplumber

from docx import Document
from pdf2image import convert_from_path



# from langchain_core.documents import Document
# from langchain_community.document_loaders import PyPDFLoader, TextLoader

# ВАЖНО: Контекст GPT-3.5-turbo ограничен (обычно 16k токенов). 
# Если тендерная документация огромная, этот метод не сработает без урезания текста.
MAX_TOKENS_WARNING = 14000 

class TextProcessor:

    _logger = logging.getLogger(__name__)

    def __init__(self, outdir: str = None):
        self.folder_path = outdir or "docs"


    def extract_text_from_folder(self):
        """Собирает текст из всех файлов папки, сохраняя имена файлов как заголовки."""
        all_text_parts = []
        # Сортировка для предсказуемого порядка файлов
        for file in sorted(os.listdir(self.folder_path)):
            file_path = os.path.join(self.folder_path, file)
            try:
                text = ""
                if file_path.endswith(".pdf"):
                    pages = self.convert_to_list(file_path) 
                    # Собираем текст всех страниц
                    text = "\n".join([p.page_content for p in pages])
                
                elif file_path.endswith(".docx"): 
                    text = self.extract_text_from_docx(str(file_path)) 
                    if text: # Теперь это строка 
                        header = f"\n\n{'=' * 50}\nFILE: {file}\n{'=' * 50}\n\n" 
                        all_text_parts.append(header + text)
                    # text = "\n".join([d.page_content for d in docs])
                elif file_path.endswith('.doc'):
                    continue 
                elif file_path.endswith('.txt'):
                    text = get_txt_from_txt(file_path)
                else:
                    continue 

                # Разделитель между файлами. Имя файла будет служить "заглавием".
                separator = f"\n\n{'=' * 50}\nFILE: {file}\n{'=' * 50}\n\n"
                all_text_parts.append(separator + text)
            
            except Exception as error:
                self._logger.error("Failed for processing  %s: %s", file, error)
                continue  
            combined_documents = "\n".join(all_text_parts)
        return combined_documents



    def extract_text_from_docx(self, doc_path: str) -> str:
        """
        Принимает путь, возвращает ЕДИНУЮ строку текста.
        Если файл битый — возвращает пустую строку.
        """
        try:
            document = Document(doc_path)
        except Exception as error:
            # Ошибка Content_Types часто возникает при битой структуре XML
            if "Content_Types" in str(error) or "no content type" in str(error).lower():
                self._logger.error("⚠️ Пропуск поврежденного DOCX (битая структура): %s", doc_path)
            else:
                self._logger.error("Ошибка открытия DOCX %s: %s", doc_path, str(error))
            return "" # Возвращаем пустую СТРОКУ, а не список

        full_text_parts = []

        # --- Извлечение из таблиц ---
        try:
            if document.tables:
                tables_text = process_tables_in_docx(document, self._logger)
                
                # ПРОВЕРКА: если вернулась не строка, приводим к строке
                if tables_text:
                    if isinstance(tables_text, list):
                        # Если это список, склеиваем его элементы
                        tables_text = "\n".join(map(str, tables_text)) 
                    
                    full_text_parts.append(tables_text)
        except Exception as e:
            self._logger.error("Ошибка чтения таблиц в %s: %s", doc_path, e)

        # --- Извлечение из параграфов ---
        # --- Извлечение из параграфов ---
        paragraphs_success = True
        try:
            for paragraph in document.paragraphs:
                if paragraph.text.strip():
                    full_text_parts.append(paragraph.text)
        except Exception as e:
            self._logger.error("Ошибка чтения параграфов в %s: %s", doc_path, e)
            paragraphs_success = False

        # Собираем текст ТОЛЬКО если всё прошло успешно или если есть данные из таблиц
        # Но лучше не возвращать пустоту, если таблицы прочитались, а параграфы - нет.
        if not paragraphs_success and not full_text_parts:
            return "" # Возвращаем пустоту, только если не удалось прочитать ВООБЩЕ ничего

        # Объединяем всё в одну строку. 
        # Используем двойной перенос, чтобы сохранить структуру между таблицами и текстом.
        full_text = "\n\n".join(full_text_parts)
        
        return full_text.strip()

     # Ваша функция convert_to_list теперь становится просто оболочкой
    def convert_to_list(self, file_path, result_dir=None):
        sentences_list = self._load_pdf_with_ocr(file_path)
        
        # if len(sentences_list):
        #     # Логика сохранения в файл (ваша старая запись)
        #     folder, filename = read_env_from_path(file_path)
        #     path_for_record = f'{folder}/{filename}.txt'
        #     with open(path_for_record, "w", encoding="utf-8") as file:
        #         for item in sentences_list:
        #             file.write(item + "\n") # Исправьте \\n на \n       
        return sentences_list

    def _load_pdf_with_ocr(self, file_path):
        """
        Пытается прочитать текстовый слой. Если его нет — делает OCR.
        Возвращает список предложений.
        """
        sentences_list = []
        
        # Попытка 1: Обычное чтение (быстрое)
        with pdfplumber.open(file_path) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        if text.strip():
            self._logger.info("Текст извлечен напрямую: %s", file_path)
            # Ваша функция разбиения на предложения
            #sentences_list = _split_into_sentences(text)
            sentences_list = []
            return sentences_list

        # Попытка 2: Если текста нет — это скан. Делаем OCR (медленно).
        self._logger.warning("Текстовый слой не найден. Запуск OCR для: %s", file_path)
        try:
            # Конвертируем PDF в список картинок (PIL Images)
            pages = convert_from_path(file_path, dpi=300) 
            
            ocr_text = ""
            for page_image in pages:
                # Важно указать язык, иначе русский текст будет "кракозябрами"
                ocr_text += pytesseract.image_to_string(page_image, lang='rus') + "\n"
                
            if ocr_text.strip():
                #sentences_list = _split_into_sentences(ocr_text)
                sentences_list = []
                return sentences_list
            else:
                self._logger.error("OCR отработал, но текст пустой: %s", file_path)
                return []
                
        except Exception as e:
            self._logger.error("Ошибка OCR (возможно, не установлен poppler): %s", e)
            return []


def process_tables_in_docx(doc, logger):
    """Получение текстов из таблиц в docx"""
    tables_data = []
    for table in doc.tables:
        try:
            rows = [[cell.text for cell in row.cells] for row in table.rows]
            tables_data.append(rows)
            result = flatten_list(tables_data)
        except Exception as error:
            logger.error("Возникла ошибка: %s", error)
            result = []
    return result


def flatten_list(nested_list):
    """Преобразование вложенных списков в один список"""
    flat_list = []
    for item in nested_list:
        if isinstance(item, list):
            flat_list.extend(flatten_list(item))
        else:
            flat_list.append(item)
    return flat_list


def get_txt_from_txt(filepath):
    """Извлечение текста из txt"""
    restored_list = []
    with open(filepath, "r", encoding="utf-8") as file:
        restored_list = [line.strip() for line in file.readlines()]
    return '\n'.join(restored_list)
   