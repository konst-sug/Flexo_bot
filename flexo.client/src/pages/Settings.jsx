import { useState, useEffect } from 'react';
import { api } from '../api';
import TextareaCard from '../components/TextAreaCard';

export default function DashboardPage() {
  const [items, setItems] = useState([]);

  // форма 1: создание
  const [title, setTitle] = useState('');
  const [createMsg, setCreateMsg] = useState('');
  const [creating, setCreating] = useState(false);
  const [note, setNote] = useState('');

  const comment = '';
  const setComment = '';
  const code = 'Это код';
  const setCode = 'Код';
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

  return (
    <div className="panels">
      {/* Панель 2: поиск по списку */}
      <section className="card">
        <TextareaCard
          title="Комментарий"
          value={comment}
          onChange={setComment}
          placeholder="Напишите комментарий…"
          minRows={3}
          maxRows={10}
          className="full-width" // .full-width { width: 100%; }
        />
      </section>
      <section>
        <TextareaCard
        title="Заметка"
        value={note}
        onChange={setNote}
        placeholder="Введите текст…"
      />
      {/* <button onClick={handleCreate}>Выйти</button> */}
      </section>
      <section>
      
    <TextareaCard
        title="Код"
        value={code}
        onChange={setCode}
        rows={8}
        cols={60}
        style={{ fontFamily: 'monospace' }} // если нужно, передайте style отдельно или добавьте проп
      />
      </section>
    </div>
  );
}
