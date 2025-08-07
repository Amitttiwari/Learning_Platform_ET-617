import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import axios from 'axios';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  Award,
  Activity,
  Eye,
  Video,
  HelpCircle,
  CheckCircle,
  MousePointer
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics = () => {
  const { trackButtonClick } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [clickstreamData, setClickstreamData] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsRes, eventsRes] = await Promise.all([
        axios.get(`/api/analytics/user?period=${selectedPeriod}`),
        axios.get('/api/analytics/user/events')
      ]);

      setAnalyticsData(analyticsRes.data);
      setClickstreamData(eventsRes.data.events || []);
      
      // Generate event type statistics
      const eventTypeStats = generateEventTypeStats(eventsRes.data.events || []);
      setEventTypes(eventTypeStats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set mock data
      setAnalyticsData({
        summary: {
          totalEvents: 45,
          totalTimeSpent: 12,
          averageScore: 85,
          coursesCompleted: 2,
          totalCourses: 3
        },
        events: {
          pageViews: 15,
          contentViews: 12,
          videoInteractions: 8,
          quizAttempts: 5,
          buttonClicks: 5
        }
      });
      
      const mockClickstream = [
        {
          id: 1,
          event_type: 'page_view',
          context: 'Dashboard',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          user_id: 1,
          session_id: 'session_1'
        },
        {
          id: 2,
          event_type: 'content_view',
          content_title: 'HTML Basics',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          user_id: 1,
          session_id: 'session_1'
        },
        {
          id: 3,
          event_type: 'video_interaction',
          content_title: 'CSS Fundamentals',
          action: 'play',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          user_id: 1,
          session_id: 'session_1'
        },
        {
          id: 4,
          event_type: 'quiz_completed',
          content_title: 'HTML Quiz',
          score: 85,
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          user_id: 1,
          session_id: 'session_1'
        },
        {
          id: 5,
          event_type: 'progress_update',
          content_title: 'JavaScript Introduction',
          progress_percentage: 75,
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          user_id: 1,
          session_id: 'session_1'
        }
      ];
      
      setClickstreamData(mockClickstream);
      setEventTypes(generateEventTypeStats(mockClickstream));
    } finally {
      setLoading(false);
    }
  };

  const generateEventTypeStats = (events) => {
    const stats = {};
    events.forEach(event => {
      if (!stats[event.event_type]) {
        stats[event.event_type] = 0;
      }
      stats[event.event_type]++;
    });
    
    return Object.entries(stats).map(([type, count]) => ({
      type,
      count,
      icon: getEventIcon(type),
      color: getEventColor(type)
    }));
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'page_view':
        return Eye;
      case 'content_view':
        return Activity;
      case 'video_interaction':
        return Video;
      case 'quiz_completed':
        return HelpCircle;
      case 'progress_update':
        return CheckCircle;
      case 'button_click':
        return MousePointer;
      default:
        return Activity;
    }
  };

  const getEventColor = (eventType) => {
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
      default:
        return 'text-gray-600';
    }
  };

  const handleExport = async () => {
    try {
      trackButtonClick('Export Analytics', 'Analytics', { period: selectedPeriod });

      const response = await axios.get('/api/analytics/export?format=csv', {
        responseType: 'blob'
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clickstream_analytics_${selectedPeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      // Create mock CSV export
      const csvContent = generateMockCSV();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clickstream_analytics_${selectedPeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  };

  const generateMockCSV = () => {
    const headers = ['Timestamp', 'Event Type', 'Context', 'Content Title', 'Action', 'Score', 'Progress %', 'User ID', 'Session ID'];
    const rows = clickstreamData.map(event => [
      new Date(event.timestamp).toLocaleString(),
      event.event_type,
      event.context || '',
      event.content_title || '',
      event.action || '',
      event.score || '',
      event.progress_percentage || '',
      event.user_id,
      event.session_id
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  if (loading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Analytics</h1>
            <p className="text-gray-600">Track your learning progress and interactions</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={handleExport}
              className="btn btn-primary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.summary?.totalEvents || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hours Learned</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.summary?.totalTimeSpent || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.summary?.averageScore || 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Courses Completed</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.summary?.coursesCompleted || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Event Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventTypes.map((eventType, index) => (
            <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
              <div className={`p-2 rounded-full bg-gray-100`}>
                <eventType.icon className={`h-5 w-5 ${eventType.color}`} />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900 capitalize">{eventType.type.replace('_', ' ')}</p>
                <p className="text-sm text-gray-600">{eventType.count} events</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clickstream Data */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Clickstream Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clickstreamData.slice(0, 10).map((event, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getEventColor(event.event_type).replace('text-', 'bg-').replace('-600', '-100')} ${getEventColor(event.event_type)}`}>
                      {event.event_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.context || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.content_title || event.action || '-'}
                    {event.score && ` (Score: ${event.score}%)`}
                    {event.progress_percentage && ` (Progress: ${event.progress_percentage}%)`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 