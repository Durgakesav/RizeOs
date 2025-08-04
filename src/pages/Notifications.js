import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  BellIcon,
  CheckIcon,
  TrashIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  HeartIcon,
  StarIcon,
  EyeIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} from '../store/slices/notificationSlice';
import toast from 'react-hot-toast';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector(state => state.notifications);
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [selectedFilter]);

  const loadNotifications = async () => {
    try {
      await dispatch(fetchNotifications({ unreadOnly: selectedFilter === 'unread' }));
    } catch (error) {
      toast.error('Failed to load notifications');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(markAsRead(notificationId));
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead());
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await dispatch(deleteNotification(notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return <UserPlusIcon className="w-5 h-5 text-blue-600" />;
      case 'message':
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-600" />;
      case 'job':
        return <BriefcaseIcon className="w-5 h-5 text-purple-600" />;
      case 'like':
        return <HeartIcon className="w-5 h-5 text-red-600" />;
      case 'endorsement':
        return <StarIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'follow':
        return 'bg-blue-50 border-blue-200';
      case 'message':
        return 'bg-green-50 border-green-200';
      case 'job':
        return 'bg-purple-50 border-purple-200';
      case 'like':
        return 'bg-red-50 border-red-200';
      case 'endorsement':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationMessage = (notification) => {
    const { type, sender, relatedJob, relatedPost } = notification;
    
    switch (type) {
      case 'follow':
        return `${sender?.name} started following you`;
      case 'message':
        return `${sender?.name} sent you a message`;
      case 'job_application':
        return `${sender?.name} applied to your job posting`;
      case 'job_accepted':
        return `Your application for ${relatedJob?.title} was accepted`;
      case 'job_rejected':
        return `Your application for ${relatedJob?.title} was not selected`;
      case 'like':
        return `${sender?.name} liked your post`;
      case 'comment':
        return `${sender?.name} commented on your post`;
      case 'endorsement':
        return `${sender?.name} endorsed your ${notification.skill} skill`;
      case 'recommendation':
        return `${sender?.name} wrote you a recommendation`;
      default:
        return notification.message || 'You have a new notification';
    }
  };

  const getNotificationLink = (notification) => {
    const { type, relatedJob, relatedPost, sender } = notification;
    
    switch (type) {
      case 'follow':
        return `/profile/${sender?._id}`;
      case 'message':
        return `/messages?user=${sender?._id}`;
      case 'job_application':
      case 'job_accepted':
      case 'job_rejected':
        return `/jobs/${relatedJob?._id}`;
      case 'like':
      case 'comment':
        return `/feed?post=${relatedPost?._id}`;
      case 'endorsement':
      case 'recommendation':
        return `/profile/${sender?._id}`;
      default:
        return '#';
    }
  };

  const filterOptions = [
    { id: 'all', name: 'All Notifications' },
    { id: 'unread', name: 'Unread Only' },
    { id: 'follow', name: 'Follows' },
    { id: 'message', name: 'Messages' },
    { id: 'job', name: 'Jobs' },
    { id: 'like', name: 'Likes' },
    { id: 'endorsement', name: 'Endorsements' }
  ];

  const filteredNotifications = notifications?.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">
                Stay updated with your network's activities
                {unreadCount > 0 && (
                  <span className="ml-2 text-primary-600 font-medium">
                    ({unreadCount} unread)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="btn-outline text-sm"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {filterOptions.map((filter) => (
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

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`card border-l-4 border-l-primary-500 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Notification Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {getNotificationMessage(notification)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Mark as read"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification._id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete notification"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Related Content Preview */}
                    {(notification.relatedJob || notification.relatedPost) && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        {notification.relatedJob && (
                          <div className="flex items-center space-x-2">
                            <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {notification.relatedJob.title}
                            </span>
                          </div>
                        )}
                        {notification.relatedPost && (
                          <div className="flex items-center space-x-2">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {notification.relatedPost.content?.substring(0, 50)}...
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 mt-3">
                      <Link
                        to={getNotificationLink(notification)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View details
                      </Link>
                      {notification.sender && (
                        <Link
                          to={`/profile/${notification.sender._id}`}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          View profile
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500 mb-4">
                {selectedFilter === 'unread' 
                  ? 'You\'re all caught up! No unread notifications.'
                  : 'You don\'t have any notifications yet.'
                }
              </p>
              {selectedFilter !== 'all' && (
                <button
                  onClick={() => setSelectedFilter('all')}
                  className="btn-primary"
                >
                  View all notifications
                </button>
              )}
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <button className="btn-outline">
              Load more notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 