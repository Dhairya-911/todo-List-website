import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const AdminPanel = () => {
  const [usersWithTasks, setUsersWithTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch users with tasks
      const usersResponse = await fetch(`${API_BASE_URL}/admin/users-with-tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch statistics
      const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (usersResponse.ok && statsResponse.ok) {
        const usersData = await usersResponse.json();
        const statsData = await statsResponse.json();
        
        setUsersWithTasks(usersData);
        setStats(statsData);
      } else {
        setError('Failed to fetch admin data');
      }
    } catch (error) {
      setError('Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserExpansion = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  if (loading) {
    return <div style={styles.loading}>Loading admin data...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.adminPanel}>
      <h3 style={styles.adminTitle}>Admin Dashboard</h3>
      
      {/* Statistics Section */}
      {stats && (
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h4>Total Users</h4>
            <p style={styles.statNumber}>{stats.totalUsers}</p>
            <small>{stats.totalRegisteredUsers} registered + {stats.totalDemoUsers} demo</small>
          </div>
          <div style={styles.statCard}>
            <h4>Total Tasks</h4>
            <p style={styles.statNumber}>{stats.totalTasks}</p>
          </div>
          <div style={styles.statCard}>
            <h4>Completed</h4>
            <p style={styles.statNumber}>{stats.completedTasks}</p>
          </div>
          <div style={styles.statCard}>
            <h4>Pending</h4>
            <p style={styles.statNumber}>{stats.pendingTasks}</p>
          </div>
        </div>
      )}

      {/* Users and Tasks Section */}
      <div style={styles.usersSection}>
        <h4 style={styles.sectionTitle}>Users and Their Tasks</h4>
        
        {usersWithTasks.length === 0 ? (
          <p style={styles.noData}>No users found</p>
        ) : (
          <div style={styles.usersList}>
            {usersWithTasks.map((user) => (
              <div key={user._id} style={styles.userCard}>
                <div 
                  style={styles.userHeader}
                  onClick={() => toggleUserExpansion(user._id)}
                >
                  <div style={styles.userInfo}>
                    <span style={styles.userName}>{user.name}</span>
                    <span style={styles.userEmail}>{user.email}</span>
                    <span style={{
                      ...styles.userRole,
                      ...(user.role === 'admin' ? styles.adminRole : styles.regularRole)
                    }}>
                      {user.role.toUpperCase()}
                    </span>
                    {user.isDemo && <span style={styles.demoTag}>DEMO</span>}
                  </div>
                  <div style={styles.userStats}>
                    <span style={styles.taskCount}>
                      {user.taskCount} tasks ({user.completedTasks} completed)
                    </span>
                    <span style={styles.expandIcon}>
                      {expandedUsers.has(user._id) ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {expandedUsers.has(user._id) && (
                  <div style={styles.tasksContainer}>
                    {user.tasks.length === 0 ? (
                      <p style={styles.noTasks}>No tasks created yet</p>
                    ) : (
                      <div style={styles.tasksList}>
                        {user.tasks.map((task) => (
                          <div 
                            key={task._id} 
                            style={{
                              ...styles.taskItem,
                              ...(task.completed ? styles.completedTask : {})
                            }}
                          >
                            <span style={styles.taskTitle}>
                              {task.completed && <span style={styles.checkmark}>✓</span>}
                              {task.title}
                            </span>
                            <span style={styles.taskDate}>
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  adminPanel: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    border: 'none',
    borderRadius: '20px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
  },
  adminTitle: {
    margin: '0 0 1.5rem 0',
    color: '#e4e4e7',
    fontSize: '1.8rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#cbd5e1',
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    padding: '1.5rem',
    borderRadius: '16px',
    marginBottom: '1.5rem',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2.5rem',
  },
  statCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    padding: '1.5rem',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)',
    },
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0.75rem 0',
    color: '#e4e4e7',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  usersSection: {
    marginTop: '2rem',
  },
  sectionTitle: {
    color: '#e4e4e7',
    marginBottom: '1.5rem',
    fontSize: '1.4rem',
    fontWeight: '600',
  },
  noData: {
    textAlign: 'center',
    color: '#94a3b8',
    fontStyle: 'italic',
    fontSize: '1.1rem',
  },
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  userCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    border: 'none',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
    },
  },
  userHeader: {
    padding: '1rem',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(55, 65, 81, 0.5)',
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#e4e4e7',
  },
  userEmail: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  userRole: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    width: 'fit-content',
  },
  adminRole: {
    backgroundColor: '#ef4444',
    color: 'white',
  },
  regularRole: {
    backgroundColor: '#6366f1',
    color: 'white',
  },
  demoTag: {
    fontSize: '0.75rem',
    backgroundColor: '#64748b',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    width: 'fit-content',
  },
  userStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  taskCount: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  expandIcon: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  tasksContainer: {
    padding: '1rem',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  noTasks: {
    textAlign: 'center',
    color: '#94a3b8',
    fontStyle: 'italic',
    margin: 0,
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: '4px',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
  completedTask: {
    opacity: 0.7,
    backgroundColor: 'rgba(55, 65, 81, 0.6)',
  },
  taskTitle: {
    fontSize: '0.875rem',
    color: '#e4e4e7',
  },
  checkmark: {
    color: '#10b981',
    marginRight: '0.5rem',
    fontWeight: 'bold',
  },
  taskDate: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
};

export default AdminPanel;
