import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  LightBulbIcon,
  ChartBarIcon,
  UserGroupIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BeakerIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { 
  LightBulbIcon as LightBulbIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BriefcaseIcon as BriefcaseIconSolid
} from '@heroicons/react/24/solid';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';

const AIInsights = () => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState({
    jobRecommendations: [],
    skillRecommendations: [],
    networkSuggestions: [],
    marketInsights: {},
    careerPath: {},
    personalizedInsights: {}
  });
  
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const [
        jobRecs,
        skillRecs,
        networkSugs,
        marketInsights,
        careerPath,
        personalizedInsights
      ] = await Promise.all([
        aiService.getJobRecommendations(user._id, 5),
        aiService.getSkillRecommendations(user._id, 5),
        aiService.getNetworkSuggestions(user._id, 5),
        aiService.getMarketInsights(),
        aiService.getCareerPathSuggestions(user._id),
        aiService.getPersonalizedInsights(user._id)
      ]);

      setInsights({
        jobRecommendations: jobRecs.recommendations || [],
        skillRecommendations: skillRecs.recommendations || [],
        networkSuggestions: networkSugs.suggestions || [],
        marketInsights: marketInsights,
        careerPath: careerPath,
        personalizedInsights: personalizedInsights
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast.error('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'recommendations', name: 'Recommendations', icon: LightBulbIconSolid },
    { id: 'skills', name: 'Skills', icon: AcademicCapIcon },
    { id: 'network', name: 'Network', icon: UserGroupIconSolid },
    { id: 'market', name: 'Market', icon: ChartBarIconSolid },
    { id: 'career', name: 'Career', icon: BriefcaseIconSolid }
  ];

  const InsightCard = ({ title, description, icon: Icon, color = 'blue', children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );

  const RecommendationItem = ({ title, description, matchScore, type, action }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          {matchScore && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              {matchScore}% match
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={action}
        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        View
      </button>
    </div>
  );

  const SkillProgress = ({ skill, progress, level }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{skill}</span>
        <span className="text-xs text-gray-500 capitalize">{level}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  const MarketTrend = ({ trend, value, change }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{trend}</p>
        <p className="text-xs text-gray-500">{value}</p>
      </div>
      <div className="flex items-center">
        {change > 0 ? (
          <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowTrendingUpIcon className="w-4 h-4 text-red-500 transform rotate-180" />
        )}
        <span className={`text-sm font-medium ml-1 ${
          change > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
              <p className="text-gray-600">Intelligent recommendations powered by AI</p>
            </div>
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
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <InsightCard
              title="Job Recommendations"
              description="AI-powered job matches based on your skills and preferences"
              icon={BriefcaseIcon}
              color="blue"
            >
              <div className="space-y-3">
                {insights.jobRecommendations.map((job, index) => (
                  <RecommendationItem
                    key={index}
                    title={job.title}
                    description={job.company}
                    matchScore={job.matchScore}
                    type="job"
                    action={() => window.location.href = `/jobs/${job._id}`}
                  />
                ))}
                {insights.jobRecommendations.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No job recommendations available. Update your profile to get personalized recommendations.
                  </p>
                )}
              </div>
            </InsightCard>

            <InsightCard
              title="Personalized Insights"
              description="AI analysis of your professional growth and opportunities"
              icon={LightBulbIcon}
              color="yellow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Growth Opportunities</h4>
                  <p className="text-sm text-blue-700">
                    {insights.personalizedInsights.growthOpportunities || 'Focus on skill development and networking'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Market Position</h4>
                  <p className="text-sm text-green-700">
                    {insights.personalizedInsights.marketPosition || 'Strong profile with room for improvement'}
                  </p>
                </div>
              </div>
            </InsightCard>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <InsightCard
              title="Skill Development"
              description="AI-recommended skills to enhance your professional profile"
              icon={AcademicCapIcon}
              color="green"
            >
              <div className="space-y-4">
                {insights.skillRecommendations.map((skill, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{skill.name}</h4>
                      <span className="text-sm text-gray-500">{skill.demand}% demand</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        Learn
                      </button>
                      <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        Add to Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </InsightCard>

            <InsightCard
              title="Learning Path"
              description="Personalized learning recommendations based on your goals"
              icon={RocketLaunchIcon}
              color="purple"
            >
              <div className="space-y-3">
                {insights.careerPath.learningPath?.map((path, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{path.title}</h4>
                      <p className="text-sm text-gray-600">{path.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </InsightCard>
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <InsightCard
              title="Network Suggestions"
              description="AI-recommended professionals to connect with"
              icon={UserGroupIcon}
              color="blue"
            >
              <div className="space-y-3">
                {insights.networkSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{suggestion.name}</h4>
                        <p className="text-sm text-gray-600">{suggestion.title} at {suggestion.company}</p>
                        <p className="text-xs text-gray-500">{suggestion.mutualConnections} mutual connections</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </InsightCard>
          </div>
        )}

        {/* Market Tab */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            <InsightCard
              title="Market Trends"
              description="AI analysis of industry trends and opportunities"
              icon={ChartBarIcon}
              color="green"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Top Growing Skills</h4>
                  {insights.marketInsights.topSkills?.map((skill, index) => (
                    <MarketTrend
                      key={index}
                      trend={skill.name}
                      value={`${skill.growth}% growth`}
                      change={skill.growth}
                    />
                  ))}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Industry Trends</h4>
                  {insights.marketInsights.industryTrends?.map((trend, index) => (
                    <MarketTrend
                      key={index}
                      trend={trend.industry}
                      value={trend.description}
                      change={trend.growth}
                    />
                  ))}
                </div>
              </div>
            </InsightCard>

            <InsightCard
              title="Salary Insights"
              description="AI-powered salary analysis and compensation trends"
              icon={CurrencyDollarIcon}
              color="yellow"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Average Salary</h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    ${insights.marketInsights.averageSalary || '75,000'}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Salary Growth</h4>
                  <p className="text-2xl font-bold text-green-600">
                    +{insights.marketInsights.salaryGrowth || '8'}%
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Market Demand</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {insights.marketInsights.marketDemand || 'High'}
                  </p>
                </div>
              </div>
            </InsightCard>
          </div>
        )}

        {/* Career Tab */}
        {activeTab === 'career' && (
          <div className="space-y-6">
            <InsightCard
              title="Career Path Analysis"
              description="AI-powered career progression recommendations"
              icon={BriefcaseIcon}
              color="purple"
            >
              <div className="space-y-4">
                {insights.careerPath.steps?.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                          {step.timeline}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          {step.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InsightCard>

            <InsightCard
              title="Professional Development"
              description="AI-curated development opportunities and resources"
              icon={StarIcon}
              color="yellow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Certifications</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• AWS Certified Solutions Architect</li>
                    <li>• Google Cloud Professional</li>
                    <li>• Microsoft Azure Administrator</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Learning Resources</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Coursera Specializations</li>
                    <li>• Udemy Advanced Courses</li>
                    <li>• Industry Conferences</li>
                  </ul>
                </div>
              </div>
            </InsightCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights; 