import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Header from './components/Header';
import TaskItem from './components/TaskItem';

const API_URL = 'http://localhost:3000/api/tasks';

function TodoApp() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

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
      } else {
        setError('Failed to add task');
      }
    } catch (error) {
      setError('Failed to add task');
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

  if (!user) {
    return null; // This will be handled by the main App component
  }

  return (
    <div>
      <Header />
      <div style={styles.container}>
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.addTaskSection}>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter a new task..."
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button 
            onClick={addTask}
            disabled={loading || !title.trim()}
            style={{...styles.addButton, ...(loading ? styles.addButtonDisabled : {})}}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>

        {isAdmin() && (
          <div style={styles.adminPanel}>
            <h3 style={styles.adminTitle}>Admin Panel</h3>
            <p style={styles.adminInfo}>
              You have admin privileges. You can manage all tasks.
            </p>
            <div style={styles.statsSection}>
              <div style={styles.stat}>
                <strong>Total Tasks:</strong> {tasks.length}
              </div>
              <div style={styles.stat}>
                <strong>Completed:</strong> {tasks.filter(t => t.completed).length}
              </div>
              <div style={styles.stat}>
                <strong>Pending:</strong> {tasks.filter(t => !t.completed).length}
              </div>
            </div>
          </div>
        )}

        <div style={styles.taskList}>
          {tasks.length === 0 ? (
            <p style={styles.noTasks}>No tasks yet. Add one above!</p>
          ) : (
            tasks.map(t => (
              <TaskItem
                key={t._id}
                task={t}
                onToggle={() => toggleTask(t._id, t.completed)}
                onDelete={() => deleteTask(t._id)}
                isAdmin={isAdmin()}
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
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { user, login, loading } = useAuth();

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={login} />;
  }

  return <TodoApp />;
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid #f5c6cb',
  },
  addTaskSection: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  addButtonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
  adminPanel: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '4px',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  adminTitle: {
    margin: '0 0 0.5rem 0',
    color: '#856404',
  },
  adminInfo: {
    margin: '0 0 1rem 0',
    color: '#856404',
  },
  statsSection: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  stat: {
    color: '#856404',
    fontSize: '0.9rem',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  noTasks: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    padding: '2rem',
  },
};

export default App;
