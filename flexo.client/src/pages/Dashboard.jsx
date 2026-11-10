import { useState, useEffect } from 'react';
import { api } from '../api';
import AnswerCard from '../components/AnswerCard';
import IconButton from '../components/IconButton';
import Select from '../components/Select';
import TextareaCard from '../components/TextAreaCard';
import FilePickCard from '../components/FilePickCard';
import RequestIcon from '../assets/icons/mdi-icons/mdi--pencil-outline.svg'
import MultiTextIcon from '../assets/icons/mdi-icons/mdi--text-box-edit-outline.svg'
import PromptPlusIcon from '../assets/icons/mdi-icons/mdi--view-dashboard-edit-outline.svg'

export default function DashboardPage() {
  const [items, setItems] = useState([]);

  // форма 1: создание
  const [title, setTitle] = useState('');
  const [createMsg, setCreateMsg] = useState('');
  const [creating, setCreating] = useState(false);

  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('question'); // 'question' | 'multitext' | 'prompt'

  // после успешного ответа от pipeline:
  const selectedPrompt = '';
  const promptOptions = [];
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
      {/* Панель 1: создание элемента */}
      <section className="card">
      <h2>Поиск</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Поиск в хранилище
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Введите часть названия"
            />
          </label>
          <button type="submit" disabled={creating}>
            {creating ? 'Поиск…' : 'Искать'}
          </button>
        </form>
        <ul className="list">
          {filtered.length === 0 && <li>Ничего не найдено</li>}
          {filtered.map((it) => (
            <li key={it.id ?? it.title}>{it.title}</li>
          ))}
        </ul>

        {/* --- ИЗМЕНЕНО: заголовок с тремя иконками справа --- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Новый запрос</h2>
        <div style={{ display: 'flex', gap: '4px' }}>
          <IconButton
            icon={<img src={RequestIcon}/>}
            onClick={() => setMode('question')}
            title="Вопрос"
            className={mode === 'question' ? 'active' : ''}
          />
          <IconButton
            icon={<img src={MultiTextIcon}/>}
            onClick={() => setMode('multitext')}
            title="Мультитекст"
            className={mode === 'multitext' ? 'active' : ''}
          />
          <IconButton
            icon={<img src={PromptPlusIcon}/>}
            onClick={() => setMode('prompt')}
            title="Промпт +"
            className={mode === 'prompt' ? 'active' : ''}
          />
        </div>
      </div>
       
      {/* --- ИЗМЕНЕНО: показываем только активный блок --- */}
      {mode === 'question' && (
        <form onSubmit={handleCreate}>
          <label>
            Введите запрос
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например, напиши функцию на Elixir"
            />
          </label>
        </form>
      )}

      {mode === 'multitext' && (
        <TextareaCard
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      )}

      {mode === 'prompt' && (
        <div>
          <Select
            label="Промпт"
            name="prompt"
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            options={promptOptions} // массив [{ value, label }]
          />
          <FilePickCard />
        </div>
      )}
      <button type="submit" disabled={creating}>
            {creating ? 'Сохраняем…' : 'Отправить'}
          </button>
      {createMsg && <p className="hint">{createMsg}</p>}
    </section>

      {/* Панель 2: результат*/}
      <section className="card">
        <AnswerCard text={answer} isLoading={isLoading} />
      </section>
    </div>
  );
}
