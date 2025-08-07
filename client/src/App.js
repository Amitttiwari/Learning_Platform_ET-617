import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { Toaster } from 'react-hot-toast';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import CourseDetail from './pages/CourseDetail';
import ContentViewer from './pages/ContentViewer';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Debug: Log environment variables
console.log('Environment Check:', {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001'
});

// Simple test component
const TestComponent = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
      <h1>TEST - App is loading!</h1>
      <p>If you see this, the app is working</p>
    </div>
  );
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TestComponent />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/analytics" element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          } />
          <Route path="/courses/:courseId" element={
            <PrivateRoute>
              <CourseDetail />
            </PrivateRoute>
          } />
          <Route path="/courses/:courseId/content/:contentId" element={
            <PrivateRoute>
              <ContentViewer />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnalyticsProvider>
          <AppContent />
          <Toaster position="top-right" />
        </AnalyticsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 