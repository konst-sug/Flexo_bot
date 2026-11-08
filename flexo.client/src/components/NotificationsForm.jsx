// src/components/NotificationsForm.jsx
import { useState } from 'react';

const sampleNotifications = [
  { id: 1, title: 'Новый комментарий', type: 'comment', read: false },
  { id: 2, title: 'Обновление системы', type: 'system', read: true },
  { id: 3, title: 'Напоминание о встрече', type: 'reminder', read: false },
];

export default function NotificationsForm() {
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all'
      ? sampleNotifications
      : sampleNotifications.filter((n) => n.type === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
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
    </div>
  );
}
