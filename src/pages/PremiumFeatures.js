import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  StarIcon, 
  ChartBarIcon, 
  MagnifyingGlassIcon, 
  BellIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CogIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const PremiumFeatures = () => {
  const { user } = useSelector(state => state.auth);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      name: 'Basic',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Basic job search',
        'Standard profile',
        'Limited messaging',
        'Basic analytics',
        'Standard support'
      ],
      limitations: [
        'No advanced search filters',
        'Limited profile views',
        'No priority support',
        'No custom branding'
      ]
    },
    {
      name: 'Professional',
      price: { monthly: 29, yearly: 290 },
      features: [
        'Advanced job search',
        'Enhanced profile',
        'Unlimited messaging',
        'Advanced analytics',
        'Priority support',
        'Saved searches',
        'Job alerts',
        'Network insights'
      ],
      limitations: [
        'No custom branding',
        'No API access',
        'No dedicated manager'
      ]
    },
    {
      name: 'Enterprise',
      price: { monthly: 99, yearly: 990 },
      features: [
        'All Professional features',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced reporting',
        'White-label options',
        'Custom workflows'
      ],
      limitations: []
    }
  ];

  const premiumFeatures = [
    {
      category: 'Advanced Search & Discovery',
      icon: MagnifyingGlassIcon,
      features: [
        'Advanced filters and search options',
        'Saved searches and alerts',
        'Competitor analysis',
        'Market insights',
        'Semantic search capabilities'
      ]
    },
    {
      category: 'Enhanced Analytics',
      icon: ChartBarIcon,
      features: [
        'Comprehensive analytics dashboard',
        'Custom reports and scheduling',
        'Data export and analysis tools',
        'Predictive analytics',
        'Industry benchmarking'
      ]
    },
    {
      category: 'Priority Support',
      icon: BellIcon,
      features: [
        'Dedicated customer support',
        'Priority feature requests',
        'Beta access to new features',
        'Custom integrations',
        'Dedicated account manager'
      ]
    },
    {
      category: 'Custom Branding',
      icon: ShieldCheckIcon,
      features: [
        'Custom branding options',
        'Enhanced profile customization',
        'Custom domains',
        'API access',
        'Custom workflows'
      ]
    },
    {
      category: 'AI-Powered Insights',
      icon: SparklesIcon,
      features: [
        'Advanced AI recommendations',
        'Career path guidance',
        'Skill development insights',
        'Market trend analysis',
        'Personalized content curation'
      ]
    },
    {
      category: 'Advanced Networking',
      icon: UserGroupIcon,
      features: [
        'Advanced connection analytics',
        'Network growth insights',
        'Professional recommendations',
        'Skill endorsements',
        'Connection strength tracking'
      ]
    }
  ];

  const handleUpgrade = async (planName) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully upgraded to ${planName} plan!`);
    } catch (error) {
      toast.error('Failed to upgrade plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Unlock Premium Features
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Take your professional journey to the next level with advanced tools and insights
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedPlan === 'monthly'
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedPlan === 'yearly'
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                plan.name === 'Professional' ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.name === 'Professional' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price[selectedPlan]}
                  </span>
                  {plan.price[selectedPlan] > 0 && (
                    <span className="text-gray-500 ml-2">
                      /{selectedPlan === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                {plan.price[selectedPlan] === 0 && (
                  <p className="text-green-600 font-medium">Free Forever</p>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-center">
                      <XMarkIcon className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => handleUpgrade(plan.name)}
                disabled={isLoading || plan.name === 'Basic'}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.name === 'Professional'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : plan.name === 'Enterprise'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                } disabled:opacity-50`}
              >
                {isLoading ? 'Processing...' : plan.name === 'Basic' ? 'Current Plan' : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Premium Feature Categories
          </h2>
          <p className="text-xl text-gray-600">
            Discover all the advanced features available with premium plans
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {premiumFeatures.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <category.icon className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">{category.category}</h3>
              </div>
              <ul className="space-y-3">
                {category.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <StarIconSolid className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Professional Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of professionals who have already upgraded to premium
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleUpgrade('Professional')}
              disabled={isLoading}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => handleUpgrade('Enterprise')}
              disabled={isLoading}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors disabled:opacity-50"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures; 