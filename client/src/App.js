import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Hardcoded API URL - no environment variable needed
const API_URL = 'https://learning-platform-backend-knkr.onrender.com';

// Debug: Log hardcoded API URL
console.log('Hardcoded API URL:', API_URL);

// Styled Login Form Component
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
    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔐 Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

// Styled Register Form Component
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
    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
        >
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🚀 Learning Platform</h1>
          <p className="text-gray-600 text-lg">Interactive learning with analytics tracking</p>
        </div>
        
        {isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">✅ Welcome back!</h2>
              <p className="text-gray-600 mb-6">Hello, {user?.username || user?.email}!</p>
              <button 
                onClick={logout} 
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200 font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Started</h2>
              <p className="text-gray-600">Create an account or sign in to access your courses</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
              <LoginForm />
              <RegisterForm />
            </div>
          </div>
        )}
      </div>
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