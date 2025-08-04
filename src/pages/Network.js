import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  UserPlusIcon,
  UserMinusIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  FunnelIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { 
  fetchNetworkUsers, 
  followUser, 
  unfollowUser,
  searchUsers 
} from '../store/slices/userSlice';
import toast from 'react-hot-toast';

const Network = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { users, loading } = useSelector(state => state.users);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    industry: ''
  });

  useEffect(() => {
    loadNetworkUsers();
  }, [selectedFilter, filters]);

  const loadNetworkUsers = async () => {
    try {
      const params = {
        filter: selectedFilter,
        ...filters
      };
      await dispatch(fetchNetworkUsers(params));
    } catch (error) {
      toast.error('Failed to load network users');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadNetworkUsers();
      return;
    }

    try {
      await dispatch(searchUsers({ search: searchQuery, ...filters }));
    } catch (error) {
      toast.error('Failed to search users');
    }
  };

  const handleFollow = async (userId) => {
    try {
      await dispatch(followUser(userId));
      toast.success('User followed successfully');
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await dispatch(unfollowUser(userId));
      toast.success('User unfollowed successfully');
    } catch (error) {
      toast.error('Failed to unfollow user');
    }
  };

  const clearFilters = () => {
    setFilters({
      skills: '',
      location: '',
      industry: ''
    });
    setSearchQuery('');
  };

  const getSkillColor = (skill) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-red-100 text-red-800',
      'bg-yellow-100 text-yellow-800'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const networkFilterOptions = [
    { id: 'all', name: 'All Users' },
    { id: 'suggestions', name: 'Suggestions' },
    { id: 'connections', name: 'My Connections' },
    { id: 'followers', name: 'Followers' },
    { id: 'following', name: 'Following' }
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Design',
    'Engineering',
    'Sales',
    'Consulting',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Network</h1>
          <p className="text-gray-600">Connect with professionals and expand your network</p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search professionals, skills, or companies..."
                  className="input-field pl-10"
                />
              </div>
              <button
                onClick={handleSearch}
                className="btn-primary px-6"
              >
                Search
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center space-x-2"
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                    </label>
                    <input
                      type="text"
                      value={filters.skills}
                      onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                      placeholder="react, javascript, python"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      placeholder="City, state, or country"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select
                      value={filters.industry}
                      onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                      className="input-field"
                    >
                      <option value="">All Industries</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
                          {networkFilterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedFilter === filter.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${users?.length || 0} professionals found`}
          </p>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : users?.length > 0 ? (
            users.map((networkUser) => (
              <div key={networkUser._id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {networkUser.profileImage ? (
                      <img
                        src={networkUser.profileImage}
                        alt={networkUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <Link 
                        to={`/profile/${networkUser._id}`}
                        className="font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {networkUser.name}
                      </Link>
                      <p className="text-sm text-gray-600">{networkUser.title || 'Professional'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {networkUser.rating ? `${networkUser.rating}/5` : 'No rating'}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-2 mb-4">
                  {networkUser.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      <span>{networkUser.location}</span>
                    </div>
                  )}
                  {networkUser.company && (
                    <div className="flex items-center text-sm text-gray-600">
                      <BriefcaseIcon className="w-4 h-4 mr-2" />
                      <span>{networkUser.company}</span>
                    </div>
                  )}
                  {networkUser.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {networkUser.bio}
                    </p>
                  )}
                </div>

                {/* Skills */}
                {networkUser.skills && networkUser.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {networkUser.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${getSkillColor(skill.name)}`}
                        >
                          {skill.name}
                        </span>
                      ))}
                      {networkUser.skills.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{networkUser.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{networkUser.followerCount || 0} followers</span>
                  <span>{networkUser.followingCount || 0} following</span>
                  <span>{networkUser.totalPosts || 0} posts</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {networkUser.isFollowing ? (
                    <button
                      onClick={() => handleUnfollow(networkUser._id)}
                      className="flex-1 btn-outline flex items-center justify-center space-x-2"
                    >
                      <UserMinusIcon className="w-4 h-4" />
                      <span>Unfollow</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(networkUser._id)}
                      className="flex-1 btn-primary flex items-center justify-center space-x-2"
                    >
                      <UserPlusIcon className="w-4 h-4" />
                      <span>Follow</span>
                    </button>
                  )}
                  <Link
                    to={`/messages?user=${networkUser._id}`}
                    className="btn-outline p-2"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="card text-center py-12">
                <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search criteria or check back later for new connections.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Load More */}
        {users?.length > 0 && (
          <div className="text-center mt-8">
            <button className="btn-outline">
              Load more professionals
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Network; 