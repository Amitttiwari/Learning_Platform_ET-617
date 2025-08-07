import React, { useState } from 'react';
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

// Import components
import LoadingSpinner from './components/LoadingSpinner';

// Hardcoded API URL - no environment variable needed
const API_URL = 'https://learning-platform-backend-knkr.onrender.com';

// Debug: Log hardcoded API URL
console.log('Hardcoded API URL:', API_URL);

// Simple Navigation Component
const Navigation = ({ currentPage, setCurrentPage, isAuthenticated, logout }) => {
  return (
    <nav className="bg-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">🚀 Learning Platform</h1>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'home' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setCurrentPage('profile')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Profile
                </button>
                <button 
                  onClick={() => setCurrentPage('analytics')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'analytics' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Analytics
                </button>
                <button 
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setCurrentPage('login')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'login' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setCurrentPage('register')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'register' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main App Component
function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    console.log('Rendering page:', currentPage);
    
    try {
      switch (currentPage) {
        case 'home':
          return <Home onNavigate={setCurrentPage} />;
        case 'login':
          return <Login onNavigate={setCurrentPage} />;
        case 'register':
          return <Register onNavigate={setCurrentPage} />;
        case 'dashboard':
          return isAuthenticated ? <Dashboard /> : <Login onNavigate={setCurrentPage} />;
        case 'profile':
          return isAuthenticated ? <Profile /> : <Login onNavigate={setCurrentPage} />;
        case 'analytics':
          return isAuthenticated ? <Analytics /> : <Login onNavigate={setCurrentPage} />;
        default:
          return <Home onNavigate={setCurrentPage} />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Error Loading Page</h1>
            <p className="text-gray-600">There was an error loading this page.</p>
            <button 
              onClick={() => setCurrentPage('home')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <AppContent />
        <Toaster position="top-right" />
      </AnalyticsProvider>
    </AuthProvider>
  );
}

export default App; 