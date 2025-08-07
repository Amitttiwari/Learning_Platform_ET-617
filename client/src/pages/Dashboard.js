import React, { useState, useEffect } from 'react';
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

const Dashboard = ({ onNavigate }) => {
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
        // Set mock data if API fails
        setCourses([
          {
            id: 1,
            title: 'Introduction to Web Development',
            description: 'Learn the basics of HTML, CSS, and JavaScript',
            instructor: 'John Doe',
            progress: 75,
            totalLessons: 12,
            completedLessons: 9,
            image: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Web+Dev'
          },
          {
            id: 2,
            title: 'Advanced JavaScript',
            description: 'Master JavaScript programming concepts',
            instructor: 'Jane Smith',
            progress: 45,
            totalLessons: 15,
            completedLessons: 7,
            image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=JavaScript'
          }
        ]);
        setAnalytics({
          summary: {
            totalTimeSpent: 12,
            averageScore: 85,
            coursesCompleted: 2,
            totalCourses: 3
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuickAction = (action) => {
    trackButtonClick(`Dashboard - ${action}`, 'Dashboard', { action });
  };

  const handleCourseClick = (courseId) => {
    trackButtonClick('Course Clicked', 'Dashboard', { courseId });
    if (onNavigate) {
      onNavigate('course-detail');
    }
  };

  const handleContinueLearning = (courseId) => {
    trackButtonClick('Continue Learning', 'Dashboard', { courseId });
    if (onNavigate) {
      onNavigate('course-detail');
    }
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
      title: 'Courses Completed',
      value: analytics?.summary?.coursesCompleted || 0,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const quickActions = [
    {
      title: 'Browse Courses',
      description: 'Discover new courses',
      icon: BookOpen,
      action: 'browse_courses',
      color: 'bg-blue-500'
    },
    {
      title: 'View Analytics',
      description: 'Check your progress',
      icon: BarChart3,
      action: 'view_analytics',
      color: 'bg-green-500'
    },
    {
      title: 'Take Quiz',
      description: 'Test your knowledge',
      icon: Award,
      action: 'take_quiz',
      color: 'bg-purple-500'
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
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

      {/* Continue Learning */}
      {courses.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Learning</h2>
          <div className="space-y-4">
            {courses.slice(0, 2).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.instructor}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{course.progress}%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleContinueLearning(course.id)}
                  className="btn btn-primary"
                >
                  Continue
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <activity.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 