// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ← ОДИН запрос при старте приложения
    const fetchTheme = async () => {
      try {
        const res = await fetch('/api/user/theme', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        setTheme(data);
      } catch (e) {
        console.warn('Тема не загружена, используем дефолтную');
        setTheme({}); // или объект с дефолтными значениями
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, []);

  if (loading) return <div>Загрузка оформления...</div>;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
