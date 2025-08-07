import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnalytics } from '../contexts/AnalyticsContext';
import axios from 'axios';
import { 
  BookOpen, 
  Play, 
  CheckCircle,
  Clock,
  User,
  ArrowRight,
  FileText,
  Video,
  HelpCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { trackCourseView, trackButtonClick } = useAnalytics();
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}`);
      setCourse(response.data.course);
      setContent(response.data.content);
      
      // Track course view
      trackCourseView(courseId, response.data.course.title);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (contentItem) => {
    trackButtonClick('Content Item', 'Course Detail', {
      contentId: contentItem.id,
      contentType: contentItem.content_type,
      contentTitle: contentItem.title
    });
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case 'text':
        return FileText;
      case 'video':
        return Video;
      case 'quiz':
        return HelpCircle;
      default:
        return BookOpen;
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress > 50) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  if (loading) {
    return <LoadingSpinner text="Loading course..." />;
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <Link to="/courses" className="btn btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const completedContent = content.filter(item => item.user_completed).length;
  const totalContent = content.length;
  const overallProgress = totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-primary-100 mb-4">{course.description}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{course.instructor_name}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{content.length} modules</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{course.difficulty_level}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{overallProgress}%</div>
              <div className="text-primary-100 text-sm">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Course Progress</span>
          <span className="text-sm text-gray-500">{completedContent} of {totalContent} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
          <div className="space-y-4">
            {content.map((contentItem, index) => {
              const Icon = getContentIcon(contentItem.content_type);
              const progressColor = getProgressColor(contentItem.user_progress);
              
              return (
                <div key={contentItem.id} className="card card-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-500">
                            Module {index + 1}
                          </span>
                          {contentItem.user_completed && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {contentItem.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {contentItem.content_type.charAt(0).toUpperCase() + contentItem.content_type.slice(1)} content
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {contentItem.user_progress}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${progressColor}`}
                            style={{ width: `${contentItem.user_progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/courses/${courseId}/content/${contentItem.id}`}
                        className="btn btn-primary flex items-center"
                        onClick={() => handleContentClick(contentItem)}
                      >
                        {contentItem.user_completed ? 'Review' : 'Start'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                <p className="text-sm text-gray-900">{course.category}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Difficulty</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {course.difficulty_level}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Instructor</h4>
                <p className="text-sm text-gray-900">{course.instructor_name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Created</h4>
                <p className="text-sm text-gray-900">
                  {new Date(course.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Modules Completed</span>
                <span className="text-sm font-medium text-gray-900">
                  {completedContent} / {totalContent}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Score</span>
                <span className="text-sm font-medium text-gray-900">
                  {content.reduce((sum, item) => sum + (item.user_progress || 0), 0) / content.length || 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Time Spent</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(content.reduce((sum, item) => sum + (item.user_time_spent || 0), 0) / 60)} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 