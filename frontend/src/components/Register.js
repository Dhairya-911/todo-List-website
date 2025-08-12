import React, { useState } from 'react';
import API_BASE_URL from '../config/api';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'user'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onRegister(data.user);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="auth-container">
      <div style={styles.registerBox} className="auth-box">
        <h2 style={styles.title} className="auth-title">Create Account</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              className="auth-input"
              placeholder="Enter your full name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              className="auth-input"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
              className="auth-input"
              placeholder="Confirm your password"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            style={{...styles.submitButton, ...(loading ? styles.submitButtonDisabled : {})}}
            className="auth-button"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.loginLink}>
          <p>Already have an account?{' '}
            <button 
              type="button" 
              onClick={onSwitchToLogin}
              style={styles.linkButton}
            >
              Login here
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
  registerBox: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    padding: '3rem',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    width: '100%',
    maxWidth: '500px',
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
    color: '#cbd5e1',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '1rem',
    border: '2px solid rgba(99, 102, 241, 0.3)',
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
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
    backgroundColor: '#64748b',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: '0 4px 15px rgba(100, 116, 139, 0.3)',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#94a3b8',
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
      color: '#8b5cf6',
    },
  },
};

export default Register;
