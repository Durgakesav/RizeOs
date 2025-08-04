import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  AcademicCapIcon,
  PlayIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
  TrophyIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const LearningPlatform = () => {
  const { user } = useSelector(state => state.auth);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Courses', icon: BookOpenIcon },
    { id: 'programming', name: 'Programming', icon: AcademicCapIcon },
    { id: 'design', name: 'Design', icon: LightBulbIcon },
    { id: 'business', name: 'Business', icon: ChartBarIcon },
    { id: 'marketing', name: 'Marketing', icon: UserGroupIcon },
    { id: 'data-science', name: 'Data Science', icon: ChartBarIcon }
  ];

  const courses = [
    {
      id: 1,
      title: 'React.js Masterclass',
      category: 'programming',
      instructor: 'Sarah Johnson',
      rating: 4.8,
      students: 12450,
      duration: '12 hours',
      level: 'Intermediate',
      price: 89,
      originalPrice: 129,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      description: 'Learn React.js from scratch to advanced concepts with hands-on projects.',
      modules: 15,
      certificate: true,
      featured: true
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      category: 'design',
      instructor: 'Michael Chen',
      rating: 4.9,
      students: 8920,
      duration: '8 hours',
      level: 'Beginner',
      price: 69,
      originalPrice: 99,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      description: 'Master the fundamentals of UI/UX design with practical examples.',
      modules: 12,
      certificate: true,
      featured: true
    },
    {
      id: 3,
      title: 'Digital Marketing Strategy',
      category: 'marketing',
      instructor: 'Emily Rodriguez',
      rating: 4.7,
      students: 15680,
      duration: '10 hours',
      level: 'Advanced',
      price: 79,
      originalPrice: 119,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      description: 'Develop comprehensive digital marketing strategies for business growth.',
      modules: 18,
      certificate: true,
      featured: false
    },
    {
      id: 4,
      title: 'Python for Data Science',
      category: 'data-science',
      instructor: 'David Kim',
      rating: 4.6,
      students: 20340,
      duration: '15 hours',
      level: 'Intermediate',
      price: 99,
      originalPrice: 149,
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
      description: 'Learn Python programming for data analysis and machine learning.',
      modules: 20,
      certificate: true,
      featured: true
    },
    {
      id: 5,
      title: 'Business Analytics',
      category: 'business',
      instructor: 'Lisa Wang',
      rating: 4.5,
      students: 9870,
      duration: '14 hours',
      level: 'Advanced',
      price: 89,
      originalPrice: 129,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      description: 'Master business analytics and data-driven decision making.',
      modules: 16,
      certificate: true,
      featured: false
    },
    {
      id: 6,
      title: 'JavaScript ES6+',
      category: 'programming',
      instructor: 'Alex Thompson',
      rating: 4.8,
      students: 18760,
      duration: '9 hours',
      level: 'Intermediate',
      price: 59,
      originalPrice: 89,
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
      description: 'Learn modern JavaScript with ES6+ features and best practices.',
      modules: 14,
      certificate: true,
      featured: false
    }
  ];

  const learningPaths = [
    {
      id: 1,
      title: 'Full Stack Developer',
      description: 'Complete path to become a full-stack developer',
      courses: 8,
      duration: '6 months',
      level: 'Beginner to Advanced',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      progress: 0
    },
    {
      id: 2,
      title: 'Data Scientist',
      description: 'Master data science and machine learning',
      courses: 10,
      duration: '8 months',
      level: 'Intermediate to Advanced',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      progress: 0
    },
    {
      id: 3,
      title: 'Digital Marketing Expert',
      description: 'Become a digital marketing professional',
      courses: 6,
      duration: '4 months',
      level: 'Beginner to Intermediate',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      progress: 0
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'First Course Completed',
      description: 'Complete your first course',
      icon: TrophyIcon,
      achieved: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Learning Streak',
      description: 'Learn for 7 consecutive days',
      icon: StarIcon,
      achieved: true,
      date: '2024-01-20'
    },
    {
      id: 3,
      title: 'Course Creator',
      description: 'Create your first course',
      icon: AcademicCapIcon,
      achieved: false
    }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const handleEnroll = async (courseId) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEnrolledCourses(prev => [...prev, courseId]);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      toast.error('Failed to enroll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (courseId) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCompletedCourses(prev => [...prev, courseId]);
      setEnrolledCourses(prev => prev.filter(id => id !== courseId));
      toast.success('Course completed! Certificate available.');
    } catch (error) {
      toast.error('Failed to complete course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Learning Platform
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Develop your skills with expert-led courses and advance your career
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Browse Courses
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                Learning Paths
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-gray-600">Courses Available</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
            <div className="text-gray-600">Students Enrolled</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
            <div className="text-gray-600">Expert Instructors</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
            <div className="text-gray-600">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <category.icon className="w-5 h-5 mr-2" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.filter(course => course.featured).map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <button className="text-white hover:text-yellow-400">
                    <BookmarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium uppercase">
                    {course.category}
                  </span>
                  <div className="flex items-center">
                    <StarIconSolid className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <UserGroupIcon className="w-4 h-4 mr-1" />
                    {course.students.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    By {course.instructor}
                  </div>
                  <div className="text-sm text-gray-500">
                    {course.modules} modules
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-lg text-gray-500 line-through ml-2">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                  {course.certificate && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Certificate
                    </div>
                  )}
                </div>
                
                {enrolledCourses.includes(course.id) ? (
                  <button
                    onClick={() => handleComplete(course.id)}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Complete Course'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Enroll Now'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Paths */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Learning Paths</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {learningPaths.map((path) => (
            <div key={path.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={path.image} 
                alt={path.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                <p className="text-gray-600 mb-4">{path.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Courses:</span>
                    <span className="font-medium">{path.courses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{path.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Level:</span>
                    <span className="font-medium">{path.level}</span>
                  </div>
                </div>
                
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Start Path
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Achievements</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`bg-white rounded-lg p-6 border-2 ${
                achievement.achieved ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center mb-4">
                <achievement.icon className={`w-8 h-8 mr-3 ${
                  achievement.achieved ? 'text-green-600' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              
              {achievement.achieved && (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Achieved on {achievement.date}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPlatform; 