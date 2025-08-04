import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { 
  UserCircleIcon,
  MapPinIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  PencilIcon,
  CameraIcon,
  StarIcon,
  UserPlusIcon,
  UserMinusIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  CalendarIcon,
  TrophyIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { 
  fetchUserProfile, 
  followUser, 
  unfollowUser,
  updateProfile 
} from '../../store/slices/userSlice';
import { fetchUserPosts } from '../../store/slices/postSlice';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { user: currentUser } = useSelector(state => state.auth);
  const { user: profileUser, loading } = useSelector(state => state.users);
  const { posts: userPosts } = useSelector(state => state.posts);
  
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    title: '',
    company: '',
    location: '',
    website: '',
    skills: []
  });

  const isOwnProfile = !userId || userId === currentUser?._id;

  useEffect(() => {
    if (userId) {
      loadUserProfile(userId);
    } else {
      // Load current user's profile
      setEditForm({
        name: currentUser?.name || '',
        bio: currentUser?.bio || '',
        title: currentUser?.title || '',
        company: currentUser?.company || '',
        location: currentUser?.location || '',
        website: currentUser?.website || '',
        skills: currentUser?.skills || []
      });
    }
  }, [userId, currentUser]);

  useEffect(() => {
    if (profileUser) {
      loadUserPosts(profileUser._id);
    }
  }, [profileUser]);

  const loadUserProfile = async (userId) => {
    try {
      await dispatch(fetchUserProfile(userId));
    } catch (error) {
      toast.error('Failed to load user profile');
    }
  };

  const loadUserPosts = async (userId) => {
    try {
      await dispatch(fetchUserPosts(userId));
    } catch (error) {
      toast.error('Failed to load user posts');
    }
  };

  const handleFollow = async () => {
    try {
      await dispatch(followUser(profileUser._id));
      toast.success('User followed successfully');
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      await dispatch(unfollowUser(profileUser._id));
      toast.success('User unfollowed successfully');
    } catch (error) {
      toast.error('Failed to unfollow user');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await dispatch(updateProfile(editForm));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'about', name: 'About', icon: UserCircleIcon },
    { id: 'posts', name: 'Posts', icon: ChatBubbleLeftRightIcon },
    { id: 'activity', name: 'Activity', icon: EyeIcon },
    { id: 'skills', name: 'Skills', icon: TrophyIcon }
  ];

  const user = isOwnProfile ? currentUser : profileUser;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-800 rounded-t-lg"></div>
            
            {/* Profile Photo */}
            <div className="absolute bottom-0 left-8 transform translate-y-1/2">
              <div className="relative">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                    <UserCircleIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {isOwnProfile && (
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl">
                    <CameraIcon className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Profile Actions */}
            <div className="absolute bottom-4 right-8 flex items-center space-x-3">
              {!isOwnProfile && (
                <>
                  {user?.isFollowing ? (
                    <button
                      onClick={handleUnfollow}
                      className="btn-outline flex items-center space-x-2"
                    >
                      <UserMinusIcon className="w-4 h-4" />
                      <span>Unfollow</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <UserPlusIcon className="w-4 h-4" />
                      <span>Follow</span>
                    </button>
                  )}
                  <Link
                    to={`/messages?user=${user?._id}`}
                    className="btn-outline p-2"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  </Link>
                </>
              )}
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.name}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {user?.title || 'Professional'}
                </p>
                {user?.company && (
                  <p className="text-gray-600 mb-2">
                    {user.company}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {user?.rating ? `${user.rating}/5` : 'No rating'}
                </span>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <UserCircleIcon className="w-4 h-4" />
                <span>{user?.followerCount || 0} followers</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserCircleIcon className="w-4 h-4" />
                <span>{user?.followingCount || 0} following</span>
              </div>
              <div className="flex items-center space-x-1">
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span>{userPosts?.length || 0} posts</span>
              </div>
              {user?.location && (
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user?.website && (
                <div className="flex items-center space-x-1">
                  <GlobeAltIcon className="w-4 h-4" />
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                    Website
                  </a>
                </div>
              )}
            </div>

            {/* Bio */}
            {user?.bio && (
              <p className="text-gray-700 mb-4">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="card">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'about' && (
              <div className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={editForm.company}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        rows={4}
                        className="input-field"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdateProfile}
                        className="btn-primary"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                      <p className="text-gray-700">
                        {user?.bio || 'No bio available'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user?.location && (
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{user.location}</span>
                        </div>
                      )}
                      {user?.company && (
                        <div className="flex items-center space-x-2">
                          <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{user.company}</span>
                        </div>
                      )}
                      {user?.website && (
                        <div className="flex items-center space-x-2">
                          <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                          <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                            {user.website}
                          </a>
                        </div>
                      )}
                      {user?.createdAt && (
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">Member since {formatDate(user.createdAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-4">
                {userPosts?.length > 0 ? (
                  userPosts.map((post) => (
                    <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        {user?.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="w-10 h-10 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{user?.name}</span>
                            <span className="text-sm text-gray-500">
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700">{post.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No posts yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <EyeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Activity tracking coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                {user?.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-2 rounded-full text-sm font-medium ${getSkillColor(skill.name)}`}
                      >
                        {skill.name}
                        {skill.level && (
                          <span className="ml-2 text-xs opacity-75">
                            ({skill.level})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No skills listed yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 