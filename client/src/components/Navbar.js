import React from 'react';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  User, 
  LogOut,
  Settings
} from 'lucide-react';

const Navbar = ({ currentPage, onNavigate, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: 'dashboard' },
    { id: 'courses', label: 'Courses', icon: BookOpen, path: 'course-detail' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: 'analytics' },
    { id: 'profile', label: 'Profile', icon: User, path: 'profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onNavigate('login');
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Learning Platform</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-slate-300">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.username || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 