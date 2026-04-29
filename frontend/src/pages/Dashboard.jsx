import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, createTask } from '../services/api';
import TaskItem from '../components/TaskItem';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      if (err.message.includes('token') || err.message.includes('Token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const data = await createTask(newTitle.trim());
      setTasks(prev => [data.task, ...prev]);
      setNewTitle('');
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = (updatedTask) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDelete = (deletedId) => {
    setTasks(prev => prev.filter(t => t.id !== deletedId));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        background: 'radial-gradient(ellipse at 30% 0%, rgba(99,102,241,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 100%, rgba(124,58,237,0.08) 0%, transparent 60%)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* Header */}
        <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            My <span className="gradient-text">Tasks</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {user?.email} • {tasks.length} total task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
          className="animate-fade-in-up"
        >
          {[
            { label: 'Total', value: tasks.length, color: '#818cf8' },
            { label: 'Pending', value: pendingCount, color: '#fbbf24' },
            { label: 'Completed', value: completedCount, color: '#34d399' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card"
              style={{ padding: '1.25rem', textAlign: 'center' }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Form */}
        <form
          onSubmit={handleAddTask}
          className="glass-card animate-fade-in-up"
          style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}
        >
          <input
            id="new-task-input"
            type="text"
            className="input-field"
            placeholder="✦ Add a new task..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            disabled={adding}
          />
          <button
            id="add-task-btn"
            type="submit"
            className="btn-primary"
            disabled={adding || !newTitle.trim()}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {adding ? '...' : '+ Add Task'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div
            id="dashboard-error-msg"
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {['all', 'pending', 'completed'].map(f => (
            <button
              key={f}
              id={`filter-${f}`}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.04)',
                border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: filter === f ? 'white' : '#64748b',
                padding: '0.4rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            <p>Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            className="glass-card"
            style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {filter === 'completed' ? '🎉' : '📝'}
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>
              {filter === 'all'
                ? 'No tasks yet. Add one above!'
                : filter === 'pending'
                ? 'No pending tasks!'
                : 'No completed tasks yet.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
