import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  EyeIcon,
  StarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import {
  getCurrentUser
} from '../store/slices/authSlice';
import {
  fetchMyJobs,
  fetchMyApplications
} from '../store/slices/jobSlice';
import {
  fetchPosts
} from '../store/slices/postSlice';
import {
  getUnreadCount
} from '../store/slices/notificationSlice';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { jobs: userJobs, applications } = useSelector(state => state.jobs);
  const { posts: userPosts } = useSelector(state => state.posts);
  const { unreadCount } = useSelector(state => state.notifications);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalConnections: 0,
    totalEarnings: 0,
    profileCompletion: 0
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user data and related information
      await Promise.all([
        dispatch(getCurrentUser()),
        dispatch(fetchMyJobs()),
        dispatch(fetchMyApplications()),
        dispatch(fetchPosts()),
        dispatch(getUnreadCount())
      ]);

      // Calculate profile completion
      const profileFields = ['name', 'bio', 'skills', 'profileImage', 'location'];
      const completedFields = profileFields.filter(field => user?.[field]);
      const completionPercentage = Math.round((completedFields.length / profileFields.length) * 100);

      setStats({
        totalViews: user?.profileViews || 0,
        totalConnections: (user?.followerCount || 0) + (user?.followingCount || 0),
        totalEarnings: user?.totalEarnings || 0,
        profileCompletion: completionPercentage
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getRecentActivity = () => {
    const activities = [];

    // Add recent posts
    if (userPosts?.length > 0) {
      activities.push(...userPosts.slice(0, 3).map(post => ({
        type: 'post',
        title: post.title,
        date: new Date(post.createdAt),
        id: post._id
      })));
    }

    // Add recent job applications
    if (applications?.length > 0) {
      activities.push(...applications.slice(0, 3).map(app => ({
        type: 'application',
        title: `Applied to ${app.job.title}`,
        date: new Date(app.application.appliedAt),
        id: app.job._id
      })));
    }

    return activities.sort((a, b) => b.date - a.date).slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your professional network today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <EyeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Connections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalConnections}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <StarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.profileCompletion}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/jobs/create" className="card-hover text-center p-6">
            <BriefcaseIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Post a Job</h3>
            <p className="text-sm text-gray-600">Hire talented professionals</p>
          </Link>

          <Link to="/network" className="card-hover text-center p-6">
            <UserGroupIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Expand Network</h3>
            <p className="text-sm text-gray-600">Connect with professionals</p>
          </Link>

          <Link to="/feed" className="card-hover text-center p-6">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Share Update</h3>
            <p className="text-sm text-gray-600">Post to your network</p>
          </Link>

          <Link to="/messages" className="card-hover text-center p-6 relative">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Messages</h3>
            <p className="text-sm text-gray-600">Check your inbox</p>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <Link to="/profile" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                {getRecentActivity().length > 0 ? (
                  getRecentActivity().map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {activity.type === 'post' ? (
                          <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
                        ) : (
                          <BriefcaseIcon className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">
                          {activity.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent activity</p>
                    <Link to="/feed" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Start sharing updates
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Applications */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Job Applications</h3>
                <Link to="/jobs" className="text-primary-600 hover:text-primary-700 text-sm">
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {applications?.slice(0, 3).map((app, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <BriefcaseIcon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {app.job.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.application.status}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {app.application.status === 'accepted' && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                      {app.application.status === 'pending' && (
                        <ClockIcon className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}

                {(!applications || applications.length === 0) && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No applications yet</p>
                    <Link to="/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Browse jobs
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Network Insights */}
        <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Insights</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile views this week</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.floor(stats.totalViews * 0.3)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New connections</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.floor(stats.totalConnections * 0.1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Messages received</span>
                  <span className="text-sm font-medium text-gray-900">
                    {unreadCount}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link to="/network" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Expand your network →
                </Link>
              </div>
            </div>

            {/* Premium Features */}
            {user?.premiumFeatures?.isPremium ? (
              <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <div className="flex items-center mb-3">
                  <StarIcon className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Premium Member</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  You have access to all premium features including advanced analytics and priority support.
                </p>
                <Link to="/profile" className="text-yellow-700 hover:text-yellow-800 text-sm font-medium">
                  Manage subscription →
                </Link>
              </div>
            ) : (
              <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <div className="flex items-center mb-3">
                  <ChartBarIcon className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Upgrade to Premium</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Get advanced analytics, priority support, and exclusive networking features.
                </p>
                <Link to="/profile" className="text-purple-700 hover:text-purple-800 text-sm font-medium">
                  Learn more →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 