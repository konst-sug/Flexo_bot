// src/components/ProfileForm.jsx
import { useState } from 'react';

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Данные профиля:', formData);
    // Тут будет отправка на сервер
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
    <form onSubmit={handleSubmit} className='form-column'>
      <div>
      <h2>Личные данные</h2>
        <label>Имя</label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <div>
        <label>Фамилия</label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <button type="submit" style={{ padding: '10px 16px', background: '#007bff', color: '#fff' }}>
        Сохранить профиль
      </button>
    </form>

    <form onSubmit={handleSubmit} className='form-column'>
      <div>
      <h2>Сменить пароль</h2>
        <label>Текущий пароль</label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <div>
        <label>Новый пароль</label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <div>
        <label>Повторите новый пароль</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <button type="submit" style={{ padding: '10px 16px', background: '#007bff', color: '#fff' }}>
        Сохранить профиль
      </button>
    </form>
    </div>
  );
}
