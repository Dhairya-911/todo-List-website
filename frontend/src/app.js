import React, { useEffect, useState, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import TaskItem from './components/TaskItem';
import AdminPanel from './components/AdminPanel';
import AnimatedBackground from './components/AnimatedBackground';
import LoadingSpinner from './components/LoadingSpinner';
import { gsapAnimations, animeAnimations, animationUtils } from './utils/animations';
import API_BASE_URL from './config/api';

const API_URL = `${API_BASE_URL}/tasks`;

function TodoApp() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);
  const taskListRef = useRef(null);
  const addButtonRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Page load animation
  useEffect(() => {
    if (containerRef.current && user) {
      gsapAnimations.pageLoad(containerRef.current.children);
    }
  }, [user]);

  // Animate tasks when they change
  useEffect(() => {
    if (taskListRef.current && tasks.length > 0) {
      const taskElements = taskListRef.current.querySelectorAll('.task-item-animated');
      gsapAnimations.staggerIn(taskElements);
    }
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else if (response.status === 401) {
        // Token expired or invalid
        const { logout } = useAuth();
        logout();
      }
    } catch (error) {
      setError('Failed to fetch tasks');
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    
    // Button animation on click
    if (addButtonRef.current) {
      gsapAnimations.successPulse(addButtonRef.current);
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });
      
      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        setTitle('');
        setError(''); // Clear any previous errors
      } else {
        setError('Failed to add task');
        // Shake animation for error
        if (addButtonRef.current) {
          gsapAnimations.errorShake(addButtonRef.current);
        }
      }
    } catch (error) {
      setError('Failed to add task');
      if (addButtonRef.current) {
        gsapAnimations.errorShake(addButtonRef.current);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !completed })
      });
      
      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map(t => t._id === id ? updated : t));
      } else {
        setError('Failed to update task');
      }
    } catch (error) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setTasks(tasks.filter(t => t._id !== id));
      } else {
        setError('Failed to delete task');
      }
    } catch (error) {
      setError('Failed to delete task');
    }
  };

  const editTask = async (id, newTitle) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle })
      });
      
      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map(t => t._id === id ? updated : t));
      } else {
        setError('Failed to edit task');
      }
    } catch (error) {
      setError('Failed to edit task');
    }
  };

  if (!user) {
    return null; // This will be handled by the main App component
  }

  return (
    <div>
      <Header />
      <div ref={containerRef} style={styles.container} className="app-container">
        {error && <div style={styles.error}>{error}</div>}
        
        {/* Only show add task section for non-admin users */}
        {!isAdmin() && (
          <div style={styles.addTaskSection} className="add-task-section">
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter a new task..."
              style={styles.input}
              className="add-task-input"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button 
              ref={addButtonRef}
              onClick={addTask}
              disabled={loading || !title.trim()}
              style={{...styles.addButton, ...(loading ? styles.addButtonDisabled : {})}}
              className="add-task-button"
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        )}

        {isAdmin() && <AdminPanel />}

        <div ref={taskListRef} style={styles.taskList}>
          {tasks.length === 0 ? (
            <p style={styles.noTasks}>
              {isAdmin() ? "No tasks to view in the system" : "No tasks yet. Add one above!"}
            </p>
          ) : (
            tasks.map(t => (
              <TaskItem
                key={t._id}
                task={t}
                onToggle={() => toggleTask(t._id, t.completed)}
                onDelete={() => deleteTask(t._id)}
                onEdit={editTask}
                isAdmin={isAdmin()}
                currentUser={user}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AnimatedBackground />
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { user, login, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return <LoadingSpinner message="Setting up your workspace..." />;
  }

  if (!user) {
    if (showRegister) {
      return (
        <Register 
          onRegister={login} 
          onSwitchToLogin={() => setShowRegister(false)} 
        />
      );
    } else {
      return (
        <Login 
          onLogin={login} 
          onSwitchToRegister={() => setShowRegister(true)} 
        />
      );
    }
  }

  return <TodoApp />;
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1rem',
    minHeight: 'calc(100vh - 80px)',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem',
    color: '#e4e4e7',
    fontWeight: '500',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  error: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    padding: '1rem 1.5rem',
    borderRadius: '16px',
    marginBottom: '1.5rem',
    boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
    fontSize: '0.95rem',
    fontWeight: '500',
    border: 'none',
    backdropFilter: 'blur(10px)',
  },
  addTaskSection: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    background: 'rgba(30, 30, 46, 0.9)',
    padding: '1.5rem',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    transition: 'all 0.3s ease',
  },
  input: {
    flex: 1,
    padding: '1rem 1.5rem',
    border: '2px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '14px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#1f2937',
    color: '#e4e4e7',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    fontFamily: 'inherit',
  },
  addButton: {
    padding: '1rem 2.5rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  },
  addButtonDisabled: {
    background: 'linear-gradient(135deg, #4b5563, #6b7280)',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: '0 3px 10px rgba(75, 85, 99, 0.3)',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  noTasks: {
    textAlign: 'center',
    color: 'rgba(228, 228, 231, 0.8)',
    fontSize: '1.2rem',
    fontWeight: '500',
    padding: '3rem 2rem',
    background: 'rgba(30, 30, 46, 0.6)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
};

export default App;
