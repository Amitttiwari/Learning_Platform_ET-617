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

// Simple Test Pages
const TestHome = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">🏠 Home Page</h1>
      <p className="text-gray-600 text-lg">Welcome to the Learning Platform</p>
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
        <ul className="text-left space-y-2">
          <li>✅ User Authentication</li>
          <li>✅ Course Management</li>
          <li>✅ Analytics Tracking</li>
          <li>✅ Progress Monitoring</li>
        </ul>
      </div>
    </div>
  </div>
);

const TestDashboard = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">📊 Dashboard</h1>
      <p className="text-gray-600 text-lg">Your learning progress</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Courses</h3>
          <p className="text-3xl font-bold text-blue-600">3</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Progress</h3>
          <p className="text-3xl font-bold text-green-600">75%</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Time</h3>
          <p className="text-3xl font-bold text-purple-600">2h</p>
        </div>
      </div>
    </div>
  </div>
);

const TestProfile = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">👤 Profile</h1>
      <p className="text-gray-600 text-lg">Your account information</p>
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <p className="text-lg font-semibold text-gray-900">testuser</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-lg font-semibold text-gray-900">test@example.com</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="text-lg font-semibold text-gray-900">August 2025</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TestAnalytics = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">📈 Analytics</h1>
      <p className="text-gray-600 text-lg">Your learning analytics</p>
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Learning Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Time Spent</h3>
            <p className="text-2xl font-bold text-blue-600">12 hours</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Courses Completed</h3>
            <p className="text-2xl font-bold text-green-600">2 of 3</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    console.log('Rendering page:', currentPage);
    
    try {
      switch (currentPage) {
        case 'home':
          return <TestHome />;
        case 'login':
          return <Login />;
        case 'register':
          return <Register />;
        case 'dashboard':
          return isAuthenticated ? <TestDashboard /> : <Login />;
        case 'profile':
          return isAuthenticated ? <TestProfile /> : <Login />;
        case 'analytics':
          return isAuthenticated ? <TestAnalytics /> : <Login />;
        default:
          return <TestHome />;
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