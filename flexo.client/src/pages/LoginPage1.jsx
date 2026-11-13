import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api';

export default function LoginPage1() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // ← видимость попапов
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // ← поля регистрации
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // ← поля сброса пароля
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();
  const { reloadTheme } = useTheme(); 

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(username, password);
      localStorage.setItem('token', data.access_token);
      reloadTheme();   // ← подтянуть тему под нового пользователя
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ← отправка регистрации
  async function handleRegister(e) {
    e.preventDefault();
    setRegError('');

    if (regPassword !== regPassword2) {
      setRegError('Пароли не совпадают');
      return;
    }

    setRegLoading(true);
    try {
      await api.register({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        password: regPassword,
      });
      setIsRegisterOpen(false);
      // при желании можно сразу логинить пользователя теми же данными
    } catch (err) {
      setRegError(err.message);
    } finally {
      setRegLoading(false);
    }
  }

  // ← отправка почты для подтверждения
  async function handleReset(e) {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);
    try {
      await api.resetPassword(resetEmail);
      setIsResetOpen(false);
      // сюда же можно поставить сообщение «письмо отправлено»
    } catch (err) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="page-center">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Вход</h1>

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Входим…' : 'Войти'}
          </button>

          {/* ← ИЗМЕНЕНО: ссылки стали кнопками, открывающими попапы */}
            <a
            href="#"
            onClick={(e) => {
              e.preventDefault();        // чтобы страница не прыгала и не менялся URL
              setIsRegisterOpen(true);
            }}
          >
            Регистрация
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsResetOpen(true);
            }}
          >
            Забыли пароль?
          </a>

          <button
            type="button"
            onClick={() => setIsInfoOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '8px' }}
            aria-label="Что это?"
          >
            ❓
          </button>
        </div>
      </form>

      {/* попап «Как войти?» — без изменений */}
      {isInfoOpen && (
        <div
          className="popup-overlay"
          onClick={() => setIsInfoOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
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
            <button onClick={() => setIsInfoOpen(false)}>Понятно</button>
          </div>
        </div>
      )}

      {/* ← ДОБАВЛЕНО: попап регистрации */}
      {isRegisterOpen && (
        <div
          className="popup-overlay"
          onClick={() => setIsRegisterOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <form
            className="popup-card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleRegister}
            style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '320px',
              width: '100%',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <h3>Регистрация</h3>
            <label>
              Имя
              <input
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
                required
              />
            </label>
            <label>
              Фамилия
              <input
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
                required
              />
            </label>
            <label>
              Почта
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Пароль
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Повторите пароль
              <input
                type="password"
                value={regPassword2}
                onChange={(e) => setRegPassword2(e.target.value)}
                required
              />
            </label>
            {regError && <p className="error">{regError}</p>}
            <button type="submit" disabled={regLoading}>
              {regLoading ? 'Регистрируем…' : 'Зарегистрироваться'}
            </button>
            <button type="button" onClick={() => setIsRegisterOpen(false)}>
              Отмена
            </button>
          </form>
        </div>
      )}

      {/* ← ДОБАВЛЕНО: попап «Забыли пароль?» */}
      {isResetOpen && (
        <div
          className="popup-overlay"
          onClick={() => setIsResetOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <form
            className="popup-card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleReset}
            style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '320px',
              width: '100%',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <h3>Восстановление пароля</h3>
            <p className="hint">Укажите почту — на неё придёт письмо для подтверждения.</p>
            <label>
              Почта
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </label>
            {resetError && <p className="error">{resetError}</p>}
            <button type="submit" disabled={resetLoading}>
              {resetLoading ? 'Отправляем…' : 'Отправить'}
            </button>
            <button type="button" onClick={() => setIsResetOpen(false)}>
              Отмена
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
