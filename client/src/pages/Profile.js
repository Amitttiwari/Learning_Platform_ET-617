import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Award, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Target, 
  TrendingUp,
  Activity,
  FileText,
  Video,
  HelpCircle,
  BarChart3,
  Trophy,
  Star,
  Zap
} from 'lucide-react';
import axios from 'axios';

const Profile = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { trackButtonClick, trackPageView } = useAnalytics();
  
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded API URL
  const API_URL = 'https://learning-platform-backend-knkr.onrender.com';

  useEffect(() => {
    if (!user) {
      onNavigate('login');
      return;
    }

    trackPageView('Profile Page');
    fetchUserAnalytics();
  }, [user]);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch user's analytics data
      const response = await axios.get(`${API_URL}/api/analytics/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setUserAnalytics(response.data);
      
      // Fetch recent activity
      const activityResponse = await axios.get(`${API_URL}/api/analytics/user/events`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setRecentActivity(activityResponse.data.events || []);
      
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      // Set mock data for demo
      setUserAnalytics({
        total_events: 25,
        courses_viewed: 1,
        content_completed: 3,
        quizzes_taken: 2,
        average_quiz_score: 85,
        total_time_spent: 120,
        last_activity: new Date().toISOString()
      });
      setRecentActivity([
        {
          timestamp: new Date().toISOString(),
          event_name: 'Course viewed',
          description: 'Viewed Introduction to Web Development',
          component: 'Course'
        },
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          event_name: 'Quiz attempted',
          description: 'Completed HTML Quiz with score 85%',
          component: 'Quiz'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    trackButtonClick('Logout', 'Profile Page');
    logout();
    onNavigate('login');
  };

  const getActivityIcon = (component) => {
    switch (component) {
      case 'Course': return <BookOpen className="w-4 h-4" />;
      case 'Quiz': return <HelpCircle className="w-4 h-4" />;
      case 'Video': return <Play className="w-4 h-4" />;
      case 'Content': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (component) => {
    switch (component) {
      case 'Course': return 'text-blue-400';
      case 'Quiz': return 'text-green-400';
      case 'Video': return 'text-purple-400';
      case 'Content': return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">My Profile</h1>
                <p className="text-slate-400 text-sm">Track your learning journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn btn-ghost"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-slate-400">@{user?.username}</p>
                  <span className="badge badge-primary mt-2">{user?.role}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-300">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-300">Member since {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-300">Last active: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card">
                <div className="card-body text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{userAnalytics?.courses_viewed || 0}</p>
                  <p className="text-slate-400 text-sm">Courses Viewed</p>
                </div>
              </div>

              <div className="card">
                <div className="card-body text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{userAnalytics?.content_completed || 0}</p>
                  <p className="text-slate-400 text-sm">Content Completed</p>
                </div>
              </div>

              <div className="card">
                <div className="card-body text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{userAnalytics?.quizzes_taken || 0}</p>
                  <p className="text-slate-400 text-sm">Quizzes Taken</p>
                </div>
              </div>

              <div className="card">
                <div className="card-body text-center">
                  <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{userAnalytics?.average_quiz_score || 0}%</p>
                  <p className="text-slate-400 text-sm">Avg Quiz Score</p>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Learning Progress
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300">Overall Progress</span>
                      <span className="text-white font-medium">25%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300">Time Spent Learning</span>
                      <span className="text-white font-medium">{formatTime(userAnalytics?.total_time_spent || 0)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300">Activities Completed</span>
                      <span className="text-white font-medium">{userAnalytics?.total_events || 0}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentActivity.slice(0, 10).map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-slate-750 rounded-lg">
                      <div className={`w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center ${getActivityColor(activity.component)}`}>
                        {getActivityIcon(activity.component)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.event_name}</p>
                        <p className="text-slate-400 text-sm">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">{new Date(activity.timestamp).toLocaleDateString()}</p>
                        <p className="text-slate-500 text-xs">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                  
                  {recentActivity.length === 0 && (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">No recent activity yet. Start learning to see your progress!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-slate-750 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">First Course</p>
                      <p className="text-slate-400 text-sm">Completed your first course</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-slate-750 rounded-lg">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Quiz Master</p>
                      <p className="text-slate-400 text-sm">Scored 80%+ on a quiz</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-slate-750 rounded-lg opacity-50">
                    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Analytics Pro</p>
                      <p className="text-slate-500 text-sm">Track 50+ activities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-slate-750 rounded-lg opacity-50">
                    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Video Watcher</p>
                      <p className="text-slate-500 text-sm">Watch 10+ videos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile; 