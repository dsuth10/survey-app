import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const usernameVal = formData.get('username');
    const passwordVal = formData.get('password');
    setError('');
    try {
      await login(usernameVal, passwordVal);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Survey App Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Username: </label>
          <input
            name="username"
            type="text"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Password: </label>
          <input
            name="password"
            type="password"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Login</button>
      </form>
    </div>
  );
}
