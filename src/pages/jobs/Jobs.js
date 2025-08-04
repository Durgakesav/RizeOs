import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchJobs } from '../../store/slices/jobSlice';
import toast from 'react-hot-toast';

const Jobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { jobs, loading } = useSelector(state => state.jobs);
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      await dispatch(fetchJobs());
    } catch (error) {
      toast.error('Failed to load jobs');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadJobs();
      return;
    }
    // TODO: Implement search functionality
    toast.info('Search functionality coming soon');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
          <p className="text-gray-600">Discover amazing jobs from top companies and startups</p>
        </div>

        {/* Search Bar */}
        <div className="card mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, skills, or companies..."
              className="input-field flex-1"
            />
            <button
              onClick={handleSearch}
              className="btn-primary px-6"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${jobs?.length || 0} jobs found`}
          </p>
          {user && (
            <Link to="/jobs/create" className="btn-primary">
              Post a Job
            </Link>
          )}
        </div>

        {/* Jobs Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobs?.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-400 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link 
                          to={`/jobs/${job._id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {job.title}
                        </Link>
                        <p className="text-gray-600">{job.employer?.name || 'Company Name'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>{job.location || 'Remote'}</span>
                      <span>{job.jobType || 'Full Time'}</span>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {job.description || 'Job description coming soon...'}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{job.views || 0} views</span>
                        <span>{job.applications?.length || 0} applications</span>
                      </div>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="btn-primary text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
              <button
                onClick={loadJobs}
                className="btn-primary"
              >
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        {jobs?.length > 0 && (
          <div className="text-center mt-8">
            <button className="btn-outline">
              Load more jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs; 