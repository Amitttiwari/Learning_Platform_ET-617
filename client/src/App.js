import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import CourseDetail from './pages/CourseDetail';
import AdminDashboard from './pages/AdminDashboard';

// Hardcoded API URL for deployment
const API_URL = 'https://learning-platform-backend-knkr.onrender.com';

const AppContent = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  const onNavigate = (page) => {
    setCurrentPage(page);
  };

  // Role-based routing
  const renderPage = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner w-12 h-12 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      );
    }

    // Admin users go directly to admin dashboard
    if (isAuthenticated && user?.role === 'admin') {
      return <AdminDashboard onNavigate={onNavigate} />;
    }

    // Regular users see normal pages
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={onNavigate} />;
      case 'login':
        return <Login onNavigate={onNavigate} />;
      case 'register':
        return <Register onNavigate={onNavigate} />;
      case 'dashboard':
        return isAuthenticated ? <Dashboard onNavigate={onNavigate} /> : <Login onNavigate={onNavigate} />;
      case 'profile':
        return isAuthenticated ? <Profile onNavigate={onNavigate} /> : <Login onNavigate={onNavigate} />;
      case 'analytics':
        return isAuthenticated ? <Analytics onNavigate={onNavigate} /> : <Login onNavigate={onNavigate} />;
      case 'course':
        return isAuthenticated ? <CourseDetail onNavigate={onNavigate} /> : <Login onNavigate={onNavigate} />;
      default:
        return <Home onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #475569',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f8fafc',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f8fafc',
            },
          },
        }}
      />
      {renderPage()}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <AppContent />
      </AnalyticsProvider>
    </AuthProvider>
  );
};

export default App; 