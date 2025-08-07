import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Hardcoded API URL - no environment variable needed
const API_URL = 'https://learning-platform-backend-knkr.onrender.com';

// Debug: Log hardcoded API URL
console.log('Hardcoded API URL:', API_URL);

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
    <p>API URL: {API_URL}</p>
    <p>✅ Hardcoded - No environment variables needed!</p>
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
    <p>API URL: {API_URL}</p>
    <p>✅ Backend connection ready!</p>
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