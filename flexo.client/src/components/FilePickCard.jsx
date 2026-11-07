import { useRef } from 'react';

export default function FilePickCard({ title, file, onSelect, onClear, onSubmit, accept }) {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current?.click();   // открывает системный диалог выбора файла
  }

  function handleChange(e) {
    const picked = e.target.files[0];
    if (picked) onSelect(picked);
    e.target.value = '';         // сброс: повторный выбор того же файла тоже сработает
  }

  return (
    <section className="card">
      <h2>{title}</h2>

      <input
        ref={inputRef}
        type="file"
        accept={accept}          // например "audio/wav,.wav" или ".pdf,.docx"
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      {file ? (
        <p className="hint">
          Выбран: {file.name} ({Math.round(file.size / 1024)} КБ)
        </p>
      ) : (
        <p className="hint">Файл не выбран</p>
      )}

      <div className="card-actions">
        <button type="button" onClick={handleClick}>
          {file ? 'Заменить файл' : 'Выбрать файл'}
        </button>

        {file && onClear && (
          <button type="button" onClick={onClear}>Сбросить</button>
        )}

        {file && onSubmit && (
          <button type="button" onClick={() => onSubmit(file)}>Обработать</button>
        )}
      </div>
    </section>
  );
}
