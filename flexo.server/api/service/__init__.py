import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from glob import glob

from .extractor import ArchiveExtractor, path
from .query_processor import QueryProcessor


logger = logging.getLogger(__name__)

EXTENSION_PATTERNS = {
    'zip': '*.[zZ][iI][pP]',
    'rar': '*.[rR][aA][rR]',
    '7z':  '*.[7][zZ]',
    'tar': '*.[tT][aA][rR]',
    'gz':  '*.[gG][zZ]',
    'gzip': '*.[gG][zZ][iI][pP]',
    'xz':  '*.[xX][zZ]'
}

# Executor живёт на уровне модуля и создаётся один раз,
# а не при каждом запросе
_executor: ThreadPoolExecutor | None = None


def _get_executor() -> ThreadPoolExecutor:
    global _executor
    if _executor is None:
        _executor = ThreadPoolExecutor(max_workers=5)
    return _executor


async def shutdown_executor() -> None:
    """Вызывать при остановке приложения (в lifespan)."""
    global _executor
    if _executor is not None:
        _executor.shutdown(wait=False)
        _executor = None


def _extract_safe(extractor: ArchiveExtractor, arch: str) -> None:
    try:
        extractor.extract(arch)
    except Exception:
        logger.exception("Ошибка распаковки архива %s", arch)


async def universal_extract_docs(folders: list[str]) -> list[str]:
    loop = asyncio.get_running_loop()  # корректно внутри работающего loop
    executor = _get_executor()
    extractor = ArchiveExtractor()

    all_tasks = []
    seen_archives: set[str] = set()

    for fold in folders:
        for pattern in EXTENSION_PATTERNS.values():
            for arch in glob(path.join(fold, pattern)):
                if arch not in seen_archives:
                    seen_archives.add(arch)
                    all_tasks.append(
                        loop.run_in_executor(executor, _extract_safe, extractor, arch)
                    )

    logger.info("Уникальных архивов: %d", len(all_tasks))
    await asyncio.gather(*all_tasks)
    return folders
