import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  const features = [
    {
      icon: BriefcaseIcon,
      title: 'Smart Job Matching',
      description: 'AI-powered job recommendations based on your skills and experience'
    },
    {
      icon: UserGroupIcon,
      title: 'Professional Networking',
      description: 'Connect with industry professionals and build meaningful relationships'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Real-time Messaging',
      description: 'Communicate seamlessly with employers and connections'
    },
    {
      icon: SparklesIcon,
      title: 'AI-Powered Insights',
      description: 'Get personalized career insights and skill recommendations'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Blockchain Security',
      description: 'Secure payments and verifiable credentials on the blockchain'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Web3 Integration',
      description: 'Connect your wallet and pay with cryptocurrency'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              The Future of
              <span className="text-gradient"> Professional Networking</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect, collaborate, and grow your career with AI-powered job matching, 
              blockchain security, and professional networking all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-3">
                    Get Started Free
                  </Link>
                  <Link to="/jobs" className="btn-outline text-lg px-8 py-3">
                    Browse Jobs
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RizeOS?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for the modern professional with cutting-edge technology and seamless user experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-hover text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using RizeOS to advance their careers.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn-primary text-lg px-8 py-3 bg-white text-gray-900 hover:bg-gray-100">
              Start Your Journey
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 