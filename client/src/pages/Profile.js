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
  TrendingUp,
  Target
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const { trackButtonClick } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Mock profile data based on user
        const mockProfileData = {
          user: {
            id: user?.id || 1,
            username: user?.username || 'ashwani',
            email: user?.email || 'ashwani@example.com',
            firstName: user?.firstName || 'Ashwani',
            lastName: user?.lastName || 'User',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
            lastLogin: new Date().toISOString()
          },
          stats: {
            totalCourses: 3,
            completedCourses: 2,
            totalTimeSpent: 12,
            averageScore: 85,
            quizzesTaken: 5,
            videosWatched: 8
          },
          achievements: [
            {
              id: 1,
              title: 'First Course Completed',
              description: 'Completed your first course',
              icon: Award,
              earned: true,
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 2,
              title: 'Quiz Master',
              description: 'Scored 90% or higher on 3 quizzes',
              icon: TrendingUp,
              earned: true,
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 3,
              title: 'Video Watcher',
              description: 'Watched 10 videos',
              icon: BookOpen,
              earned: true,
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 4,
              title: 'Learning Streak',
              description: 'Learned for 7 consecutive days',
              icon: Target,
              earned: false
            }
          ],
          recentActivity: [
            {
              id: 1,
              type: 'course_completed',
              title: 'Introduction to Web Development',
              time: '2 hours ago'
            },
            {
              id: 2,
              type: 'quiz_taken',
              title: 'HTML Quiz - Score: 85%',
              time: '1 day ago'
            },
            {
              id: 3,
              type: 'video_watched',
              title: 'CSS Fundamentals Video',
              time: '3 days ago'
            }
          ]
        };

        setProfileData(mockProfileData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleEditProfile = () => {
    trackButtonClick('Edit Profile', 'Profile');
    // Add edit profile functionality here
  };

  const handleChangePassword = () => {
    trackButtonClick('Change Password', 'Profile');
    // Add change password functionality here
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and view your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profileData.user.firstName} {profileData.user.lastName}
                </h2>
                <p className="text-gray-600">@{profileData.user.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{profileData.user.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {new Date(profileData.user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {new Date(profileData.user.lastLogin).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleEditProfile}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
              <button
                onClick={handleChangePassword}
                className="btn btn-outline"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Learning Statistics */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profileData.stats.totalCourses}</p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profileData.stats.completedCourses}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profileData.stats.totalTimeSpent}h</p>
                <p className="text-sm text-gray-600">Hours Learned</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profileData.stats.averageScore}%</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profileData.stats.quizzesTaken}</p>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-teal-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profileData.stats.videosWatched}</p>
                <p className="text-sm text-gray-600">Videos Watched</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {profileData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Achievements</h3>
            <div className="space-y-4">
              {profileData.achievements.map((achievement) => (
                <div key={achievement.id} className={`p-4 rounded-lg border ${
                  achievement.earned 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <achievement.icon className={`h-5 w-5 ${
                        achievement.earned ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-green-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-green-700' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-green-600 mt-1">
                          Earned {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 