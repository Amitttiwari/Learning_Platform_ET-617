import React from 'react';

// Hardcoded API URL - no environment variable needed
const API_URL = 'https://learning-platform-backend-knkr.onrender.com';

// Debug: Log hardcoded API URL
console.log('Hardcoded API URL:', API_URL);

function App() {
  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: 'red', 
      color: 'white', 
      fontSize: '24px',
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <h1>🚀 APP IS WORKING!</h1>
      <p>React is loading correctly</p>
      <p>API URL: {API_URL}</p>
      <p>✅ No React Router - Just pure React</p>
      <p>✅ Backend connection ready</p>
      <p>✅ Ready to add features!</p>
    </div>
  );
}

export default App; 