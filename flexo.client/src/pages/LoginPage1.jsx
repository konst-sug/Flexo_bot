import { useState } from 'react';                 // ← ДОБАВЛЕНО: useState уже был, оставляю как есть
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);   // ← ДОБАВЛЕНО: состояние попапа, false = закрыт
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(username, password);
      localStorage.setItem('token', data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <form className="card" onSubmit={handleSubmit}>

        {/* ← ДОБАВЛЕНО: заголовок теперь с иконкой-триггером */}
        <h1>
          Вход
          {/* ← ДОБАВЛЕНО: иконка. Это <button>, чтобы был и клик, и фокус с клавиатуры */}
          <button
            type="button"                          // ← ДОБАВЛЕНО: не отправляет форму!
            onClick={() => setIsInfoOpen(true)}    // ← ДОБАВЛЕНО: открыть попап
            style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '8px' }}
            aria-label="Что это?"                  // ← ДОБАВЛЕНО: подпись для скринридеров
          >
            ❓
          </button>
        </h1>

        <label>
          Логин
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Входим…' : 'Войти'}
        </button>
      </form>

      {/* ← ДОБАВЛЕНО: сам попап. Рендерится, только если isInfoOpen === true */}
      {isInfoOpen && (
        <div
          className="popup-overlay"
          onClick={() => setIsInfoOpen(false)}     // ← ДОБАВЛЕНО: клик по тёмному фону закрывает
          style={{
            position: 'fixed',                     // ← ДОБАВЛЕНО: поверх всей страницы
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          {/* ← ДОБАВЛЕНО: белая карточка окна. stopPropagation нужен,
                 чтобы клик по самой карточке НЕ закрывал попап */}
          <div
            className="popup-card" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '320px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <h3>Как войти?</h3>
            <p>Используйте логин и пароль, выданные администратором.</p>
            {/* ← ДОБАВЛЕНО: кнопка закрытия */}
            <button onClick={() => setIsInfoOpen(false)}>Понятно</button>
          </div>
        </div>
      )}
    </div>
  );
}
