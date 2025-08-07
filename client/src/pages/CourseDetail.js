import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import axios from 'axios';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Video,
  FileText,
  HelpCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseDetail = ({ onNavigate }) => {
  const { user } = useAuth();
  const { trackContentView, trackVideoInteraction, trackProgressUpdate } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Mock course data for now
        const mockCourse = {
          id: 1,
          title: 'Introduction to Web Development',
          description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
          instructor: 'John Doe',
          totalLessons: 12,
          completedLessons: 9,
          progress: 75,
          image: 'https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=Web+Development',
          content: [
            {
              id: 1,
              title: 'HTML Basics',
              type: 'video',
              duration: '15 min',
              completed: true,
              videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE'
            },
            {
              id: 2,
              title: 'CSS Fundamentals',
              type: 'video',
              duration: '20 min',
              completed: true,
              videoUrl: 'https://www.youtube.com/embed/1PnVor36_40'
            },
            {
              id: 3,
              title: 'JavaScript Introduction',
              type: 'video',
              duration: '25 min',
              completed: false,
              videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk'
            },
            {
              id: 4,
              title: 'HTML Quiz',
              type: 'quiz',
              duration: '10 min',
              completed: false
            },
            {
              id: 5,
              title: 'CSS Quiz',
              type: 'quiz',
              duration: '10 min',
              completed: false
            }
          ]
        };

        setCourse(mockCourse);
        setCurrentContent(mockCourse.content[2]); // Start with JavaScript Introduction
        setProgress(mockCourse.progress);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  const handleContentClick = (content) => {
    setCurrentContent(content);
    trackContentView(course.id, content.id, content.title);
  };

  const handleVideoPlay = () => {
    trackVideoInteraction(course.id, currentContent.id, 'play');
  };

  const handleProgressUpdate = (newProgress) => {
    setProgress(newProgress);
    trackProgressUpdate(course.id, currentContent.id, newProgress, 0);
  };

  if (loading) {
    return <LoadingSpinner text="Loading course..." />;
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center space-x-4">
          <img 
            src={course.image} 
            alt={course.title}
            className="w-20 h-12 object-cover rounded"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600">by {course.instructor}</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{course.totalLessons} lessons</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-gray-600">{course.completedLessons} completed</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Content</h2>
          <div className="space-y-2">
            {course.content.map((content) => (
              <button
                key={content.id}
                onClick={() => handleContentClick(content)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  currentContent?.id === content.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {content.type === 'video' ? (
                      <Video className="h-5 w-5 text-blue-600" />
                    ) : (
                      <HelpCircle className="h-5 w-5 text-purple-600" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{content.title}</h3>
                      <p className="text-sm text-gray-600">{content.duration}</p>
                    </div>
                  </div>
                  {content.completed && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentContent?.title}
            </h2>
            
            {currentContent?.type === 'video' && (
              <div>
                <div className="aspect-video bg-gray-100 rounded-lg mb-4">
                  <iframe
                    src={currentContent.videoUrl}
                    title={currentContent.title}
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onPlay={handleVideoPlay}
                  ></iframe>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleProgressUpdate(Math.min(100, progress + 25))}
                    className="btn btn-primary"
                  >
                    Mark as Complete
                  </button>
                  <button
                    onClick={() => handleProgressUpdate(Math.max(0, progress - 25))}
                    className="btn btn-outline"
                  >
                    Reset Progress
                  </button>
                </div>
              </div>
            )}

            {currentContent?.type === 'quiz' && (
              <div className="text-center py-8">
                <HelpCircle className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz: {currentContent.title}</h3>
                <p className="text-gray-600 mb-4">Test your knowledge with interactive questions</p>
                <button className="btn btn-primary">
                  Start Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 