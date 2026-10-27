import { useState } from 'react';
import { api } from '../api';

const PERKS = [
  ['📝', 'Jot down tasks in seconds'],
  ['🎯', 'Set priorities that matter'],
  ['🚀', 'Move them forward, one step at a time'],
];

export default function Login({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isLogin = mode === 'login';
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      onAuth(await api(`/auth/${mode}`, { method: 'POST', body: form }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <section className="auth-hero">
        <div className="logo">✨ flexi</div>
        <h1>Plan your day, your way.</h1>
        <p>A cheerful little board for everything you want to get done.</p>
        <ul className="perks">
          {PERKS.map(([e, t]) => (
            <li key={t}><span>{e}</span>{t}</li>
          ))}
        </ul>
        <div className="floaters" aria-hidden="true">
          <b>🌈</b><b>⭐</b><b>🎈</b><b>🍀</b><b>💜</b>
        </div>
      </section>

      <section className="auth-card">
        <div className="wave">{isLogin ? '👋' : '🎉'}</div>
        <h2>{isLogin ? 'Welcome back!' : 'Let’s get you started'}</h2>
        <p className="muted">{isLogin ? 'Log in to see your tasks.' : 'Create your account. It takes under a minute.'}</p>
        <form onSubmit={submit}>
          {!isLogin && (
            <label>🧑 Full name<input value={form.name} onChange={set('name')} placeholder="Your name" required /></label>
          )}
          <label>💌 Email<input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required /></label>
          <label>🔒 Password<input type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" required /></label>
          {error && <div className="error" role="alert">😕 {error}</div>}
          <button className="btn big" disabled={busy}>{busy ? '⏳ Please wait…' : isLogin ? '🔓 Log in' : '🎈 Create account'}</button>
        </form>
        <p className="switch">
          {isLogin ? 'New to FLEXI?' : 'Already have an account?'}{' '}
          <button type="button" className="link" onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); }}>
            {isLogin ? 'Create an account' : 'Log in'}
          </button>
        </p>
      </section>
    </main>
  );
}
