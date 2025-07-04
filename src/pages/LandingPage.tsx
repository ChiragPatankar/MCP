import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Zap, 
  BarChart3, 
  Users, 
  Globe, 
  Check, 
  ChevronRight, 
  Menu, 
  X,
  Sparkles,
  Bot,
  Shield,
  Rocket,
  Star,
  ArrowRight,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import LandingPageChat from '@/components/LandingPageChat';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const features = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI-Powered Intelligence",
      description: "Advanced Gemini AI that understands context and provides human-like responses to complex customer queries.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Multi-Tenant",
      description: "Scale across multiple websites and brands with isolated data and custom configurations.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Setup",
      description: "Deploy in under 5 minutes with our simple JavaScript snippet. No coding experience required.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Intelligent Analytics",
      description: "Real-time insights, sentiment analysis, and performance metrics to optimize your support.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for trying out our platform",
      features: [
        "1 Chat Bot",
        "100 messages/month",
        "Basic Analytics",
        "Email Support",
        "Knowledge Base (5MB)"
      ],
      cta: "Get Started Free",
      highlighted: false,
      mostPopular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Best for growing businesses",
      features: [
        "5 Chat Bots",
        "2,000 messages/month",
        "Advanced Analytics",
        "Priority Support",
        "Knowledge Base (50MB)",
        "Custom Branding",
        "API Access"
      ],
      cta: "Start 14-Day Trial",
      highlighted: true,
      mostPopular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large-scale operations",
      features: [
        "Unlimited Chat Bots",
        "Unlimited messages",
        "Full Analytics Suite",
        "24/7 Phone Support",
        "Unlimited Knowledge Base",
        "White-label Solution",
        "Custom Integrations",
        "Dedicated Account Manager"
      ],
      cta: "Contact Sales",
      highlighted: false,
      mostPopular: false
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Customer Success",
      company: "TechFlow",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "MCP Chat Support reduced our response time by 85% and improved customer satisfaction significantly. The AI is incredibly smart.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      company: "DataVault",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "Setup was seamless, and the multi-tenant architecture is exactly what we needed for our various product lines.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Support Manager",
      company: "CloudScale",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "The analytics insights helped us identify and fix knowledge gaps we didn't even know existed. Game changer!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between h-16 items-center">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-2.5 rounded-xl shadow-lg">
                <MessageSquare className="h-6 w-6" />
              </div>
              <span className="ml-3 text-xl font-bold text-gradient">MCP Chat Support</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>
            
            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" className="btn-secondary">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-modern">
                  Start Free Trial
                </Button>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-white/50 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden glass border-t border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="px-4 py-4 space-y-3">
              {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-white/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button className="w-full btn-modern">Start Free Trial</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-mesh min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-fade"></div>
        <div className="max-w-7xl mx-auto py-12 md:py-16 lg:py-20 container-padding relative w-full">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <motion.div 
              className="lg:col-span-6 lg:pr-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-4"
              >
                <Sparkles className="h-3 w-3 mr-2" />
                AI-Powered Customer Support Revolution
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
              >
                <span className="block text-gray-900">Transform</span>
                <span className="block text-gradient">Customer Support</span>
                <span className="block text-gray-900">with AI</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl text-balance"
              >
                Deploy an intelligent AI chatbot powered by Google Gemini that learns from your knowledge base and provides instant, accurate support to your customers 24/7.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <Link to="/signup">
                  <Button size="lg" className="btn-modern group">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <button className="btn-secondary group flex items-center justify-center">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                    (2 min)
                  </span>
                </button>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="flex items-center space-x-4 text-sm text-gray-500"
              >
                <div className="flex items-center">
                  <Check className="h-3 w-3 text-green-500 mr-1" />
                  Free 14-day trial
                </div>
                <div className="flex items-center">
                  <Check className="h-3 w-3 text-green-500 mr-1" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Check className="h-3 w-3 text-green-500 mr-1" />
                  5-minute setup
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:col-span-6 mt-8 lg:mt-0"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-2xl blur-2xl opacity-20 transform scale-105"></div>
                
                {/* Main demo container */}
                <div className="relative card-glass p-4 md:p-6 rounded-2xl">
                  <div className="bg-gray-100 rounded-xl p-4 mb-4">
                    {/* Mock browser header */}
                    <div className="flex items-center mb-3">
                      <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                        <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                        <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="flex-1 mx-3 bg-white rounded-lg px-3 py-1 text-xs text-gray-500">
                        yourwebsite.com
                      </div>
                    </div>
                    
                    {/* Mock website content */}
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  
                  {/* Chat widget preview */}
                  <div className="flex justify-end">
                    <div className="bg-white rounded-xl shadow-large border p-3 w-64">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-2">
                          <p className="font-semibold text-gray-900 text-sm">AI Assistant</p>
                          <p className="text-xs text-green-500 flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                            Online
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="bg-gray-100 rounded-lg p-2">
                          <p className="text-xs text-gray-700">
                            👋 Hi! How can I help you today?
                          </p>
                        </div>
                        <div className="bg-primary-500 text-white rounded-lg p-2 ml-6">
                          <p className="text-xs">
                            What's your refund policy?
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-2">
                          <p className="text-xs text-gray-700">
                            We offer a 30-day money-back guarantee on all plans. Would you like me to explain the process? 😊
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1.5">
                        <input 
                          placeholder="Type your message..." 
                          className="flex-1 bg-transparent text-xs placeholder-gray-500 outline-none"
                          disabled
                        />
                        <button className="p-1 bg-primary-500 text-white rounded-md">
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating indicators */}
                  <div className="absolute -top-3 -left-3 bg-white rounded-lg shadow-lg p-2 border">
                    <div className="flex items-center text-xs">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1"></div>
                      <span className="text-gray-600">AI Learning...</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-3 -right-3 bg-white rounded-lg shadow-lg p-2 border">
                    <div className="flex items-center text-xs">
                      <Zap className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-gray-600">Instant Responses</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Support
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer support with the power of AI
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-modern p-8 text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your business needs
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`relative card-modern p-8 ${plan.highlighted ? 'shadow-glow border-primary-200' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {plan.mostPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/signup" className="block">
                  <Button 
                    className={`w-full ${plan.highlighted ? 'btn-modern' : 'btn-secondary'}`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See how companies are transforming their customer support
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="card-modern p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto container-padding text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Support?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using AI to deliver exceptional customer experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50 shadow-xl">
                  Start Free Trial
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
            
            <p className="text-blue-100 text-sm mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto container-padding py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="bg-primary-500 p-2 rounded-xl">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <span className="ml-2 text-xl font-bold">MCP Chat Support</span>
              </div>
              <p className="text-gray-400 mb-6">
                Transforming customer support with AI-powered solutions for businesses of all sizes.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact-support" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link to="/status" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MCP Chat Support. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Interactive Chat Widget */}
      <LandingPageChat />
    </div>
  );
};

export default LandingPage;