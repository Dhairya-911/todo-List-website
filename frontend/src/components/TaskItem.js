import React, { useState, useEffect, useRef } from 'react';
import { gsapAnimations, animeAnimations, animationPresets } from '../utils/animations';

const TaskItem = ({ task, onToggle, onDelete, onEdit, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const taskRef = useRef(null);
  const buttonRefs = useRef([]);

  // Animation on mount
  useEffect(() => {
    if (taskRef.current) {
      gsapAnimations.taskEnter(taskRef.current);
    }
  }, []);

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

  const handleToggle = () => {
    if (taskRef.current) {
      // Celebration animation for task completion
      if (!task.completed) {
        animationPresets.taskComplete(taskRef.current);
      }
    }
    onToggle(task._id);
  };

  const handleDelete = () => {
    if (taskRef.current) {
      gsapAnimations.taskExit(taskRef.current, () => {
        onDelete(task._id);
      });
    } else {
      onDelete(task._id);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  // Button hover animations
  const handleButtonHover = (index) => {
    if (buttonRefs.current[index]) {
      gsapAnimations.buttonHover(buttonRefs.current[index]);
    }
  };

  const handleButtonUnhover = (index) => {
    if (buttonRefs.current[index]) {
      gsapAnimations.buttonUnhover(buttonRefs.current[index]);
    }
  };

  return (
    <div 
      ref={taskRef}
      style={{...styles.taskItem, ...(task.completed ? styles.completedTask : {})}}
      className="task-item-animated"
    >
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
            onClick={!isEditing ? handleToggle : undefined}
            style={{
              ...styles.taskTitle,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#9ca3af' : '#ffffff',
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
              ref={el => buttonRefs.current[0] = el}
              onClick={handleToggle}
              onMouseEnter={() => handleButtonHover(0)}
              onMouseLeave={() => handleButtonUnhover(0)}
              style={{
                ...styles.actionButton,
                ...(task.completed ? styles.undoButton : styles.completeButton)
              }}
            >
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            
            <button 
              ref={el => buttonRefs.current[1] = el}
              onClick={() => setIsEditing(true)}
              onMouseEnter={() => handleButtonHover(1)}
              onMouseLeave={() => handleButtonUnhover(1)}
              style={{...styles.actionButton, ...styles.editButton}}
            >
              Edit
            </button>
            
            {/* Show delete button for admin users or the task owner */}
            <button 
              ref={el => buttonRefs.current[2] = el}
              onClick={handleDelete}
              onMouseEnter={() => handleButtonHover(2)}
              onMouseLeave={() => handleButtonUnhover(2)}
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
    padding: '1.5rem',
    backgroundColor: 'rgba(45, 55, 72, 0.95)',
    border: 'none',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)',
      backgroundColor: 'rgba(55, 65, 81, 0.95)',
    },
  },
  completedTask: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    opacity: 0.8,
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1,
  },
  taskTitle: {
    fontSize: '1.1rem',
    cursor: 'pointer',
    userSelect: 'none',
    fontWeight: '600',
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    transition: 'color 0.2s ease',
  },
  editInput: {
    fontSize: '1.1rem',
    padding: '0.75rem',
    border: '2px solid #8b5cf6',
    borderRadius: '12px',
    outline: 'none',
    flex: 1,
    backgroundColor: '#374151',
    color: '#ffffff',
    fontWeight: '500',
    boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)',
  },
  completedBadge: {
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
  },
  taskActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  actionButton: {
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    },
  },
  completeButton: {
    backgroundColor: '#22c55e',
    color: 'white',
    '&:hover': {
      backgroundColor: '#16a34a',
    },
  },
  undoButton: {
    backgroundColor: '#f97316',
    color: 'white',
    '&:hover': {
      backgroundColor: '#ea580c',
    },
  },
  editButton: {
    backgroundColor: '#8b5cf6',
    color: 'white',
    '&:hover': {
      backgroundColor: '#7c3aed',
    },
  },
  saveButton: {
    backgroundColor: '#22c55e',
    color: 'white',
    '&:hover': {
      backgroundColor: '#16a34a',
    },
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    '&:hover': {
      backgroundColor: '#4b5563',
    },
  },
  deleteButton: {
    backgroundColor: '#f43f5e',
    color: 'white',
    '&:hover': {
      backgroundColor: '#e11d48',
    },
  },
};

export default TaskItem;
