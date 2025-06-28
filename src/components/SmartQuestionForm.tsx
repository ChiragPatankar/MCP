import React, { useState, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, Clock, Star, CheckCircle, MessageSquare, Brain, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Expert {
  id: number;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  rate: number;
  specialties: string[];
  matchScore: number;
  matchReason: string;
  sampleAnswer: string;
  nextAvailable: string;
  responseTime: string;
  successRate: number;
}

interface Category {
  name: string;
  confidence: number;
  keywords: string[];
  icon: string;
}

const SmartQuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<Category[]>([]);
  const [matchedExperts, setMatchedExperts] = useState<Expert[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Mock AI analysis function
  const analyzeQuestion = async (questionText: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis based on keywords
    const categories: Category[] = [];
    const experts: Expert[] = [];
    
    const questionLower = questionText.toLowerCase();
    
    // Category detection logic
    if (questionLower.includes('salary') || questionLower.includes('negotiate') || questionLower.includes('raise')) {
      categories.push({
        name: 'Career & Salary Negotiation',
        confidence: 95,
        keywords: ['salary', 'negotiate', 'raise', 'compensation'],
        icon: '💰'
      });
      
      experts.push({
        id: 1,
        name: 'Sarah Chen',
        title: 'Senior Product Manager at Google',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
        rating: 4.9,
        reviewCount: 127,
        rate: 5,
        specialties: ['Career Growth', 'Salary Negotiation', 'Product Management'],
        matchScore: 98,
        matchReason: 'Expert in tech salary negotiations with 8+ years at top companies. Has helped 200+ professionals increase their compensation by an average of 25%.',
        sampleAnswer: 'I\'d help you research market rates, prepare your negotiation strategy, and practice the conversation. We\'ll focus on timing, data-driven arguments, and alternative compensation if salary is fixed.',
        nextAvailable: 'Today 2:00 PM',
        responseTime: '< 2 hours',
        successRate: 96
      });
    }
    
    if (questionLower.includes('product') || questionLower.includes('roadmap') || questionLower.includes('feature')) {
      categories.push({
        name: 'Product Management',
        confidence: 92,
        keywords: ['product', 'roadmap', 'feature', 'strategy'],
        icon: '🚀'
      });
      
      experts.push({
        id: 2,
        name: 'Marcus Rodriguez',
        title: 'VP of Product at Stripe',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=300',
        rating: 4.8,
        reviewCount: 89,
        rate: 5,
        specialties: ['Product Strategy', 'Roadmap Planning', 'Feature Prioritization'],
        matchScore: 94,
        matchReason: 'Led product teams at 3 unicorn startups. Specializes in product strategy and has launched 15+ major features used by millions.',
        sampleAnswer: 'I\'ll help you create a framework for feature prioritization based on user impact, business value, and technical complexity. We\'ll also discuss stakeholder alignment strategies.',
        nextAvailable: 'Tomorrow 10:00 AM',
        responseTime: '< 1 hour',
        successRate: 98
      });
    }
    
    if (questionLower.includes('code') || questionLower.includes('programming') || questionLower.includes('technical')) {
      categories.push({
        name: 'Software Development',
        confidence: 88,
        keywords: ['code', 'programming', 'technical', 'algorithm'],
        icon: '💻'
      });
      
      experts.push({
        id: 3,
        name: 'David Kim',
        title: 'Principal Engineer at Meta',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
        rating: 4.9,
        reviewCount: 203,
        rate: 4,
        specialties: ['System Design', 'Code Review', 'Technical Leadership'],
        matchScore: 91,
        matchReason: 'Senior engineer with 10+ years at FAANG companies. Expert in system design, code optimization, and technical problem-solving.',
        sampleAnswer: 'I\'ll review your specific technical challenge and provide a step-by-step solution approach. We can discuss best practices, potential pitfalls, and optimization strategies.',
        nextAvailable: 'Today 4:00 PM',
        responseTime: '< 3 hours',
        successRate: 95
      });
    }
    
    if (questionLower.includes('marketing') || questionLower.includes('growth') || questionLower.includes('campaign')) {
      categories.push({
        name: 'Marketing & Growth',
        confidence: 90,
        keywords: ['marketing', 'growth', 'campaign', 'acquisition'],
        icon: '📈'
      });
      
      experts.push({
        id: 4,
        name: 'Emily Watson',
        title: 'Head of Growth at Airbnb',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
        rating: 5.0,
        reviewCount: 156,
        rate: 5,
        specialties: ['Growth Marketing', 'User Acquisition', 'Campaign Strategy'],
        matchScore: 93,
        matchReason: 'Growth expert who scaled user acquisition at 2 unicorns. Specializes in data-driven marketing and viral growth strategies.',
        sampleAnswer: 'I\'ll analyze your current marketing funnel and identify the highest-impact growth levers. We\'ll create an actionable plan with specific tactics and metrics to track.',
        nextAvailable: 'Today 6:00 PM',
        responseTime: '< 2 hours',
        successRate: 97
      });
    }
    
    // Default fallback
    if (categories.length === 0) {
      categories.push({
        name: 'General Business Strategy',
        confidence: 75,
        keywords: ['business', 'strategy', 'advice'],
        icon: '💼'
      });
      
      experts.push({
        id: 5,
        name: 'James Wilson',
        title: 'Business Strategy Consultant',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
        rating: 4.7,
        reviewCount: 98,
        rate: 4,
        specialties: ['Business Strategy', 'Problem Solving', 'Decision Making'],
        matchScore: 85,
        matchReason: 'Versatile business strategist with experience across multiple industries. Great at breaking down complex problems into actionable solutions.',
        sampleAnswer: 'I\'ll help you structure your problem, identify key factors, and develop a clear action plan. We\'ll focus on practical next steps you can implement immediately.',
        nextAvailable: 'Tomorrow 9:00 AM',
        responseTime: '< 4 hours',
        successRate: 92
      });
    }
    
    setSuggestedCategories(categories);
    setMatchedExperts(experts.slice(0, 4)); // Show top 4 matches
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    setShowResults(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      analyzeQuestion(question);
    }
  };

  const exampleQuestions = [
    "How do I negotiate my salary for a senior developer role?",
    "What's the best way to prioritize features on my product roadmap?",
    "How can I improve my team's code review process?",
    "What marketing channels should I focus on for B2B SaaS?",
    "How do I transition from individual contributor to manager?"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Question Input Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Expert Matching</h2>
          </div>
          <p className="text-gray-600">
            Describe your challenge and we'll instantly match you with the perfect expert
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              What do you need help with?
            </label>
            <div className="relative">
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Be specific about your challenge. For example: 'I'm a product manager at a startup and need help prioritizing features for our Q2 roadmap. We have limited engineering resources and competing stakeholder requests.'"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={isAnalyzing}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <span className="text-xs text-gray-400">{question.length}/500</span>
                {isAnalyzing && (
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-4 w-4 text-primary-500 animate-pulse" />
                    <span className="text-xs text-primary-600">Analyzing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!question.trim() || isAnalyzing}
            className={`w-full py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
              question.trim() && !isAnalyzing
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Finding Perfect Matches...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Find My Expert</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Example Questions */}
        {!showResults && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Try these example questions:</p>
            <div className="space-y-2">
              {exampleQuestions.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(example)}
                  className="block w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {showResults && (
        <div className="space-y-8">
          {/* Suggested Categories */}
          {suggestedCategories.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-6 w-6 text-primary-500" />
                <h3 className="text-xl font-semibold text-gray-900">Detected Categories</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedCategories.map((category, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-primary-600">{category.confidence}% confidence</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {category.keywords.map((keyword, kIndex) => (
                        <span key={kIndex} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Experts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="h-6 w-6 text-primary-500" />
              <h3 className="text-xl font-semibold text-gray-900">Best Matched Experts</h3>
              <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm font-medium">
                {matchedExperts.length} found
              </span>
            </div>

            <div className="space-y-6">
              {matchedExperts.map((expert, index) => (
                <div key={expert.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                  {/* Expert Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <img 
                        src={expert.avatar} 
                        alt={expert.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-semibold text-gray-900">{expert.name}</h4>
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          {expert.matchScore}% match
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{expert.title}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{expert.rating}</span>
                          <span className="text-gray-500">({expert.reviewCount})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-600">{expert.responseTime}</span>
                        </div>
                        <div className="text-gray-600">{expert.successRate}% success rate</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${expert.rate}</div>
                      <div className="text-gray-600 text-sm">per session</div>
                    </div>
                  </div>

                  {/* Why This Expert */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Why this expert is perfect for you:
                    </h5>
                    <p className="text-blue-800 text-sm">{expert.matchReason}</p>
                  </div>

                  {/* Sample Answer */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      How I'd approach your question:
                    </h5>
                    <p className="text-gray-700 text-sm italic">"{expert.sampleAnswer}"</p>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {expert.specialties.map((specialty, sIndex) => (
                        <span 
                          key={sIndex}
                          className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Next available:</span> {expert.nextAvailable}
                    </div>
                    <div className="flex space-x-3">
                      <Link 
                        to={`/mentor/${expert.id}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm"
                      >
                        View Profile
                      </Link>
                      <Link 
                        to={`/mentor/${expert.id}`}
                        className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-sm font-medium flex items-center space-x-2"
                      >
                        <Clock className="h-4 w-4" />
                        <span>Book Now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Try Another Question */}
          <div className="text-center">
            <button
              onClick={() => {
                setQuestion('');
                setShowResults(false);
                setAnalysisComplete(false);
                setSuggestedCategories([]);
                setMatchedExperts([]);
              }}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2 mx-auto"
            >
              <Search className="h-4 w-4" />
              <span>Ask Another Question</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartQuestionForm;