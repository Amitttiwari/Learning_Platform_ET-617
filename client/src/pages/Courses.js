import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../contexts/AnalyticsContext';
import axios from 'axios';
import { 
  BookOpen, 
  Clock, 
  User, 
  Star,
  Search,
  Filter,
  Play,
  CheckCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Courses = () => {
  const { trackButtonClick, trackSearch } = useAnalytics();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    trackSearch(searchTerm, courses.length);
  };

  const handleCourseClick = (course) => {
    trackButtonClick('Course Card', 'Courses', { 
      courseId: course.id, 
      courseTitle: course.title 
    });
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(courses.map(course => course.category))];

  if (loading) {
    return <LoadingSpinner text="Loading courses..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Courses</h1>
        <p className="text-gray-600">Explore our interactive learning content</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </form>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="card card-hover">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 h-48 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-16 w-16 text-primary-600" />
                </div>
                {course.user_progress > 0 && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {course.user_progress}% Complete
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{course.instructor_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.content_count} modules</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">4.5</span>
                  </div>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    {course.difficulty_level}
                  </span>
                </div>
              </div>
              
              <Link
                to={`/courses/${course.id}`}
                className="btn btn-primary w-full flex items-center justify-center"
                onClick={() => handleCourseClick(course)}
              >
                <Play className="h-4 w-4 mr-2" />
                {course.user_progress > 0 ? 'Continue' : 'Start Learning'}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Courses; 