import React from 'react';

const TaskItem = ({ task, onToggle, onDelete, isAdmin }) => {
  return (
    <div style={{...styles.taskItem, ...(task.completed ? styles.completedTask : {})}}>
      <div style={styles.taskContent}>
        <span
          onClick={onToggle}
          style={{
            ...styles.taskTitle,
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#6c757d' : '#333'
          }}
        >
          {task.title}
        </span>
        
        {task.completed && <span style={styles.completedBadge}>✓ Completed</span>}
      </div>
      
      <div style={styles.taskActions}>
        <button 
          onClick={onToggle}
          style={{
            ...styles.actionButton,
            ...(task.completed ? styles.undoButton : styles.completeButton)
          }}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        
        {/* Only show delete button for admin users or if it's the user's own task */}
        {isAdmin && (
          <button 
            onClick={onDelete}
            style={{...styles.actionButton, ...styles.deleteButton}}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'white',
    border: '1px solid #e9ecef',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  completedTask: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1,
  },
  taskTitle: {
    fontSize: '1rem',
    cursor: 'pointer',
    userSelect: 'none',
  },
  completedBadge: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  taskActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  completeButton: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  undoButton: {
    backgroundColor: '#ffc107',
    color: '#212529',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
};

export default TaskItem;
