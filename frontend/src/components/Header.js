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
        <h1 style={styles.title}>Todo List</h1>
        
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
    backgroundColor: 'rgba(30, 30, 46, 0.9)',
    color: '#e4e4e7',
    padding: '1.5rem 0',
    marginBottom: '2rem',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
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
    fontSize: '1.8rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  userInfo: {
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#a1a1aa',
    fontWeight: '500',
  },
  adminBadge: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
  },
  logoutButton: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
    '&:hover': {
      backgroundColor: '#4f46e5',
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
    },
  },
};

export default Header;
