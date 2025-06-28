import React from 'react';
import SmartQuestionForm from '../components/SmartQuestionForm';
import { Brain, Zap, Target, Users } from 'lucide-react';

const SmartMatch: React.FC = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary-500" />,
      title: "AI-Powered Analysis",
      description: "Our AI analyzes your question to understand the context, complexity, and specific expertise needed"
    },
    {
      icon: <Target className="h-8 w-8 text-secondary-500" />,
      title: "Smart Categorization",
      description: "Automatically categorizes your question and identifies the most relevant expert domains"
    },
    {
      icon: <Users className="h-8 w-8 text-accent-500" />,
      title: "Perfect Matching",
      description: "Matches you with experts based on their experience, success rate, and relevance to your specific challenge"
    },
    {
      icon: <Zap className="h-8 w-8 text-green-500" />,
      title: "Instant Results",
      description: "Get matched with 3-5 perfect experts in seconds, complete with explanations of why they're ideal for you"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Smart Expert Matching
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Describe your challenge and our AI will instantly find the perfect experts for your specific needs
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How Our AI Matching Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Question Form */}
        <SmartQuestionForm />

        {/* Benefits */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Use Smart Matching?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-primary-600">95%</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Match Accuracy</h3>
              <p className="text-gray-600 text-sm">Our AI achieves 95% accuracy in matching users with the right experts</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-secondary-600">3x</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Faster Results</h3>
              <p className="text-gray-600 text-sm">Get matched 3x faster than browsing through expert profiles manually</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-accent-600">98%</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Satisfaction Rate</h3>
              <p className="text-gray-600 text-sm">Users report 98% satisfaction with AI-matched expert sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartMatch;