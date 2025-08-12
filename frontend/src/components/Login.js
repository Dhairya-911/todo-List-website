import React, { useState, useEffect, useRef } from 'react';
import { gsapAnimations, animeAnimations } from '../utils/animations';
import API_BASE_URL from '../config/api';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      gsapAnimations.modalEnter(formRef.current);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Success animation
        if (buttonRef.current) {
          gsapAnimations.successPulse(buttonRef.current);
        }
        
        setTimeout(() => onLogin(data.user), 300);
      } else {
        setError(data.message || 'Login failed');
        
        // Error animation
        if (formRef.current) {
          gsapAnimations.errorShake(formRef.current);
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="auth-container">
      <div ref={formRef} style={styles.loginBox} className="auth-box">
        <h2 style={styles.title} className="auth-title">Todo App Login</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              className="auth-input"
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              className="auth-input"
              placeholder="Enter your password"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button 
            ref={buttonRef}
            type="submit" 
            disabled={loading}
            style={{...styles.submitButton, ...(loading ? styles.submitButtonDisabled : {})}}
            className="auth-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.registerLink}>
          <p>Don't have an account?{' '}
            <button 
              type="button" 
              onClick={onSwitchToRegister}
              style={styles.linkButton}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    padding: '1rem',
  },
  loginBox: {
    backgroundColor: 'rgba(30, 30, 46, 0.9)',
    padding: '3rem',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '450px',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#e4e4e7',
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#a1a1aa',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #374151',
    borderRadius: '12px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: '#1f2937',
    color: '#e4e4e7',
    outline: 'none',
    '&:focus': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
      transform: 'translateY(-1px)',
    },
  },
  error: {
    color: '#fca5a5',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    fontSize: '0.9rem',
  },
  submitButton: {
    padding: '1rem',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
    '&:hover': {
      backgroundColor: '#4f46e5',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(99, 102, 241, 0.5)',
    },
  },
  submitButtonDisabled: {
    backgroundColor: '#4b5563',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: '0 4px 15px rgba(75, 85, 99, 0.3)',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#9ca3af',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#6366f1',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#4f46e5',
    },
  },
};

export default Login;
