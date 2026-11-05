import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function DashboardPage() {
  const navigate = useNavigate();
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

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const filtered = items.filter((it) =>
    it.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page">
      <header className="topbar panel-shadow">
        <h1>Панель управления</h1>
        <button onClick={logout}>Выйти</button>
      </header>

      <div className="panels">
        {/* Панель 1: создание элемента */}
        <section className="card">
          <h2>Новый элемент</h2>
          <form onSubmit={handleCreate}>
            <label>
              Название
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например, отчёт за ноябрь"
              />
            </label>
            <button type="submit" disabled={creating}>
              {creating ? 'Сохраняем…' : 'Добавить'}
            </button>
            {createMsg && <p className="hint">{createMsg}</p>}
          </form>
        </section>

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
      </div>
    </div>
  );
}
