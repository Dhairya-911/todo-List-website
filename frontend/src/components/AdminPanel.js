import React, { useState, useEffect } from 'react';

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
      const usersResponse = await fetch('http://localhost:3000/api/admin/users-with-tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch statistics
      const statsResponse = await fetch('http://localhost:3000/api/admin/stats', {
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
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  adminTitle: {
    margin: '0 0 1rem 0',
    color: '#856404',
    fontSize: '1.25rem',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '6px',
    textAlign: 'center',
    border: '1px solid #e9ecef',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0.5rem 0',
    color: '#495057',
  },
  usersSection: {
    marginTop: '1.5rem',
  },
  sectionTitle: {
    color: '#856404',
    marginBottom: '1rem',
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  userCard: {
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  userHeader: {
    padding: '1rem',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f8f9fa',
    '&:hover': {
      backgroundColor: '#f8f9fa',
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
    color: '#333',
  },
  userEmail: {
    fontSize: '0.875rem',
    color: '#666',
  },
  userRole: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    width: 'fit-content',
  },
  adminRole: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
  regularRole: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  demoTag: {
    fontSize: '0.75rem',
    backgroundColor: '#6c757d',
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
    color: '#666',
  },
  expandIcon: {
    fontSize: '0.875rem',
    color: '#666',
  },
  tasksContainer: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
  },
  noTasks: {
    textAlign: 'center',
    color: '#666',
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
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #e9ecef',
  },
  completedTask: {
    opacity: 0.7,
    backgroundColor: '#f1f3f4',
  },
  taskTitle: {
    fontSize: '0.875rem',
    color: '#333',
  },
  checkmark: {
    color: '#28a745',
    marginRight: '0.5rem',
    fontWeight: 'bold',
  },
  taskDate: {
    fontSize: '0.75rem',
    color: '#666',
  },
};

export default AdminPanel;
