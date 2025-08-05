import React, { useState, useEffect } from 'react';

const TaskItem = ({ task, onToggle, onDelete, onEdit, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  // Update editTitle when task.title changes (after successful edit)
  useEffect(() => {
    setEditTitle(task.title);
  }, [task.title]);

  const handleEditSave = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onEdit(task._id, editTitle.trim());
    }
    setIsEditing(false);
    // Don't reset editTitle here - let useEffect handle it when task.title updates
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title); // Reset to original title
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div style={{...styles.taskItem, ...(task.completed ? styles.completedTask : {})}}>
      <div style={styles.taskContent}>
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleEditSave}
            style={styles.editInput}
            autoFocus
          />
        ) : (
          <span
            onClick={!isEditing ? onToggle : undefined}
            style={{
              ...styles.taskTitle,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#6c757d' : '#333',
              cursor: !isEditing ? 'pointer' : 'default'
            }}
          >
            {task.title}
          </span>
        )}
        
        {task.completed && !isEditing && <span style={styles.completedBadge}>✓ Completed</span>}
      </div>
      
      <div style={styles.taskActions}>
        {isEditing ? (
          <>
            <button 
              onClick={handleEditSave}
              style={{...styles.actionButton, ...styles.saveButton}}
            >
              Save
            </button>
            <button 
              onClick={handleEditCancel}
              style={{...styles.actionButton, ...styles.cancelButton}}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={onToggle}
              style={{
                ...styles.actionButton,
                ...(task.completed ? styles.undoButton : styles.completeButton)
              }}
            >
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            
            <button 
              onClick={() => setIsEditing(true)}
              style={{...styles.actionButton, ...styles.editButton}}
            >
              Edit
            </button>
            
            {/* Show delete button for admin users or the task owner */}
            <button 
              onClick={onDelete}
              style={{...styles.actionButton, ...styles.deleteButton}}
            >
              Delete
            </button>
          </>
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
  editInput: {
    fontSize: '1rem',
    padding: '0.5rem',
    border: '2px solid #007bff',
    borderRadius: '4px',
    outline: 'none',
    flex: 1,
    backgroundColor: 'white',
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
  editButton: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
};

export default TaskItem;
