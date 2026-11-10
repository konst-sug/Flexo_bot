import { useState, useEffect } from 'react';
import { api } from '../api';
import FilePickCard from '../components/FilePickCard';
import TextareaCard from '../components/TextAreaCard';

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [note, setNote] = useState('');

  const comment = '';
  const setComment = '';
  const code = 'Это код';
  const setCode = 'Код';

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
        <h2>Xранилище</h2>
        <FilePickCard />
      </section>

      <section className='card'>
      <form onSubmit={handleCreate}>
        <TextareaCard
          title="Библиотека промптов"
          value={note}
          onChange={setNote}
          placeholder="Введите текст…"
          rows={8}
          cols={60}
          style={{ fontFamily: 'monospace' }} // если нужно, передайте style отдельно или добавьте проп
        />
        <button type="submit" disabled={creating}>
            {creating ? 'Сохраняем…' : 'Отправить'}
          </button>
      {createMsg && <p className="hint">{createMsg}</p>}
        </form>
            </section>
           
    </div>
    
  );
}
