import React from 'react';
import { toggleTask, deleteTask } from '../services/api';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const isCompleted = task.status === 'completed';

  const handleToggle = async () => {
    try {
      const data = await toggleTask(task.id);
      onUpdate(data.task);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(task.id);
      onDelete(task.id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className="glass-card animate-slide-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        transition: 'all 0.2s ease',
        opacity: isCompleted ? 0.75 : 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
        e.currentTarget.style.background = 'rgba(99,102,241,0.06)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      }}
    >
      {/* Checkbox / Toggle */}
      <button
        id={`toggle-task-${task.id}`}
        onClick={handleToggle}
        title="Toggle status"
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: `2px solid ${isCompleted ? '#34d399' : 'rgba(255,255,255,0.3)'}`,
          background: isCompleted
            ? 'linear-gradient(135deg, #10b981, #34d399)'
            : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          color: 'white',
          fontSize: '12px',
        }}
      >
        {isCompleted ? '✓' : ''}
      </button>

      {/* Task title */}
      <p
        style={{
          flex: 1,
          fontSize: '0.95rem',
          color: isCompleted ? '#64748b' : '#e2e8f0',
          textDecoration: isCompleted ? 'line-through' : 'none',
          wordBreak: 'break-word',
          transition: 'all 0.2s ease',
        }}
      >
        {task.title}
      </p>

      {/* Badge */}
      <span className={isCompleted ? 'badge-completed' : 'badge-pending'}>
        {isCompleted ? 'Completed' : 'Pending'}
      </span>

      {/* Delete */}
      <button
        id={`delete-task-${task.id}`}
        onClick={handleDelete}
        className="btn-danger"
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
};

export default TaskItem;
