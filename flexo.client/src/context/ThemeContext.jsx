// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'; // ← ДОБАВЛЕНО useCallback

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTheme = useCallback(async () => {   // ← ИЗМЕНЕНО: обернули вашу же функцию
    const token = localStorage.getItem('token');
    if (!token) {                                // ← ДОБАВЛЕНО: без токена не ходим на бэк
      setTheme({});
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/user/theme', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTheme(data);
    } catch (e) {
      console.warn('Тема не загружена, используем дефолтную');
      setTheme({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTheme();   // ← один запрос при старте, если токен уже есть (перезагрузка страницы)
  }, [fetchTheme]);

  // ← ДОБАВИТЬ: применяем тему к :root, перекрывая дефолты из CSS
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [theme]);


  if (loading) return <div>Загрузка оформления...</div>;

  

  return (
    <ThemeContext.Provider value={{ theme, reloadTheme: fetchTheme }}>  {/* ← ИЗМЕНЕНО */}
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
