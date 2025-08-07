import React from 'react';

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
      <p>If you see this, React is loading correctly</p>
      <p>Environment: {process.env.NODE_ENV}</p>
      <p>API URL: {process.env.REACT_APP_API_URL || 'Not set'}</p>
      <p>✅ No React Router - Just pure React</p>
    </div>
  );
}

export default App; 