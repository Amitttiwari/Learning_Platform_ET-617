import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Hardcoded API URL - no environment variable needed
const API_URL = 'https://learning-platform-backend-knkr.onrender.com';

// Debug: Log hardcoded API URL
console.log('Hardcoded API URL:', API_URL);

// Simple Login Form Component
const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      console.log('Login successful!');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'blue', 
      color: 'white', 
      borderRadius: '10px',
      margin: '20px'
    }}>
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ margin: '10px 0' }}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ padding: '10px', width: '200px' }}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ padding: '10px', width: '200px' }}
          />
        </div>
        <button type="submit" style={{ 
          padding: '10px 20px', 
          backgroundColor: 'white', 
          color: 'blue',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Login
        </button>
      </form>
    </div>
  );
};

// Simple Register Form Component
const RegisterForm = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      console.log('Registration successful!');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'green', 
      color: 'white', 
      borderRadius: '10px',
      margin: '20px'
    }}>
      <h2>📝 Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ margin: '10px 0' }}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            style={{ padding: '10px', width: '200px' }}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ padding: '10px', width: '200px' }}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ padding: '10px', width: '200px' }}
          />
        </div>
        <button type="submit" style={{ 
          padding: '10px 20px', 
          backgroundColor: 'white', 
          color: 'green',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Register
        </button>
      </form>
    </div>
  );
};

// Main App Component
function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: 'red', 
      color: 'white', 
      fontSize: '24px',
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <h1>🚀 Learning Platform</h1>
      <p>API URL: {API_URL}</p>
      
      {isAuthenticated ? (
        <div>
          <p>✅ Welcome, {user?.username || user?.email}!</p>
          <button onClick={logout} style={{ 
            padding: '10px 20px', 
            backgroundColor: 'white', 
            color: 'red',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px'
          }}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>Please login or register to continue</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <LoginForm />
            <RegisterForm />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App; 