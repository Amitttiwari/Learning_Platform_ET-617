import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { 
  BookOpen, 
  BarChart3, 
  Users, 
  Award,
  Play,
  ArrowRight,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { trackButtonClick } = useAnalytics();

  const handleCTAClick = (ctaType) => {
    trackButtonClick(`CTA - ${ctaType}`, 'Home', { section: 'hero' });
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Courses',
      description: 'Learn with engaging content including text, video, and interactive quizzes.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Tracking',
      description: 'Track your learning progress with detailed analytics and insights.'
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Join a community of learners and share your progress.'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Earn certificates and badges as you complete courses.'
    }
  ];

  const stats = [
    { number: '100+', label: 'Courses Available' },
    { number: '10K+', label: 'Active Learners' },
    { number: '95%', label: 'Completion Rate' },
    { number: '24/7', label: 'Learning Support' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn Smarter with
              <span className="text-gradient block">Analytics</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience interactive learning with comprehensive analytics tracking. 
              Monitor your progress, understand your learning patterns, and achieve your educational goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/courses"
                  className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center"
                  onClick={() => handleCTAClick('Get Started')}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Learning
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center"
                    onClick={() => handleCTAClick('Sign Up')}
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline text-lg px-8 py-3"
                    onClick={() => handleCTAClick('Login')}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with proven learning methodologies 
              to provide you with the best educational experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card card-hover text-center">
                <div className="flex justify-center mb-4">
                  <feature.icon className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already tracking their progress 
            and achieving their educational goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
                onClick={() => handleCTAClick('Dashboard')}
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
                onClick={() => handleCTAClick('Final CTA')}
              >
                Get Started Today
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Create your account and set up your learning profile
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Courses</h3>
              <p className="text-gray-600">
                Browse and enroll in courses that match your interests
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your learning analytics and celebrate achievements
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 