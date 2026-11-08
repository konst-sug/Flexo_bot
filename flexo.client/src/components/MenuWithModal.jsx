// MenuWithModal.jsx
import { useState } from 'react';
import SideModal from './SideModal';

// Каждому пункту — свой компонент и заголовок.
// Компоненты импортируете из своих файлов.
import ProfileForm from './ProfileForm';
import SettingsForm from './SettingsForm';
import NotificationsForm from './NotificationsForm';

const MENU_ITEMS = [
  { id: 'profile', label: 'Профиль', component: <ProfileForm /> },
  { id: 'settings', label: 'Общие настройки', component: <SettingsForm /> },
  { id: 'appSettings', label: 'Настройки приложения', component: <NotificationsForm /> },
];

export default function MenuWithModal() {
  const [activeId, setActiveId] = useState(null);
  const activeItem = MENU_ITEMS.find((item) => item.id === activeId);

  return (
    <nav className="menu-list">
      {MENU_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`menu-item ${activeId === item.id ? 'active' : ''}`}
          onClick={() => setActiveId(item.id)}
        >
          {item.label}
        </button>
      ))}

      <SideModal
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveId(null)}
        title={activeItem?.label}
      >
        {activeItem?.component}
      </SideModal>
    </nav>
  );
}
{/* <a href="#" onClick={(e) => { e.preventDefault(); setActiveId(item.id); }} */}