import { useEffect, useState } from 'react';
import { api } from './api';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(!!localStorage.getItem('flexi_token'));

  useEffect(() => {
    if (!checking) return;
    api('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem('flexi_token'))
      .finally(() => setChecking(false));
  }, []);

  const onAuth = ({ token, user }) => {
    localStorage.setItem('flexi_token', token);
    setUser(user);
  };
  const logout = () => {
    localStorage.removeItem('flexi_token');
    setUser(null);
  };

  if (checking) return <div className="loading">Loading FLEXI…</div>;
  return user ? <Dashboard user={user} onLogout={logout} /> : <Login onAuth={onAuth} />;
}
