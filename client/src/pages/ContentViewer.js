import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnalytics } from '../contexts/AnalyticsContext';
import axios from 'axios';
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Pause,
  CheckCircle,
  Clock,
  FileText,
  Video,
  HelpCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ContentViewer = () => {
  const { courseId, contentId } = useParams();
  const { trackContentView, trackVideoInteraction, trackQuizInteraction, trackProgressUpdate } = useAnalytics();
  const [content, setContent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isProgressMarked, setIsProgressMarked] = useState(false);

  useEffect(() => {
    fetchContent();
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [contentId]);

  useEffect(() => {
    if (content) {
      trackContentView(contentId, content.content_type, content.title, courseId);
    }
  }, [content]);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/content/${contentId}`);
      setContent(response.data.content);
      if (response.data.questions) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoInteraction = (action) => {
    trackVideoInteraction(contentId, action, {
      title: content.title,
      videoUrl: content.video_url
    });
  };

  const handleQuizSubmit = async () => {
    try {
      const response = await axios.post(`/api/courses/${courseId}/content/${contentId}/quiz-submit`, {
        answers,
        timeTaken: timeSpent
      });
      
      setQuizScore(response.data);
      setQuizSubmitted(true);
      
      trackQuizInteraction(contentId, 'completed', {
        score: response.data.score,
        totalQuestions: response.data.totalQuestions,
        correctAnswers: response.data.correctAnswers
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const updateProgress = async (progressPercentage) => {
    try {
      await axios.post(`/api/courses/${courseId}/content/${contentId}/progress`, {
        progressPercentage,
        timeSpent,
        completed: progressPercentage === 100
      });
      
      trackProgressUpdate(courseId, contentId, progressPercentage, timeSpent);
      setIsProgressMarked(true);
      
      // Update the content state to reflect the new progress
      setContent(prev => ({
        ...prev,
        user_progress: progressPercentage
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const resetProgress = async () => {
    try {
      await axios.post(`/api/courses/${courseId}/content/${contentId}/progress`, {
        progressPercentage: 0,
        timeSpent: 0,
        completed: false
      });
      
      trackProgressUpdate(courseId, contentId, 0, 0);
      setIsProgressMarked(false);
      
      // Update the content state to reflect the reset progress
      setContent(prev => ({
        ...prev,
        user_progress: 0
      }));
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading content..." />;
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content not found</h1>
          <Link to={`/courses/${courseId}`} className="btn btn-primary">
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (content.content_type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              {content.content_data && (
                <div dangerouslySetInnerHTML={{ 
                  __html: JSON.parse(content.content_data).text.replace(/\n/g, '<br>') 
                }} />
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="bg-black rounded-lg overflow-hidden">
              <iframe
                src={content.video_url}
                title={content.title}
                className="w-full h-96"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => handleVideoInteraction('loaded')}
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleVideoInteraction('play')}
                className="btn btn-outline flex items-center"
              >
                <Play className="h-4 w-4 mr-2" />
                Play
              </button>
              <button
                onClick={() => handleVideoInteraction('pause')}
                className="btn btn-outline flex items-center"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </button>
            </div>
          </div>
        );

      case 'quiz':
        if (quizSubmitted) {
          return (
            <div className="text-center py-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                <p className="text-gray-600 mb-4">Great job completing the quiz</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="card text-center">
                  <div className="text-2xl font-bold text-primary-600">{quizScore.score}%</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-green-600">{quizScore.correctAnswers}/{quizScore.totalQuestions}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(quizScore.timeTaken / 60)}m</div>
                  <div className="text-sm text-gray-600">Time</div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="text-sm text-gray-600">
                Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {questions[currentQuestion]?.question_text}
              </h3>
              
              <div className="space-y-3">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={`question-${questions[currentQuestion].id}`}
                      value={option}
                      checked={answers[questions[currentQuestion].id] === option}
                      onChange={() => handleAnswerSelect(questions[currentQuestion].id, option)}
                      className="mr-3"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="btn btn-outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
              
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleQuizSubmit}
                  className="btn btn-primary"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  className="btn btn-primary"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Content type not supported</p>
          </div>
        );
    }
  };

  const getContentIcon = () => {
    switch (content.content_type) {
      case 'text':
        return FileText;
      case 'video':
        return Video;
      case 'quiz':
        return HelpCircle;
      default:
        return FileText;
    }
  };

  const Icon = getContentIcon();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to={`/courses/${courseId}`}
            className="btn btn-outline flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Link>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
            <p className="text-gray-600">{content.content_type.charAt(0).toUpperCase() + content.content_type.slice(1)} Content</p>
          </div>
        </div>
        
        {content.user_progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{content.user_progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${content.user_progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-8">
        {renderContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => updateProgress(Math.min(100, content.user_progress + 25))}
            className={`btn ${isProgressMarked ? 'btn-success' : 'btn-outline'} flex items-center`}
          >
            {isProgressMarked ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Progress Marked
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Mark Progress
              </>
            )}
          </button>
          
          {isProgressMarked && (
            <button
              onClick={resetProgress}
              className="btn btn-outline btn-danger flex items-center"
            >
              <Clock className="h-4 w-4 mr-2" />
              Unmark
            </button>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          {content.user_progress}% Complete
        </div>
      </div>
    </div>
  );
};

export default ContentViewer; 