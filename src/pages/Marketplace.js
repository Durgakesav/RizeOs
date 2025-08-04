import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  UserCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  BookmarkIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const { user } = useSelector(state => state.auth);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Projects', icon: BriefcaseIcon },
    { id: 'web-development', name: 'Web Development', icon: BriefcaseIcon },
    { id: 'mobile-development', name: 'Mobile Development', icon: BriefcaseIcon },
    { id: 'design', name: 'Design', icon: BriefcaseIcon },
    { id: 'writing', name: 'Writing', icon: BriefcaseIcon },
    { id: 'marketing', name: 'Marketing', icon: BriefcaseIcon },
    { id: 'data-science', name: 'Data Science', icon: BriefcaseIcon }
  ];

  const filters = [
    { id: 'all', name: 'All Projects' },
    { id: 'featured', name: 'Featured' },
    { id: 'urgent', name: 'Urgent' },
    { id: 'fixed-price', name: 'Fixed Price' },
    { id: 'hourly', name: 'Hourly' }
  ];

  const projects = [
    {
      id: 1,
      title: 'E-commerce Website Development',
      category: 'web-development',
      client: {
        name: 'TechCorp Inc.',
        rating: 4.8,
        projects: 45,
        verified: true
      },
      description: 'Need a full-featured e-commerce website with payment integration, inventory management, and admin dashboard.',
      budget: { min: 5000, max: 8000, type: 'fixed' },
      duration: '2-3 months',
      skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      location: 'Remote',
      posted: '2 days ago',
      proposals: 12,
      featured: true,
      urgent: false
    },
    {
      id: 2,
      title: 'Mobile App UI/UX Design',
      category: 'design',
      client: {
        name: 'StartupXYZ',
        rating: 4.6,
        projects: 23,
        verified: true
      },
      description: 'Looking for a talented designer to create modern UI/UX for a fitness tracking mobile app.',
      budget: { min: 3000, max: 5000, type: 'fixed' },
      duration: '3-4 weeks',
      skills: ['Figma', 'Adobe XD', 'UI/UX Design', 'Prototyping'],
      location: 'Remote',
      posted: '1 day ago',
      proposals: 8,
      featured: false,
      urgent: true
    },
    {
      id: 3,
      title: 'Content Writing for Tech Blog',
      category: 'writing',
      client: {
        name: 'TechBlog Media',
        rating: 4.9,
        projects: 67,
        verified: true
      },
      description: 'Need high-quality technical articles for our programming blog. Topics include AI, web development, and cybersecurity.',
      budget: { min: 50, max: 100, type: 'hourly' },
      duration: 'Ongoing',
      skills: ['Technical Writing', 'SEO', 'Programming Knowledge'],
      location: 'Remote',
      posted: '3 days ago',
      proposals: 15,
      featured: false,
      urgent: false
    },
    {
      id: 4,
      title: 'Data Analysis Dashboard',
      category: 'data-science',
      client: {
        name: 'Analytics Pro',
        rating: 4.7,
        projects: 34,
        verified: true
      },
      description: 'Create an interactive dashboard for business analytics with real-time data visualization.',
      budget: { min: 4000, max: 6000, type: 'fixed' },
      duration: '1-2 months',
      skills: ['Python', 'Tableau', 'SQL', 'Data Visualization'],
      location: 'Remote',
      posted: '5 days ago',
      proposals: 6,
      featured: true,
      urgent: false
    },
    {
      id: 5,
      title: 'Social Media Marketing Campaign',
      category: 'marketing',
      client: {
        name: 'Digital Growth Agency',
        rating: 4.5,
        projects: 28,
        verified: true
      },
      description: 'Develop and execute a comprehensive social media marketing campaign for a B2B SaaS company.',
      budget: { min: 75, max: 120, type: 'hourly' },
      duration: '3 months',
      skills: ['Social Media Marketing', 'Content Strategy', 'Analytics'],
      location: 'Remote',
      posted: '1 week ago',
      proposals: 9,
      featured: false,
      urgent: false
    },
    {
      id: 6,
      title: 'iOS App Development',
      category: 'mobile-development',
      client: {
        name: 'Mobile Solutions',
        rating: 4.8,
        projects: 52,
        verified: true
      },
      description: 'Develop a native iOS app for food delivery service with real-time tracking and payment integration.',
      budget: { min: 8000, max: 12000, type: 'fixed' },
      duration: '4-5 months',
      skills: ['Swift', 'iOS Development', 'Core Data', 'MapKit'],
      location: 'Remote',
      posted: '4 days ago',
      proposals: 7,
      featured: true,
      urgent: true
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'featured' && project.featured) ||
      (selectedFilter === 'urgent' && project.urgent) ||
      (selectedFilter === 'fixed-price' && project.budget.type === 'fixed') ||
      (selectedFilter === 'hourly' && project.budget.type === 'hourly');
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesFilter && matchesSearch;
  });

  const handleSubmitProposal = async (projectId) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Proposal submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit proposal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = async (projectId) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Project saved to favorites!');
    } catch (error) {
      toast.error('Failed to save project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Freelance Marketplace
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Find the perfect project or hire talented professionals
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Post a Project
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-green-600 transition-colors">
                Browse Projects
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="w-4 h-4 mr-1" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Available Projects ({filteredProjects.length})
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500">
              <option>Latest</option>
              <option>Budget: High to Low</option>
              <option>Budget: Low to High</option>
              <option>Proposals: Fewest</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {project.featured && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                      {project.urgent && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveProject(project.id)}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    <BookmarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Client Info */}
                <div className="flex items-center mb-4">
                  <UserCircleIcon className="w-8 h-8 text-gray-400 mr-3" />
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{project.client.name}</span>
                      {project.client.verified && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500 ml-1" />
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <StarIconSolid className="w-4 h-4 text-yellow-400 mr-1" />
                      {project.client.rating} ({project.client.projects} projects)
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Project Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Budget:</span>
                    <span className="font-medium text-gray-900">
                      ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                      {project.budget.type === 'hourly' && '/hr'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-900">{project.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium text-gray-900">{project.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Posted:</span>
                    <span className="font-medium text-gray-900">{project.posted}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Proposals:</span>
                    <span className="font-medium text-gray-900">{project.proposals}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSubmitProposal(project.id)}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Submit Proposal'}
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Post a New Project</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>Select category</option>
                  <option>Web Development</option>
                  <option>Mobile Development</option>
                  <option>Design</option>
                  <option>Writing</option>
                  <option>Marketing</option>
                  <option>Data Science</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your project requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>Fixed Price</option>
                    <option>Hourly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., $1000 - $5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Post Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace; 