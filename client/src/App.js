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

// Hardcoded API URL - no environment variable needed
const API_URL = 'https://learning-platform-backend-knkr.onrender.com';

// Debug: Log hardcoded API URL
console.log('Hardcoded API URL:', API_URL);

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Main App Component
function AppContent() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
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