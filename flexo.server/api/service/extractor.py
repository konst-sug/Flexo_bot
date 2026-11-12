import patoolib
import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from glob import glob

from pathlib import Path
from os import path, walk, remove

EXTENSION_PATTERNS = {
    'zip': '*.[zZ][iI][pP]',
    'rar': '*.[rR][aA][rR]',
    '7z':  '*.[7][zZ]',
    'tar': '*.[tT][aA][rR]',
    'gz':  '*.[gG][zZ]',
    'gzip': '*.[gG][zZ][iI][pP]',
    'xz':  '*.[xX][zZ]'
}

class ArchiveExtractor:

    _logger = logging.getLogger(__name__)
    _executor: ThreadPoolExecutor | None = None

    def __init__(self, outdir: str = None):
        self.outdir = outdir or "docs"

    def extract(self, archive_path: str, password: str = None) -> str:
        """Распаковывает архив в outdir. Возвращает путь к выходной папке."""
        Path(self.outdir).mkdir(exist_ok=True)
        try:
            opts = {"password": password} if password else {}
            output = Path(archive_path).parent
            patoolib.extract_archive(archive_path, outdir=self.outdir, verbosity=0, **opts)
            # print(f"Архив '{archive_path}' распакован в '{archive_path}'")
            return self.outdir
        except Exception as error:
            raise Exception(f"Ошибка распаковки: {error}")
        

    def _get_executor(self) -> ThreadPoolExecutor:
        if self._executor is None:
            self._executor = ThreadPoolExecutor(max_workers=5)
        return self._executor


    async def shutdown_executor(self) -> None:
        """Вызывать при остановке приложения (в lifespan)."""
        if self._executor is not None:
            self._executor.shutdown(wait=False)
            self._executor = None


    def extract_safe(self, arch: str) -> None:
        try:
            self.extract(arch)
        except Exception:
            self._logger.exception("Ошибка распаковки архива %s", arch)


    async def universal_extract_docs(self, folders: list[str]) -> list[str]:
        loop = asyncio.get_running_loop()  # корректно внутри работающего loop
        executor = self._get_executor()
        extractor = ArchiveExtractor()

        all_tasks = []
        seen_archives: set[str] = set()

        for fold in folders:
            for pattern in EXTENSION_PATTERNS.values():
                for arch in glob(path.join(fold, pattern)):
                    if arch not in seen_archives:
                        seen_archives.add(arch)
                        all_tasks.append(
                            loop.run_in_executor(executor, self.extract_safe, extractor, arch)
                        )

        self._logger.info("Уникальных архивов: %d", len(all_tasks))
        await asyncio.gather(*all_tasks)
        return folders
