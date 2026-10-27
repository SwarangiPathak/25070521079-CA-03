import { useEffect, useRef, useState } from 'react';
import { api } from '../api';

const COLS = [
  ['todo', '📝', 'To do', 'var(--pink)', 'Add a task above to get started.'],
  ['doing', '🚀', 'In progress', 'var(--sun)', 'Press Start on a task to move it here.'],
  ['done', '🎉', 'Done', 'var(--mint)', 'Finished tasks land here.'],
];
const ORDER = ['todo', 'doing', 'done'];
const PRIO = { low: '🌿', medium: '⚡', high: '🔥' };

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? '☀️ Good morning' : h < 18 ? '🌤️ Good afternoon' : '🌙 Good evening';
};

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: '', priority: 'medium', dueDate: '' });
  const titleRef = useRef(null);

  useEffect(() => {
    api('/tasks').then(setTasks).catch((e) => setError(e.message));
  }, []);

  const run = async (fn) => {
    setError('');
    try { await fn(); } catch (e) { setError(e.message); }
  };

  const add = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Type a task title first.');
      titleRef.current?.focus();
      return;
    }
    setBusy(true);
    run(async () => {
      const t = await api('/tasks', { method: 'POST', body: form });
      setTasks((prev) => [t, ...prev]);
      setForm((f) => ({ ...f, title: '', dueDate: '' }));
      titleRef.current?.focus();
    }).finally(() => setBusy(false));
  };
  const move = (t, d) =>
    run(async () => {
      const u = await api('/tasks/' + t._id, { method: 'PUT', body: { status: ORDER[ORDER.indexOf(t.status) + d] } });
      setTasks((prev) => prev.map((x) => (x._id === t._id ? u : x)));
    });
  const remove = (t) =>
    run(async () => {
      await api('/tasks/' + t._id, { method: 'DELETE' });
      setTasks((prev) => prev.filter((x) => x._id !== t._id));
    });

  const done = tasks.filter((t) => t.status === 'done').length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const mood = !tasks.length ? '🌱' : pct === 100 ? '🏆' : pct >= 50 ? '😎' : '💪';

  return (
    <div className="dash">
      <header>
        <div className="logo">✨ flexi</div>
        <div className="who">
          <span className="avatar">{user.name.trim()[0]?.toUpperCase()}</span>
          <span>{user.name.split(' ')[0]}</span>
          <button className="btn ghost" onClick={onLogout}>👋 Log out</button>
        </div>
      </header>

      <section className="hello">
        <div>
          <h1>{greeting()}, {user.name.split(' ')[0]}!</h1>
          <p className="muted">{tasks.length ? `${done} of ${tasks.length} tasks done. Keep going!` : 'Your board is empty. Add your first task below.'}</p>
        </div>
        <div className="progress" aria-label={`${pct}% complete`}>
          <span className="mood">{mood}</span>
          <div className="bar"><i style={{ width: pct + '%' }} /></div>
          <b>{pct}%</b>
        </div>
      </section>

      <form className="add" onSubmit={add}>
        <input ref={titleRef} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="✏️ What do you want to get done?" aria-label="Task title" />
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} aria-label="Priority">
          <option value="low">🌿 Low</option><option value="medium">⚡ Medium</option><option value="high">🔥 High</option>
        </select>
        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} aria-label="Due date" />
        <button className="btn" disabled={busy}>{busy ? '⏳ Adding…' : '➕ Add task'}</button>
      </form>
      {error && <div className="error" role="alert">😕 {error}</div>}

      <div className="board">
        {COLS.map(([key, emoji, label, color, hint]) => {
          const items = tasks.filter((t) => t.status === key);
          return (
            <section className="col" key={key} style={{ '--c': color }}>
              <h3><span>{emoji} {label}</span><em>{items.length}</em></h3>
              {items.length === 0 && <p className="empty">{hint}</p>}
              {items.map((t) => (
                <article className={'task' + (key === 'done' ? ' is-done' : '')} key={t._id}>
                  <p>{t.title}</p>
                  <div className="meta">
                    <span className={'chip ' + t.priority}>{PRIO[t.priority]} {t.priority}</span>
                    {t.dueDate && <span className="due">📅 {new Date(t.dueDate).toLocaleDateString()}</span>}
                  </div>
                  <div className="actions">
                    {key !== 'todo' && <button onClick={() => move(t, -1)}>↩️ Back</button>}
                    {key !== 'done' && <button className="go" onClick={() => move(t, 1)}>{key === 'todo' ? '🚀 Start' : '✅ Finish'}</button>}
                    <button className="del" onClick={() => remove(t)} aria-label="Delete task">🗑️</button>
                  </div>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
