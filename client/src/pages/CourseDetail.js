import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Video,
  HelpCircle,
  X,
  Check,
  BookOpen
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios'; // Added axios import
import Navbar from '../components/Navbar';

const CourseDetail = ({ onNavigate }) => {
  const { user } = useAuth();
  const { trackCourseView, trackContentModuleView, trackContentView, trackVideoInteraction, trackQuizInteraction, trackProgressUpdate } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const hasLoaded = useRef(false);

  // Assuming courseId is passed as a prop or derived from context
  const courseId = 1; // Mock course ID for now

  useEffect(() => {
    if (hasLoaded.current) return; // Prevent multiple calls
    hasLoaded.current = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/courses/${courseId}`);
        setCourse(response.data);
        
        // Track course view only once
        trackCourseView(courseId, response.data.title, 'Course Detail Page');
        
        if (response.data.content && response.data.content.length > 0) {
          setCurrentContent(response.data.content[0]);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        // Set mock data if API fails
        const mockCourse = {
          id: 1,
          title: 'Complete Web Development Bootcamp',
          description: 'Master HTML, CSS, JavaScript, React, and Node.js. Build real-world projects and become a full-stack developer.',
          instructor: 'John Doe',
          progress: 25,
          totalLessons: 8,
          completedLessons: 2,
          content: [
            {
              id: 1,
              title: 'Welcome to Web Development Bootcamp',
              description: 'Introduction to the course and learning objectives',
              type: 'text',
              content: `Welcome to the Complete Web Development Bootcamp! This comprehensive course will take you from a complete beginner to a full-stack developer.

What you will learn:
• HTML5 structure and semantic elements
• CSS3 styling, Flexbox, and Grid
• JavaScript ES6+ fundamentals
• React.js for frontend development
• Node.js and Express for backend
• Database integration with MongoDB
• Deployment and hosting
• Real-world project development

Course Structure:
This bootcamp is divided into 8 comprehensive modules:
1. HTML & CSS Fundamentals
2. JavaScript Basics
3. Advanced JavaScript
4. React.js Frontend
5. Node.js Backend
6. Database Integration
7. Full-Stack Projects
8. Deployment & Career Prep

Prerequisites:
No prior programming experience required! This course is designed for complete beginners. You just need:
• A computer with internet access
• Basic computer skills
• Enthusiasm to learn!`,
              completed: true
            },
            {
              id: 2,
              title: 'HTML5 Fundamentals',
              description: 'Master HTML5 fundamentals including semantic elements, forms, and modern web standards',
              type: 'text',
              content: `HTML5 Fundamentals

HTML (HyperText Markup Language) is the standard markup language for creating web pages. In this module, you'll learn the fundamentals of HTML5.

Key Topics:
• HTML Document Structure
• Semantic Elements
• Text Formatting
• Links and Navigation
• Images and Media
• Forms and Input Elements
• Tables and Lists
• HTML5 New Features

Document Structure:
Every HTML document has a basic structure:
<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    <h1>Main Heading</h1>
    <p>This is a paragraph.</p>
</body>
</html>

Semantic Elements:
HTML5 introduced semantic elements that clearly describe their meaning:
• <header> - Defines a header for a document or section
• <nav> - Defines navigation links
• <main> - Specifies the main content of a document
• <section> - Defines a section in a document
• <article> - Defines an article
• <aside> - Defines content aside from the page content
• <footer> - Defines a footer for a document or section

Text Elements:
• <h1> to <h6> - Headings
• <p> - Paragraphs
• <strong> - Important text
• <em> - Emphasized text
• <mark> - Marked/highlighted text
• <small> - Smaller text
• <del> - Deleted text
• <ins> - Inserted text

Links and Navigation:
<a href="https://example.com">Link text</a>
<a href="#section-id">Internal link</a>

Images:
<img src="image.jpg" alt="Description" width="300" height="200">

Forms:
<form action="/submit" method="post">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    <button type="submit">Submit</button>
</form>

Practice Exercise:
Create a simple HTML page with:
1. A header with navigation
2. A main section with headings and paragraphs
3. An image
4. A contact form
5. A footer

This will give you hands-on experience with HTML5 fundamentals!`,
              completed: false
            },
            {
              id: 2,
              title: 'HTML5 Fundamentals',
              description: 'Master HTML5 fundamentals including semantic elements, forms, and modern web standards',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE',
              completed: false
            },
            {
              id: 3,
              title: 'CSS3 Styling & Layout',
              description: 'Learn CSS3 styling, Flexbox, and Grid layout techniques',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/1PnVor36_40',
              completed: false
            },
            {
              id: 4,
              title: 'JavaScript ES6+ Basics',
              description: 'Introduction to modern JavaScript programming',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
              completed: false
            },
            {
              id: 5,
              title: 'HTML Quiz',
              description: 'Test your knowledge of HTML basics',
              type: 'quiz',
              questions: [
                {
                  id: 1,
                  question: 'What does HTML stand for?',
                  options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'],
                  correctAnswer: 0
                },
                {
                  id: 2,
                  question: 'Which HTML tag is used to define a paragraph?',
                  options: ['<p>', '<paragraph>', '<text>'],
                  correctAnswer: 0
                }
              ],
              completed: false
            },
            {
              id: 6,
              title: 'CSS Quiz',
              description: 'Test your knowledge of CSS fundamentals',
              type: 'quiz',
              questions: [
                {
                  id: 1,
                  question: 'What does CSS stand for?',
                  options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets'],
                  correctAnswer: 0
                },
                {
                  id: 2,
                  question: 'Which CSS property controls the text size?',
                  options: ['font-size', 'text-size', 'font-style'],
                  correctAnswer: 0
                },
                {
                  id: 3,
                  question: 'How do you add a background color for all <h1> elements?',
                  options: ['h1 {background-color:#B2D6FF}', 'h1.all {background-color:#B2D6FF}', 'all.h1 {background-color:#B2D6FF}'],
                  correctAnswer: 0
                }
              ],
              completed: false
            },
            {
              id: 7,
              title: 'JavaScript Fundamentals',
              description: 'Learn JavaScript basics and programming concepts',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
              completed: false
            },
            {
              id: 8,
              title: 'JavaScript Quiz',
              description: 'Test your JavaScript knowledge',
              type: 'quiz',
              questions: [
                {
                  id: 1,
                  question: 'Which of the following is a JavaScript data type?',
                  options: ['String', 'Integer', 'Float', 'All of the above'],
                  correctAnswer: 3
                },
                {
                  id: 2,
                  question: 'How do you declare a variable in JavaScript?',
                  options: ['var x = 5;', 'let x = 5;', 'const x = 5;', 'All of the above'],
                  correctAnswer: 3
                },
                {
                  id: 3,
                  question: 'What is the correct way to write a JavaScript array?',
                  options: ['var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = "red", "green", "blue"', 'var colors = ["red", "green", "blue"]'],
                  correctAnswer: 2
                }
              ],
              completed: false
            }
          ]
        };
        setCourse(mockCourse);
        trackCourseView(courseId, mockCourse.title, 'Course Detail Page');
        if (mockCourse.content && mockCourse.content.length > 0) {
          console.log('Setting current content:', mockCourse.content[0]);
          setCurrentContent(mockCourse.content[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]); // Remove trackCourseView from dependencies

  // Timer for tracking time spent
  useEffect(() => {
    let interval;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  const handleContentClick = (content) => {
    setCurrentContent(content);
    setTimeSpent(0);
    setShowQuiz(false);
    setQuizSubmitted(false);
    setQuizScore(null);
    trackContentView(course.id, content.id, content.title);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    trackVideoInteraction(course.id, currentContent.id, 'play');
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    trackVideoInteraction(course.id, currentContent.id, 'pause');
  };

  const handleProgressUpdate = async (newProgress) => {
    try {
      // Update local state
      setProgress(newProgress);
      
      // Update course content completion status
      if (currentContent) {
        const updatedContent = { ...currentContent, completed: newProgress === 100 };
        setCurrentContent(updatedContent);
        
        // Update course content list
        const updatedCourse = {
          ...course,
          content: course.content.map(content => 
            content.id === currentContent.id 
              ? { ...content, completed: newProgress === 100 }
              : content
          )
        };
        setCourse(updatedCourse);
      }

      // Track analytics
      trackProgressUpdate(course.id, currentContent.id, newProgress, timeSpent);
      
      console.log(`Progress updated to ${newProgress}% for content: ${currentContent.title}`);
      
      // Show success message
      if (newProgress === 100) {
        // You can add a toast notification here
        console.log('✅ Content marked as complete!');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleQuizStart = () => {
    setShowQuiz(true);
    setQuizSubmitted(false);
    setQuizScore(null);
    
    // Generate quiz questions based on content
    const questions = currentContent.title.includes('HTML') ? [
      {
        id: 1,
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
        correct: 0
      },
      {
        id: 2,
        question: 'Which HTML tag is used to define a paragraph?',
        options: ['<p>', '<paragraph>', '<text>', '<div>'],
        correct: 0
      },
      {
        id: 3,
        question: 'What is the correct HTML element for inserting a line break?',
        options: ['<break>', '<lb>', '<br>', '<line>'],
        correct: 2
      }
    ] : [
      {
        id: 1,
        question: 'What does CSS stand for?',
        options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
        correct: 0
      },
      {
        id: 2,
        question: 'Which CSS property controls the text size?',
        options: ['font-size', 'text-size', 'font-style', 'text-style'],
        correct: 0
      },
      {
        id: 3,
        question: 'How do you add a background color for all <h1> elements?',
        options: ['h1 {background-color:#B2D6FF}', 'h1.all {background-color:#B2D6FF}', 'all.h1 {background-color:#B2D6FF}', 'h1 {bgcolor:#B2D6FF}'],
        correct: 0
      }
    ];
    
    setQuizQuestions(questions);
    setQuizAnswers({});
  };

  const handleQuizSubmit = () => {
    const correctAnswers = quizQuestions.reduce((count, question) => {
      return count + (quizAnswers[question.id] === question.correct ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Track quiz completion
    trackQuizInteraction(course.id, currentContent.id, 'quiz_completed', { score });
    
    // Mark as complete if score is good
    if (score >= 70) {
      handleProgressUpdate(100);
    }
  };

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
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
    <div className="min-h-screen bg-slate-900">
      <Navbar currentPage="courses" onNavigate={onNavigate} user={user} />
      
      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Info */}
        <div className="card mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{course.title}</h1>
              <p className="text-slate-400">{course.description}</p>
              <p className="text-sm text-slate-500">Instructor: {course.instructor}</p>
            </div>
          </div>
        
                  <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-slate-400 mr-1" />
              <span className="text-sm text-slate-400">{course.totalLessons} lessons</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-sm text-slate-400">{course.completedLessons} completed</span>
            </div>
            {timeSpent > 0 && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-sm text-slate-400">{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Progress</span>
              <span className="text-sm font-medium text-slate-300">{progress}%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
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
          <h2 className="text-xl font-bold text-white mb-4">Course Content</h2>
          <div className="space-y-2">
            {course.content.map((content) => (
              <div
                key={content.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  currentContent?.id === content.id
                    ? 'border-blue-500 bg-slate-700'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-750'
                } ${content.completed ? 'bg-green-900 border-green-600' : ''}`}
                onClick={() => {
                  setCurrentContent(content);
                  // Track content module view
                  trackContentModuleView(course.id, content.id, content.title, content.type);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      content.completed 
                        ? 'bg-green-800 text-green-300' 
                        : 'bg-slate-600 text-slate-300'
                    }`}>
                      {content.type === 'video' && <Video className="h-5 w-5" />}
                      {content.type === 'text' && <FileText className="h-5 w-5" />}
                      {content.type === 'quiz' && <HelpCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{content.title}</h3>
                      <p className="text-sm text-slate-400">{content.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {content.completed && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    <span className="text-sm text-slate-500">
                      {content.type === 'video' && 'Video'}
                      {content.type === 'text' && 'Text'}
                      {content.type === 'quiz' && 'Quiz'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">
              {currentContent?.title}
            </h2>
            
            {currentContent?.type === 'text' && (
              <div>
                <div className="prose max-w-none mb-6">
                  <div className="whitespace-pre-line text-white leading-relaxed">
                    {currentContent.content}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleProgressUpdate(100)}
                    className={`btn flex items-center ${
                      currentContent.completed 
                        ? 'btn-success bg-green-600 hover:bg-green-700' 
                        : 'btn-primary'
                    }`}
                  >
                    {currentContent.completed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marked as Complete
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Complete
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleProgressUpdate(0)}
                    className="btn btn-outline"
                  >
                    Reset Progress
                  </button>
                </div>
                {currentContent.completed && (
                  <div className="mt-4 p-3 bg-green-900 border border-green-600 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-green-300 font-medium">
                        This content has been marked as complete!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                    onPause={handleVideoPause}
                  ></iframe>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleProgressUpdate(100)}
                    className={`btn flex items-center ${
                      currentContent.completed 
                        ? 'btn-success bg-green-600 hover:bg-green-700' 
                        : 'btn-primary'
                    }`}
                  >
                    {currentContent.completed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marked as Complete
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Complete
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleProgressUpdate(0)}
                    className="btn btn-outline"
                  >
                    Reset Progress
                  </button>
                </div>
                {currentContent.completed && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">
                        This content has been marked as complete!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentContent?.type === 'quiz' && !showQuiz && (
              <div className="text-center py-8">
                <HelpCircle className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Quiz: {currentContent.title}</h3>
                <p className="text-slate-400 mb-4">Test your knowledge with interactive questions</p>
                <button 
                  onClick={handleQuizStart}
                  className="btn btn-primary"
                >
                  Start Quiz
                </button>
              </div>
            )}

            {currentContent?.type === 'quiz' && showQuiz && (
              <div>
                {!quizSubmitted ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">Quiz: {currentContent.title}</h3>
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="text-slate-400 hover:text-slate-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {quizQuestions.map((question, index) => (
                      <div key={question.id} className="border border-slate-600 rounded-lg p-4 bg-slate-750">
                        <h4 className="font-medium text-white mb-3">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={optionIndex}
                                checked={quizAnswers[question.id] === optionIndex}
                                onChange={() => handleQuizAnswer(question.id, optionIndex)}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-slate-300">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={handleQuizSubmit}
                      className="btn btn-primary w-full"
                      disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                    >
                      Submit Quiz
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      quizScore >= 70 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {quizScore >= 70 ? (
                        <Check className="h-8 w-8 text-green-600" />
                      ) : (
                        <X className="h-8 w-8 text-red-600" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Quiz Complete!
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      Score: {quizScore}%
                    </p>
                    <p className="text-gray-600 mb-4">
                      {quizScore >= 70 ? 'Great job! You passed the quiz.' : 'Keep studying and try again.'}
                    </p>
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="btn btn-outline"
                      >
                        Back to Course
                      </button>
                      {quizScore < 70 && (
                        <button
                          onClick={handleQuizStart}
                          className="btn btn-primary"
                        >
                          Retake Quiz
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
                  </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail; 