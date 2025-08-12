import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { 
  Users, 
  Activity, 
  Download, 
  Eye, 
  BarChart3, 
  Calendar,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  UserCheck,
  Clock,
  FileText,
  ArrowUpRight
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { trackButtonClick, trackPageView } = useAnalytics();
  
  const [summary, setSummary] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    user_id: '',
    event_type: '',
    start_date: '',
    end_date: ''
  });

  // Hardcoded API URL
  const API_URL = 'https://learning-platform-backend-knkr.onrender.com';

  useEffect(() => {
    if (user?.role !== 'admin') {
      onNavigate('login');
      return;
    }

    trackPageView('Admin Dashboard');
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch summary data
      const summaryResponse = await axios.get(`${API_URL}/api/analytics/admin/summary`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSummary(summaryResponse.data.summary);

      // Fetch all users
      const usersResponse = await axios.get(`${API_URL}/api/analytics/admin/all-users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllUsers(usersResponse.data.users);

      // Fetch all events
      const eventsResponse = await axios.get(`${API_URL}/api/analytics/admin/all-events`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllEvents(eventsResponse.data.events);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    try {
      trackButtonClick('Export All Analytics', 'Admin Dashboard');
      
      console.log('Exporting data from:', `${API_URL}/api/analytics/admin/export-all`);
      
      const response = await axios.get(`${API_URL}/api/analytics/admin/export-all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });

      console.log('Export response received:', response.status, response.data);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `all_analytics_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('CSV download initiated successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleLogout = () => {
    trackButtonClick('Admin Logout', 'Admin Dashboard');
    logout();
    onNavigate('login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-600';
      case 'instructor': return 'bg-blue-600';
      case 'learner': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading admin dashboard...</p>
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
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400 text-sm">Welcome back, {user?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportAll}
                className="btn btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export All Data
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-ghost"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'All Users', icon: Users },
              { id: 'events', label: 'All Events', icon: Activity },
              { id: 'export', label: 'Export', icon: Download }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{summary?.total_users || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Total Events</p>
                    <p className="text-2xl font-bold text-white">{summary?.total_events || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Event Types</p>
                    <p className="text-2xl font-bold text-white">{summary?.event_types?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-slate-400 text-sm">Recent Activity</p>
                    <p className="text-2xl font-bold text-white">{summary?.recent_activity?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </h2>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {summary?.recent_activity?.slice(0, 10).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-750 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{activity.username}</p>
                          <p className="text-slate-400 text-sm">{activity.event_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-sm">{activity.timestamp}</p>
                        <p className="text-slate-500 text-xs">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Users
              </h2>
            </div>
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Total Events</th>
                      <th>Last Activity</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <tr key={user.user_id}>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${getRoleColor(user.role)} rounded-full flex items-center justify-center`}>
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.username}</p>
                              <p className="text-slate-400 text-sm">{user.first_name} {user.last_name}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="text-slate-300">{user.email}</td>
                        <td className="text-slate-300">{user.total_events}</td>
                        <td className="text-slate-300">{user.last_activity || 'Never'}</td>
                        <td className="text-slate-300">{user.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                All Events
              </h2>
            </div>
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Event</th>
                      <th>Component</th>
                      <th>Description</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allEvents.slice(0, 50).map((event, index) => (
                      <tr key={index}>
                        <td className="text-slate-300 text-sm">{event.timestamp}</td>
                        <td className="text-slate-300">{event.username}</td>
                        <td>
                          <span className="badge badge-primary">
                            {event.event_name}
                          </span>
                        </td>
                        <td className="text-slate-300">{event.component}</td>
                        <td className="text-slate-300 max-w-xs truncate">{event.description}</td>
                        <td className="text-slate-300 text-sm">{event.ip_address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Data
              </h2>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                <div className="bg-slate-750 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Export All Analytics Data</h3>
                  <p className="text-slate-400 mb-4">
                    Download a comprehensive CSV file containing all user analytics data including:
                  </p>
                  <ul className="text-slate-400 space-y-2 mb-6">
                    <li>• All user events and interactions</li>
                    <li>• Course views and progress</li>
                    <li>• Quiz attempts and scores</li>
                    <li>• Navigation patterns</li>
                    <li>• Error tracking</li>
                    <li>• User demographics and activity</li>
                  </ul>
                  <button
                    onClick={handleExportAll}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Complete Analytics CSV
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-750 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Data Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Users:</span>
                        <span className="text-white font-medium">{summary?.total_users || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Events:</span>
                        <span className="text-white font-medium">{summary?.total_events || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Event Types:</span>
                        <span className="text-white font-medium">{summary?.event_types?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-750 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Top Event Types</h3>
                    <div className="space-y-2">
                      {summary?.event_types?.slice(0, 5).map((eventType, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">{eventType.event_name}</span>
                          <span className="text-white font-medium">{eventType.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard; 