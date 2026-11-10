const BASE_URL = 'http://localhost:8000'; // адрес вашего FastAPI

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Не авторизован');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || 'Ошибка запроса');
  }
  return res.json();
}

// export const api = {
//   login: (username, password) =>
//     request('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ username, password }),
//     }),
//   getItems: () => request('/items'),
//   createItem: (data) =>
//     request('/items', { method: 'POST', body: JSON.stringify(data) }),
// };

// временная заглушка для разработки без FastAPI
export const api = {
    login: async (username, password) => {
      if (username === 'admin' && password === '123') {
        return { access_token: 'fake-token' };
      }
      throw new Error('Неверный логин или пароль');
    },
  };

async function postQuery({ content, prompt, file }) {
    const formData = new FormData();
    formData.append('content', content);
  
    if (prompt) formData.append('prompt', prompt);
    if (file) {
      formData.append('file', file, file.name); // бэк получит имя файла и байты
    }
  
    const response = await fetch('/api/query', {
      method: 'POST',
      body: formData,
      // Content-Type НЕ ставим руками — браузер сам добавит с boundary
    });
  
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    return response.json();
  }
  