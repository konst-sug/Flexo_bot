import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { id: "chat",     label: "Чат",       path: "/",      roles: ["admin", "user"] },
  { id: "docs",     label: "Документы", path: "/documents", roles: ["admin", "user"] },
  { id: "settings", label: "Настройки", path: "/settings",  roles: ["admin"] },
];

const CURRENT_ROLE = "admin";   // заглушка, пока бэк не отдаёт роль
// const { theme, setTheme } = useTheme();

export default function Layout() {
  const navigate = useNavigate();
  const navItems = NAV_ITEMS.filter(
    (item) => item.roles.includes(CURRENT_ROLE)
  );

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="page">
      <header className="topbar panel-shadow">
        <h1>Flexo.Bot</h1>
        <nav className="topbar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                "topbar-link" + (isActive ? " topbar-link-active" : "")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout}>Выйти</button>
      </header>
      {/* <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? '☀' : '🌙'}
      </button> */}

      <Outlet />
    </div>
  );
}
