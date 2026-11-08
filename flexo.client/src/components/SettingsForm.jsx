// src/components/SettingsForm.jsx
import { useState } from 'react';
import Select from './Select';
import IconButton from './IconButton';
import SandTheme from '../assets/icons/sand.png';

export default function SettingsForm() {
  const [settings, setSettings] = useState({
    notifications: true,
    theme: 'light',
    language: 'ru',
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={{ fontWeight: 'bold' }}>Тема интерфейса</label>
        <select
          name="theme"
          value={settings.theme}
          onChange={handleChange}
          style={{ padding: '8px' }}
        >
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
        </select>
      </div>

      <div>
      <Select
          label="Хранилище"
          name="repo"
          value={settings.repo}                    // см. примечание ниже
          onChange={handleChange}
          style={{ padding: '8px' }}
          options={[
            { value: "ru", label: "Русский" },
            { value: "en", label: "English" },
          ]}
      />
      </div>
      
      <label style={{ fontWeight: 'bold' }}>Тема интерфейса</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <IconButton icon={<img src={SandTheme}/>} onClick={handleChange} title="Редактировать" />
        <IconButton icon="📄" onClick={handleChange} title="Копировать" />
        <IconButton icon="🗑️" onClick={handleChange} title="Удалить" />
        <IconButton icon="▶️" onClick={handleChange} title="Запустить" />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          name="notifications"
          checked={settings.notifications}
          onChange={handleChange}
        />
        Получать уведомления
      </label>

      <button
        type="button"
        style={{ padding: '10px 16px', background: '#28a745', color: '#fff' }}
      >
        Применить настройки
      </button>
    </div>
  );
}
