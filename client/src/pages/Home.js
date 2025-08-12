import React from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { 
  BookOpen, 
  Play, 
  Award, 
  Users, 
  TrendingUp, 
  Shield,
  ArrowRight,
  UserPlus,
  LogIn
} from 'lucide-react';

const Home = ({ onNavigate }) => {
  const { trackButtonClick, trackPageView } = useAnalytics();

  React.useEffect(() => {
    trackPageView('Home Page');
  }, []);

  const handleGetStarted = () => {
    trackButtonClick('Get Started', 'Home Page');
    onNavigate('register');
  };

  const handleSignIn = () => {
    trackButtonClick('Sign In', 'Home Page');
    onNavigate('login');
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Learning',
      description: 'Learn with videos, quizzes, and hands-on exercises'
    },
    {
      icon: Play,
      title: 'Video Content',
      description: 'High-quality educational videos from experts'
    },
    {
      icon: Award,
      title: 'Progress Tracking',
      description: 'Monitor your learning progress and achievements'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join a community of learners and instructors'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Detailed insights into your learning patterns'
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Your data is protected with industry-standard security'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Learning Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignIn}
                className="btn btn-ghost flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="btn btn-primary flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Master Web Development
            <span className="text-gradient block">With Interactive Learning</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Join thousands of learners mastering HTML, CSS, JavaScript, and more. 
            Track your progress, take quizzes, and build real projects with our comprehensive learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 hover-lift"
            >
              <UserPlus className="w-5 h-5" />
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleSignIn}
              className="btn btn-outline text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience the future of online learning with our comprehensive features designed for your success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover-lift group">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card glass">
            <div className="card-body">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join our platform today and begin your journey to becoming a web development expert. 
                Track your progress, take interactive quizzes, and learn at your own pace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="btn btn-success text-lg px-8 py-4 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Create Account Now
                </button>
                <button
                  onClick={handleSignIn}
                  className="btn btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Learning Platform</h3>
              </div>
              <p className="text-slate-400">
                Empowering learners worldwide with interactive web development education.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Learning</h4>
              <ul className="space-y-2 text-slate-400">
                <li>HTML & CSS</li>
                <li>JavaScript</li>
                <li>Web Development</li>
                <li>Interactive Quizzes</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Progress Tracking</li>
                <li>Analytics Dashboard</li>
                <li>Video Content</li>
                <li>Community Support</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button
                    onClick={handleGetStarted}
                    className="hover:text-white transition-colors"
                  >
                    Create Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleSignIn}
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                </li>
                <li>Admin Dashboard</li>
                <li>Help & Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 Learning Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 