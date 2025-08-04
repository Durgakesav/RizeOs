import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  StarIcon,
  BookmarkIcon,
  ShareIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { fetchJobById, applyForJob, saveJob } from '../../store/slices/jobSlice';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { user } = useSelector(state => state.auth);
  const { currentJob, loading } = useSelector(state => state.jobs);
  
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
    expectedSalary: '',
    availability: 'immediate'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
    }
  }, [id, dispatch]);

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (!applicationData.coverLetter.trim()) {
      setErrors({ coverLetter: 'Cover letter is required' });
      return;
    }

    try {
      await dispatch(applyForJob({ jobId: id, applicationData })).unwrap();
      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
      setApplicationData({
        coverLetter: '',
        resume: null,
        expectedSalary: '',
        availability: 'immediate'
      });
    } catch (error) {
      toast.error(error || 'Failed to submit application');
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    try {
      await dispatch(saveJob(id));
      toast.success('Job saved successfully!');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const formatBudget = (budget) => {
    if (!budget) return 'Not specified';
    if (budget.min && budget.max) {
      return `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`;
    }
    if (budget.min) {
      return `$${budget.min.toLocaleString()}+`;
    }
    if (budget.max) {
      return `Up to $${budget.max.toLocaleString()}`;
    }
    return 'Not specified';
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-100 text-blue-800';
      case 'part-time':
        return 'bg-green-100 text-green-800';
      case 'contract':
        return 'bg-purple-100 text-purple-800';
      case 'freelance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceColor = (level) => {
    switch (level) {
      case 'entry':
        return 'bg-green-100 text-green-800';
      case 'mid':
        return 'bg-yellow-100 text-yellow-800';
      case 'senior':
        return 'bg-red-100 text-red-800';
      case 'expert':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card animate-pulse">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center py-12">
            <BriefcaseIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Job not found</h3>
            <p className="text-gray-500 mb-4">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/jobs" className="btn-primary">
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Jobs
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentJob.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                      <span>{currentJob.employer?.name || 'Company Name'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2" />
                      <span>{currentJob.location || 'Remote'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveJob}
                    className="p-2 text-gray-400 hover:text-yellow-500"
                    title="Save job"
                  >
                    <BookmarkIcon className="w-6 h-6" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Share job"
                  >
                    <ShareIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Job Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium">{formatBudget(currentJob.budget)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{currentJob.jobType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{currentJob.experienceLevel}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="font-medium">
                      {new Date(currentJob.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(currentJob.jobType)}`}>
                  {currentJob.jobType}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(currentJob.experienceLevel)}`}>
                  {currentJob.experienceLevel}
                </span>
                {currentJob.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {currentJob.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {currentJob.requirements && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {currentJob.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Benefits */}
            {currentJob.benefits && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {currentJob.benefits}
                  </p>
                </div>
              </div>
            )}

            {/* Company Information */}
            {currentJob.companyDescription && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Company</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {currentJob.companyDescription}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <div className="card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {currentJob.applications?.length || 0} applications
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentJob.views || 0} views
                  </span>
                </div>
                
                {user ? (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="btn-primary w-full"
                  >
                    Apply Now
                  </button>
                ) : (
                  <Link
                    to="/login"
                    state={{ from: `/jobs/${id}` }}
                    className="btn-primary w-full text-center"
                  >
                    Sign in to Apply
                  </Link>
                )}
              </div>
            </div>

            {/* Job Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-medium">{currentJob.jobType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{currentJob.experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{currentJob.location || 'Remote'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary</span>
                  <span className="font-medium">{formatBudget(currentJob.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">
                    {new Date(currentJob.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Rating */}
            {currentJob.employer?.rating && (
        <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Rating</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(currentJob.employer.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {currentJob.employer.rating}/5
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Application Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Apply for {currentJob.title}</h2>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-6">
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={6}
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                    className={`input-field ${errors.coverLetter ? 'border-red-500' : ''}`}
                    placeholder="Tell us why you're the perfect fit for this role..."
                  />
                  {errors.coverLetter && (
                    <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary
                  </label>
                  <input
                    type="number"
                    id="expectedSalary"
                    name="expectedSalary"
                    value={applicationData.expectedSalary}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, expectedSalary: e.target.value }))}
                    className="input-field"
                    placeholder="Enter your expected salary"
                  />
                </div>

                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={applicationData.availability}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, availability: e.target.value }))}
                    className="input-field"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="2-weeks">2 weeks notice</option>
                    <option value="1-month">1 month notice</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail; 