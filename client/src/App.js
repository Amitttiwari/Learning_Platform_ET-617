import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Debug: Log environment variables
console.log('Environment Check:', {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001'
});

// Simple Home component
const Home = () => (
  <div style={{ 
    padding: '50px', 
    backgroundColor: 'green', 
    color: 'white', 
    fontSize: '24px',
    textAlign: 'center',
    minHeight: '100vh'
  }}>
    <h1>🏠 HOME PAGE</h1>
    <p>React Router is working!</p>
    <p>Environment: {process.env.NODE_ENV}</p>
    <p>API URL: {process.env.REACT_APP_API_URL || 'Not set'}</p>
  </div>
);

// Simple Login component
const Login = () => (
  <div style={{ 
    padding: '50px', 
    backgroundColor: 'blue', 
    color: 'white', 
    fontSize: '24px',
    textAlign: 'center',
    minHeight: '100vh'
  }}>
    <h1>🔐 LOGIN PAGE</h1>
    <p>Login page is working!</p>
    <p>API URL: {process.env.REACT_APP_API_URL || 'Not set'}</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App; 