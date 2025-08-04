import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CogIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { 
  ChartBarIcon as ChartBarIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  DocumentTextIcon as DocumentTextIconSolid
} from '@heroicons/react/24/solid';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/dashboard?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIconSolid },
    { id: 'profile', name: 'Profile', icon: UserGroupIconSolid },
    { id: 'jobs', name: 'Jobs', icon: BriefcaseIconSolid },
    { id: 'content', name: 'Content', icon: DocumentTextIconSolid }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ml-1 ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const ActivityChart = () => (
    <div className="space-y-4">
      {analytics?.activityMetrics?.weeklyActivity?.map((day, index) => (
        <div key={index} className="flex items-center">
          <div className="w-16 text-sm font-medium text-gray-600 capitalize">
            {day.day}
          </div>
          <div className="flex-1 ml-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(day.sessions / 10) * 100}%` }}
              />
            </div>
          </div>
          <div className="w-12 text-sm text-gray-500 text-right">
            {day.sessions}
          </div>
        </div>
      ))}
    </div>
  );

  const SkillsChart = () => (
    <div className="space-y-3">
      {analytics?.skillAnalytics?.topSkills?.slice(0, 5).map((skill, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <StarIcon className="w-4 h-4 text-blue-600" />
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">{skill.skill}</span>
          </div>
          <div className="flex items-center">
            <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(skill.endorsements / 10) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{skill.endorsements}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const NetworkGrowth = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">
          {analytics?.networkGrowth?.followers || 0}
        </div>
        <div className="text-sm text-gray-600 mt-1">Followers</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600">
          {analytics?.networkGrowth?.following || 0}
        </div>
        <div className="text-sm text-gray-600 mt-1">Following</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-purple-600">
          {analytics?.networkGrowth?.connections || 0}
        </div>
        <div className="text-sm text-gray-600 mt-1">Connections</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your professional growth and platform engagement</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Profile Views"
                value={analytics?.profileViews?.total || 0}
                change={analytics?.profileViews?.thisWeek > 0 ? 12 : -5}
                icon={EyeIcon}
                color="blue"
              />
              <MetricCard
                title="Network Growth"
                value={analytics?.networkGrowth?.followers || 0}
                change={analytics?.networkGrowth?.followerGrowth || 0}
                icon={UserGroupIcon}
                color="green"
              />
              <MetricCard
                title="Content Engagement"
                value={analytics?.contentPerformance?.engagementRate || 0}
                change={8}
                icon={HeartIcon}
                color="red"
              />
              <MetricCard
                title="Active Sessions"
                value={analytics?.activityMetrics?.totalSessions || 0}
                change={15}
                icon={ClockIcon}
                color="purple"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Weekly Activity">
                <ActivityChart />
              </ChartCard>
              
              <ChartCard title="Top Skills">
                <SkillsChart />
              </ChartCard>
            </div>

            {/* Network Growth */}
            <ChartCard title="Network Overview">
              <NetworkGrowth />
            </ChartCard>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Total Views"
                value={analytics?.profileViews?.total || 0}
                icon={EyeIcon}
                color="blue"
              />
              <MetricCard
                title="Unique Visitors"
                value={analytics?.profileViews?.uniqueVisitors || 0}
                icon={UserGroupIcon}
                color="green"
              />
              <MetricCard
                title="This Week"
                value={analytics?.profileViews?.thisWeek || 0}
                icon={ArrowTrendingUpIcon}
                color="purple"
              />
            </div>

            <ChartCard title="Profile Visitors">
              <div className="space-y-4">
                {analytics?.profileViews?.topVisitors?.slice(0, 5).map((visitor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Visitor {index + 1}</p>
                        <p className="text-xs text-gray-500">{visitor.count} visits</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(visitor.lastVisit).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Jobs Posted"
                value={analytics?.jobPerformance?.jobsPosted || 0}
                icon={BriefcaseIcon}
                color="blue"
              />
              <MetricCard
                title="Applications"
                value={analytics?.jobPerformance?.applicationsReceived || 0}
                icon={DocumentTextIcon}
                color="green"
              />
              <MetricCard
                title="Interview Rate"
                value={`${analytics?.jobPerformance?.interviewRate || 0}%`}
                icon={ChatBubbleLeftRightIcon}
                color="purple"
              />
              <MetricCard
                title="Hire Rate"
                value={`${analytics?.jobPerformance?.hireRate || 0}%`}
                icon={StarIcon}
                color="yellow"
              />
            </div>

            <ChartCard title="Job Performance">
              <div className="space-y-4">
                {analytics?.jobPerformance?.topPerformingJobs?.slice(0, 5).map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BriefcaseIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Job {index + 1}</p>
                        <p className="text-xs text-gray-500">{job.views} views</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{job.applications}</p>
                      <p className="text-xs text-gray-500">applications</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Posts Created"
                value={analytics?.contentPerformance?.postsCreated || 0}
                icon={DocumentTextIcon}
                color="blue"
              />
              <MetricCard
                title="Total Likes"
                value={analytics?.contentPerformance?.totalLikes || 0}
                icon={HeartIcon}
                color="red"
              />
              <MetricCard
                title="Total Comments"
                value={analytics?.contentPerformance?.totalComments || 0}
                icon={ChatBubbleLeftRightIcon}
                color="green"
              />
              <MetricCard
                title="Engagement Rate"
                value={`${analytics?.contentPerformance?.engagementRate || 0}%`}
                icon={ArrowTrendingUpIcon}
                color="purple"
              />
            </div>

            <ChartCard title="Content Performance">
              <div className="space-y-4">
                {analytics?.contentPerformance?.topPosts?.slice(0, 5).map((post, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <DocumentTextIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Post {index + 1}</p>
                        <p className="text-xs text-gray-500">{post.content}</p>
                      </div>
                    </div>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 