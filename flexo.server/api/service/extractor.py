import patoolib

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
    def __init__(self, outdir: str = None):
        self.outdir = outdir or "docs"

    def extract(self, archive_path: str, password: str = None) -> str:
        """Распаковывает архив в outdir. Возвращает путь к выходной папке."""
        Path(self.outdir).mkdir(exist_ok=True)
        try:
            opts = {"password": password} if password else {}
            output = Path(archive_path).parent
            patoolib.extract_archive(archive_path, outdir=output, verbosity=0, **opts)
            # print(f"Архив '{archive_path}' распакован в '{archive_path}'")
            return self.outdir
        except Exception as error:
            raise Exception(f"Ошибка распаковки: {error}")