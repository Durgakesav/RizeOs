import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon,
  EllipsisHorizontalIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  UserCircleIcon,
  EyeIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { 
  fetchPosts, 
  createPost, 
  likePost, 
  addComment 
} from '../store/slices/postSlice';
import toast from 'react-hot-toast';

const Feed = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { posts, loading } = useSelector(state => state.posts);
  
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'general',
    tags: [],
    isPublic: true
  });
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    loadFeed();
  }, [selectedFilter]);

  const loadFeed = async () => {
    try {
      await dispatch(fetchPosts({ type: selectedFilter === 'all' ? null : selectedFilter }));
    } catch (error) {
      toast.error('Failed to load feed');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    try {
      await dispatch(createPost(newPost));
      setNewPost({ title: '', content: '', type: 'general', tags: [], isPublic: true });
      setShowCreatePost(false);
      toast.success('Post created successfully');
      loadFeed();
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      await dispatch(likePost(postId));
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await dispatch(addComment({ postId, content: commentText }));
      setCommentText('');
      setReplyingTo(null);
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'job':
        return <BriefcaseIcon className="w-4 h-4 text-blue-600" />;
      case 'achievement':
        return <PhotoIcon className="w-4 h-4 text-green-600" />;
      case 'article':
        return <DocumentTextIcon className="w-4 h-4 text-purple-600" />;
      default:
        return <ChatBubbleLeftIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'job':
        return 'bg-blue-100 text-blue-800';
      case 'achievement':
        return 'bg-green-100 text-green-800';
      case 'article':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filters = [
    { id: 'all', name: 'All Posts' },
    { id: 'general', name: 'General' },
    { id: 'job', name: 'Job Updates' },
    { id: 'achievement', name: 'Achievements' },
    { id: 'article', name: 'Articles' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Feed</h1>
          <p className="text-gray-600">Stay updated with your network's latest activities</p>
        </div>

        {/* Create Post */}
        <div className="card mb-6">
          <div className="flex items-start space-x-4">
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
              <button
                onClick={() => setShowCreatePost(true)}
                className="w-full text-left p-4 border border-gray-300 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <span className="text-gray-500">Share something with your network...</span>
              </button>
            </div>
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Create Post</h3>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreatePost}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Post Type
                      </label>
                      <select
                        value={newPost.type}
                        onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                        className="input-field"
                      >
                        <option value="general">General</option>
                        <option value="job">Job Update</option>
                        <option value="achievement">Achievement</option>
                        <option value="article">Article</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title (optional)
                      </label>
                      <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="Add a title..."
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="What's on your mind?"
                        rows={4}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={newPost.tags.join(', ')}
                        onChange={(e) => setNewPost({ 
                          ...newPost, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                        })}
                        placeholder="react, javascript, web development"
                        className="input-field"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={newPost.isPublic}
                        onChange={(e) => setNewPost({ ...newPost, isPublic: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                        Make this post public
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreatePost(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Post'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {filters.map((filter) => (
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

        {/* Posts Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts?.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="card">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {post.author?.profileImage ? (
                      <img
                        src={post.author.profileImage}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-10 h-10 text-gray-400" />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/profile/${post.author._id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {post.author?.name}
                        </Link>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                          {getPostTypeIcon(post.type)}
                          <span className="ml-1">{post.type}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.location && (
                          <>
                            <MapPinIcon className="w-4 h-4" />
                            <span>{post.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  {post.title && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                  )}
                  <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  
                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="rounded-lg object-cover w-full h-32"
                        />
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>{post.likes?.length || 0} likes</span>
                    <span>{post.comments?.length || 0} comments</span>
                    <span>{post.views || 0} views</span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center space-x-4 border-t border-gray-200 pt-4">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
                      post.likes?.some(like => like.user === user?._id) 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                    }`}
                  >
                    {post.likes?.some(like => like.user === user?._id) ? (
                      <HeartIconSolid className="w-5 h-5" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    <span>Like</span>
                  </button>

                  <button
                    onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  >
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span>Comment</span>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <ShareIcon className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-3">
                      {post.comments.slice(0, 3).map((comment, index) => (
                        <div key={index} className="flex space-x-3">
                          {comment.user?.profileImage ? (
                            <img
                              src={comment.user.profileImage}
                              alt={comment.user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="w-8 h-8 text-gray-400" />
                          )}
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm text-gray-900">
                                  {comment.user?.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {post.comments.length > 3 && (
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          View all {post.comments.length} comments
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Add Comment */}
                {replyingTo === post._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="w-8 h-8 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a comment..."
                          rows={2}
                          className="input-field"
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => {
                              setCommentText('');
                              setReplyingTo(null);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleComment(post._id)}
                            className="btn-primary text-sm px-4 py-2"
                            disabled={!commentText.trim()}
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <ChatBubbleLeftIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">
                Be the first to share something with your network!
              </p>
              <button
                onClick={() => setShowCreatePost(true)}
                className="btn-primary"
              >
                Create your first post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed; 