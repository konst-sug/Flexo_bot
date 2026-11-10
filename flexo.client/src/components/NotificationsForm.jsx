// src/components/NotificationsForm.jsx
import { useState } from 'react';
import Toggle from './Toggle';
import Select from './Select';

const sampleNotifications = [
  { id: 1, title: 'Новый комментарий', type: 'comment', read: false },
  { id: 2, title: 'Обновление системы', type: 'system', read: true },
  { id: 3, title: 'Напоминание о встрече', type: 'reminder', read: false },
];

export default function NotificationsForm() {
  const [filter, setFilter] = useState('all');
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [folder, setFolder] = useState(false);

  const filtered =
    filter === 'all'
      ? sampleNotifications
      : sampleNotifications.filter((n) => n.type === filter);
  const handleChange = (e) => {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3>Место хранения файлов</h3>
      <div className='form-column'>
      <div>
        <Select
            label="Путь к хранилищу"
            name="repo"
            value={folder}                    // см. примечание ниже
            onChange={handleChange}
            style={{ padding: '8px' }}
            options={[
              { value: "ru", label: "Русский" },
              { value: "en", label: "English" },
            ]}
        />
        </div>

        
      </div>
      <h3>Хранилище Данных</h3>
      <div style={{ display: 'flex', gap: '36px' }}>
        <div className='form-min'>  
          <Toggle
            isActive={isAdvanced}
            onToggle={setIsAdvanced}
            label={isAdvanced ? 'PostgreSQL: on' : 'PostgreSQL: off'}
          /></div>
        <div className='form-min'> 
          <Toggle
            isActive={isActive}
            onToggle={setIsActive}
            label={isActive ? 'Redis: on' : 'Redis: off'}
          /></div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <li
              key={n.id}
              style={{
                padding: '12px',
                borderBottom: '1px solid #eee',
                backgroundColor: n.read ? '#f9f9f9' : '#fff',
                fontWeight: n.read ? 'normal' : 'bold',
              }}
            >
              <span>{n.title}</span>
            </li>
          ))
        ) : (
          <li>Нет уведомлений по выбранному фильтру</li>
        )}
      </ul>
      <span>Фильтр:</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '6px 8px' }}
        >
          <option value="all">Все</option>
          <option value="comment">Комментарии</option>
          <option value="system">Система</option>
          <option value="reminder">Напоминания</option>
        </select>
    </div>
  );
}
