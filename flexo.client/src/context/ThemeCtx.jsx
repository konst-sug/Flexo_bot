// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const root = document.documentElement; // или document.body

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch('/api/user/theme', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        setTheme(data.theme);

        // Применяем переменные в DOM
        const t = data.theme;
        root.style.setProperty('--bg-color', t.bgColor);
        root.style.setProperty('--text-color', t.textColor);
        root.style.setProperty('--primary-color', t.primaryColor);
        root.style.setProperty('--panel-shadow-color', t.panelShadowColor);
        root.style.setProperty('--font-family', t.fontFamily);
        root.style.setProperty('--font-size-base', t.fontSizeBase);
        root.style.setProperty('--border-radius', t.borderRadius);

        // Переключаем класс для тёмной/светлой темы
        if (t.isDark) {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      } catch (e) {
        console.warn('Тема не загружена, используются дефолты');
      }
    };
    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
