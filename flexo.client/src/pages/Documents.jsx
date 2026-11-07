import { useState, useEffect } from 'react';
import { api } from '../api';
import FilePickCard from '../components/FilePickCard';

export default function DashboardPage() {
  const [items, setItems] = useState([]);

  // форма 1: создание
  const [title, setTitle] = useState('');
  const [createMsg, setCreateMsg] = useState('');
  const [creating, setCreating] = useState(false);

  // форма 2: поиск
  const [query, setQuery] = useState('');

  async function loadItems() {
    try {
      const data = await api.getItems();
      setItems(data);
    } catch {
      // при ошибке сети список просто останется пустым
    }
  }

  useEffect(() => { loadItems(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) {
      setCreateMsg('Введите название');
      return;
    }
    setCreating(true);
    try {
      await api.createItem({ title });
      setTitle('');
      setCreateMsg('Сохранено ✓');
      loadItems();
    } catch (err) {
      setCreateMsg(err.message);
    } finally {
      setCreating(false);
    }
  }

  const filtered = items.filter((it) =>
    it.title?.toLowerCase().includes(query.toLowerCase())
  );
  const [file, setFile] = useState(null);

async function handleFile(picked) {
  const formData = new FormData();
  formData.append('file', picked);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Ошибка загрузки файла');
    console.log('файл отправлен:', picked.name);
  } catch (err) {
    console.error(err);
  }
}

  return (
    <div className="panels">
      {/* Панель 2: поиск по списку */}
      <section className="card">
        <h2>Поиск</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Запрос
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Введите часть названия"
            />
          </label>
        </form>
        <ul className="list">
          {filtered.length === 0 && <li>Ничего не найдено</li>}
          {filtered.map((it) => (
            <li key={it.id ?? it.title}>{it.title}</li>
          ))}
        </ul>
      </section>
      <section className="card">
        <FilePickCard
        title="Файл"
        file={file}
        onSelect={setFile}
        onClear={() => setFile(null)}
        onSubmit={handleFile}
        accept="audio/wav,.wav"
      />
      </section>
    </div>
    
  );
}
