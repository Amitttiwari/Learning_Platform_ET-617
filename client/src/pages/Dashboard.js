import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import axios from 'axios';
import { 
  BookOpen, 
  BarChart3, 
  Clock, 
  Award,
  TrendingUp,
  Play,
  CheckCircle,
  Calendar,
  Target
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const { trackButtonClick } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, analyticsRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/analytics/user')
        ]);

        setCourses(coursesRes.data.courses || []);
        setAnalytics(analyticsRes.data);
        
        // Mock recent activity for now
        setRecentActivity([
          {
            id: 1,
            type: 'course_completed',
            title: 'Introduction to Web Development',
            time: '2 hours ago',
            icon: CheckCircle
          },
          {
            id: 2,
            type: 'quiz_taken',
            title: 'HTML Basics Quiz',
            time: '1 day ago',
            icon: Award
          },
          {
            id: 3,
            type: 'course_started',
            title: 'CSS Fundamentals',
            time: '3 days ago',
            icon: Play
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuickAction = (action) => {
    trackButtonClick(`Dashboard - ${action}`, 'Dashboard', { action });
  };

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  const stats = [
    {
      title: 'Courses Enrolled',
      value: courses.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Hours Learned',
      value: analytics?.summary?.totalTimeSpent || 0,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Average Score',
      value: `${analytics?.summary?.averageScore || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Achievements',
      value: analytics?.summary?.achievements || 0,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username || user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Continue your learning journey and track your progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Continue Learning */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
          {courses.length > 0 ? (
            <div className="space-y-3">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.instructor_name}</p>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn btn-primary text-sm"
                    onClick={() => handleQuickAction('Continue Course')}
                  >
                    Continue
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses enrolled yet</p>
              <Link
                to="/courses"
                className="btn btn-primary"
                onClick={() => handleQuickAction('Browse Courses')}
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <activity.icon className="h-5 w-5 text-primary-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/courses"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => handleQuickAction('Browse Courses')}
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-primary-600" />
                <span className="font-medium">Browse Courses</span>
              </div>
              <Play className="h-4 w-4 text-gray-400" />
            </Link>
            
            <Link
              to="/analytics"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => handleQuickAction('View Analytics')}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-primary-600" />
                <span className="font-medium">View Analytics</span>
              </div>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => handleQuickAction('Edit Profile')}
            >
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-primary-600" />
                <span className="font-medium">Edit Profile</span>
              </div>
              <Target className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Learning Goals */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Weekly Goal</h4>
            <p className="text-2xl font-bold text-blue-600">5 hours</p>
            <p className="text-sm text-gray-600 mt-2">3.2 hours completed</p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '64%' }}></div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Monthly Goal</h4>
            <p className="text-2xl font-bold text-green-600">2 courses</p>
            <p className="text-sm text-gray-600 mt-2">1 course completed</p>
            <div className="w-full bg-green-200 rounded-full h-2 mt-3">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Target Score</h4>
            <p className="text-2xl font-bold text-purple-600">85%</p>
            <p className="text-sm text-gray-600 mt-2">Current: 78%</p>
            <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 