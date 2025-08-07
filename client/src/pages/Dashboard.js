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
  Target,
  Eye,
  Video,
  HelpCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const { trackButtonClick } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, analyticsRes, eventsRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/analytics/user'),
          axios.get('/api/analytics/user/events')
        ]);

        setCourses(coursesRes.data.courses || []);
        setAnalytics(analyticsRes.data);
        setUserEvents(eventsRes.data.events || []);
        
        // Generate recent activity from user events
        const activities = generateRecentActivity(eventsRes.data.events || []);
        setRecentActivity(activities);
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
        
        // Mock recent activity based on clickstream data
        const mockActivities = [
          {
            id: 1,
            type: 'course_viewed',
            title: 'Introduction to Web Development',
            time: '2 hours ago',
            icon: Eye,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            id: 2,
            type: 'video_watched',
            title: 'HTML Basics Video',
            time: '1 hour ago',
            icon: Video,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          {
            id: 3,
            type: 'quiz_completed',
            title: 'HTML Quiz - Score: 85%',
            time: '30 minutes ago',
            icon: HelpCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          },
          {
            id: 4,
            type: 'progress_updated',
            title: 'CSS Fundamentals - 75% Complete',
            time: '15 minutes ago',
            icon: CheckCircle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
          },
          {
            id: 5,
            type: 'page_viewed',
            title: 'Analytics Dashboard',
            time: '5 minutes ago',
            icon: BarChart3,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100'
          }
        ];
        setRecentActivity(mockActivities);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const generateRecentActivity = (events) => {
    const activities = [];
    const now = new Date();
    
    events.slice(0, 10).forEach((event, index) => {
      const eventTime = new Date(event.timestamp);
      const timeDiff = Math.floor((now - eventTime) / (1000 * 60)); // minutes ago
      
      let timeAgo;
      if (timeDiff < 1) timeAgo = 'Just now';
      else if (timeDiff < 60) timeAgo = `${timeDiff} minutes ago`;
      else if (timeDiff < 1440) timeAgo = `${Math.floor(timeDiff / 60)} hours ago`;
      else timeAgo = `${Math.floor(timeDiff / 1440)} days ago`;

      let activity = {
        id: index + 1,
        type: event.event_type,
        title: getActivityTitle(event),
        time: timeAgo,
        icon: getActivityIcon(event.event_type),
        color: getActivityColor(event.event_type),
        bgColor: getActivityBgColor(event.event_type)
      };
      
      activities.push(activity);
    });
    
    return activities;
  };

  const getActivityTitle = (event) => {
    switch (event.event_type) {
      case 'page_view':
        return `${event.context || 'Page'} Viewed`;
      case 'content_view':
        return `${event.content_title || 'Content'} Viewed`;
      case 'video_interaction':
        return `${event.content_title || 'Video'} - ${event.action || 'Interaction'}`;
      case 'quiz_completed':
        return `Quiz Completed - Score: ${event.score || 'N/A'}%`;
      case 'progress_update':
        return `${event.content_title || 'Content'} - ${event.progress_percentage || 0}% Complete`;
      case 'button_click':
        return `${event.button_name || 'Button'} Clicked`;
      case 'form_submission':
        return `${event.form_name || 'Form'} Submitted`;
      default:
        return event.event_type || 'Activity';
    }
  };

  const getActivityIcon = (eventType) => {
    switch (eventType) {
      case 'page_view':
        return Eye;
      case 'content_view':
        return BookOpen;
      case 'video_interaction':
        return Video;
      case 'quiz_completed':
        return HelpCircle;
      case 'progress_update':
        return CheckCircle;
      case 'button_click':
        return TrendingUp;
      case 'form_submission':
        return Award;
      default:
        return Eye;
    }
  };

  const getActivityColor = (eventType) => {
    switch (eventType) {
      case 'page_view':
        return 'text-blue-600';
      case 'content_view':
        return 'text-green-600';
      case 'video_interaction':
        return 'text-purple-600';
      case 'quiz_completed':
        return 'text-orange-600';
      case 'progress_update':
        return 'text-indigo-600';
      case 'button_click':
        return 'text-red-600';
      case 'form_submission':
        return 'text-teal-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActivityBgColor = (eventType) => {
    switch (eventType) {
      case 'page_view':
        return 'bg-blue-100';
      case 'content_view':
        return 'bg-green-100';
      case 'video_interaction':
        return 'bg-purple-100';
      case 'quiz_completed':
        return 'bg-orange-100';
      case 'progress_update':
        return 'bg-indigo-100';
      case 'button_click':
        return 'bg-red-100';
      case 'form_submission':
        return 'bg-teal-100';
      default:
        return 'bg-gray-100';
    }
  };

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
              <div className={`p-2 rounded-full ${activity.bgColor}`}>
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
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