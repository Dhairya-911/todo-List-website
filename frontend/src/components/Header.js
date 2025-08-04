import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.title}>Todo App</h1>
        
        {user && (
          <div style={styles.userSection}>
            <span style={styles.userInfo}>
              Welcome, {user.name}
              {isAdmin() && (
                <span style={styles.adminBadge}>ADMIN</span>
              )}
            </span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#343a40',
    color: 'white',
    padding: '1rem 0',
    marginBottom: '2rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userInfo: {
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  adminBadge: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
};

export default Header;
