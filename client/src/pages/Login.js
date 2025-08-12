import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';

const Login = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { trackFormSubmission, trackButtonClick } = useAnalytics();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Track form submission
    trackFormSubmission('login', 'Login Page');
    
    try {
      const result = await login(formData);
      if (result.success) {
        onNavigate('dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    trackButtonClick('Register Link', 'Login Page');
    onNavigate('register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to continue your learning journey</p>
        </div>

        {/* Login Form */}
        <div className="card glass">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-600"></div>
            <span className="px-4 text-slate-400 text-sm">or</span>
            <div className="flex-1 border-t border-slate-600"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-slate-400 mb-4">
              Don't have an account?{' '}
              <button
                onClick={handleRegisterClick}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Create one here
              </button>
            </p>
          </div>

          {/* Test Credentials */}
          <div className="mt-6 p-4 bg-slate-750 rounded-lg border border-slate-600">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Test Credentials:</h3>
            <div className="text-xs text-slate-400 space-y-1">
              <p><strong>🔴 Admin (View All Users):</strong> admin / admin123</p>
              <p><strong>🟢 Learner:</strong> ashwani / learner123</p>
              <p><strong>🟡 Instructor:</strong> instructor / instructor123</p>
            </div>
            <div className="mt-3 p-2 bg-blue-900/20 border border-blue-600/30 rounded text-xs text-blue-300">
              <strong>💡 Admin Tip:</strong> Login as admin to see ALL user activities, clickstream data, and export everything to CSV!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            © 2024 Learning Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 