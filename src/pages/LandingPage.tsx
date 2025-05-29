import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Zap, BarChart, Users, Globe, Check, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "AI-Powered Chat Support",
      description: "Train the bot with your knowledge base and let it handle customer queries 24/7."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Multi-Tenant Architecture",
      description: "Manage multiple businesses from a single platform with isolated data and configurations."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Instant Deployment",
      description: "Get your AI support bot up and running in minutes with a simple JavaScript snippet."
    },
    {
      icon: <BarChart className="h-6 w-6 text-primary" />,
      title: "Advanced Analytics",
      description: "Gain insights into customer interactions, sentiment analysis, and resolution rates."
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "1 Chat Bot",
        "100 messages/month",
        "Basic Analytics",
        "Email Support"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Starter",
      price: "$49",
      features: [
        "3 Chat Bots",
        "2,000 messages/month",
        "Advanced Analytics",
        "Knowledge Base (10MB)",
        "Priority Support"
      ],
      cta: "Start 14-Day Trial",
      highlighted: true
    },
    {
      name: "Pro",
      price: "$99",
      features: [
        "10 Chat Bots",
        "10,000 messages/month",
        "Full Analytics Suite",
        "Knowledge Base (50MB)",
        "Custom Widget Branding",
        "24/7 Support"
      ],
      cta: "Start 14-Day Trial",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="bg-primary text-white p-2 rounded-md">
                <MessageSquare className="h-6 w-6" />
              </div>
              <span className="ml-2 text-xl font-bold">MCP Chat Support</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">Testimonials</a>
              <a href="#faq" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">FAQ</a>
            </nav>
            
            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Link to="/login" className="block w-full px-5 py-3 text-center font-medium text-primary bg-gray-50 hover:bg-gray-100 rounded-md">
                    Log in
                  </Link>
                </div>
                <div className="mt-3">
                  <Link to="/signup" className="block w-full px-5 py-3 text-center font-medium text-white bg-primary hover:bg-primary-dark rounded-md">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <motion.div 
              className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Transform Your</span>
                <span className="block text-primary">Customer Support</span>
                <span className="block">with AI</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Empower your business with an intelligent AI chatbot that learns from your knowledge base and provides instant support to your customers 24/7.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center lg:justify-start">
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started Free
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </a>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  No credit card required. 14-day free trial.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <div className="relative bg-gray-100 rounded-lg h-[400px] overflow-hidden">
                    {/* Mock website background */}
                    <div className="absolute inset-0 p-4">
                      <div className="h-8 w-full bg-gray-200 rounded mb-4"></div>
                      <div className="h-32 w-full bg-gray-200 rounded mb-4"></div>
                      <div className="h-12 w-3/4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 w-1/2 bg-gray-200 rounded mb-4"></div>
                    </div>
                    
                    {/* Chat widget button */}
                    <div className="absolute bottom-4 right-4">
                      <button className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-primary">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </button>
                    </div>
                    
                    {/* Chat widget panel */}
                    <div className="absolute bottom-20 right-4 w-72 bg-white rounded-lg shadow-xl overflow-hidden">
                      <div className="p-4 bg-primary">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                          <p className="ml-2 font-medium text-white">Support Bot</p>
                        </div>
                      </div>
                      <div className="p-4 h-64 bg-gray-50">
                        <div className="inline-block bg-white rounded-lg p-3 mb-4 shadow-sm">
                          <p className="text-sm text-gray-800">Hello! How can I help you today?</p>
                        </div>
                      </div>
                      <div className="p-3 border-t bg-white">
                        <div className="flex">
                          <input 
                            type="text" 
                            placeholder="Type your message..." 
                            className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none"
                            readOnly
                          />
                          <button className="px-4 py-2 bg-primary text-white rounded-r-md">
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for intelligent support
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides all the tools you need to create, train, and deploy AI-powered customer support.
            </p>
          </div>
          
          <motion.div 
            className="mt-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <motion.div 
                  key={feature.title} 
                  className="relative"
                  variants={fadeInUp}
                >
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-50 text-primary">
                      {feature.icon}
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Plans for businesses of all sizes
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 sm:mx-auto">
              Choose the plan that works best for your business needs.
            </p>
          </div>
          
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-auto xl:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`bg-white rounded-lg shadow-md divide-y divide-gray-200 ${plan.highlighted ? 'border-2 border-primary ring-2 ring-primary ring-opacity-20' : ''}`}>
                <div className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <Link to="/signup">
                    <Button 
                      className={`mt-8 w-full ${plan.highlighted ? '' : 'bg-primary/90 hover:bg-primary'}`}
                      variant={plan.highlighted ? 'default' : 'default'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
                <div className="px-6 pt-6 pb-8">
                  <h4 className="text-xs uppercase tracking-wide font-semibold text-gray-500">What's included</h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="ml-3 text-base text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-base text-gray-500">
              Need a custom plan? <a href="#" className="font-medium text-primary hover:underline">Contact us</a> for enterprise pricing.
            </p>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by businesses worldwide
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Customer"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold">John Smith</h4>
                  <p className="text-gray-500">CEO, TechStart</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "MCP Chat Support has transformed our customer service. We've reduced response times by 80% while maintaining high customer satisfaction scores."
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Customer"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Sarah Johnson</h4>
                  <p className="text-gray-500">CTO, MarketLeap</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "The AI's ability to learn from our documentation is impressive. It handles over 70% of customer inquiries without human intervention."
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Customer"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Michael Chen</h4>
                  <p className="text-gray-500">Support Manager, CloudNine</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "We've been able to scale our support operations without increasing headcount. The analytics help us identify knowledge gaps and improve our documentation."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Frequently asked questions
            </p>
          </div>
          
          <div className="mt-12 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900">How does the AI chat bot work?</h3>
              <p className="mt-2 text-base text-gray-500">
                Our AI chatbot uses advanced natural language processing to understand customer queries. It learns from your knowledge base (documents, FAQs, website content) to provide accurate responses.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Can I customize the chat widget?</h3>
              <p className="mt-2 text-base text-gray-500">
                Yes, you can fully customize the widget's appearance, including colors, position, avatar, and welcome messages to match your brand's look and feel.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">How do I add the chat widget to my website?</h3>
              <p className="mt-2 text-base text-gray-500">
                After setting up your account, you'll receive a JavaScript snippet to add to your website. Just paste it before the closing body tag, and the widget will appear on your site.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">What happens when the AI can't answer a question?</h3>
              <p className="mt-2 text-base text-gray-500">
                If the AI can't confidently answer a query, it can escalate the conversation to a human agent or collect contact information for follow-up.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Can I use this for multiple websites?</h3>
              <p className="mt-2 text-base text-gray-500">
                Yes, depending on your plan, you can create multiple chat bots for different websites or products, each with its own knowledge base and customization.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your customer support?</span>
            <span className="block text-blue-100">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/signup">
                <Button className="bg-white text-primary hover:bg-blue-50 border-white">
                  Get started
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a href="#features">
                <Button variant="outline" className="text-white border-white hover:bg-primary-dark">
                  Learn more
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <div className="bg-primary text-white p-2 rounded-md">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">MCP Chat Support</span>
              </div>
              <p className="text-gray-400 text-base">
                Transforming customer support with AI-powered solutions for businesses of all sizes.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Product</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#features" className="text-base text-gray-400 hover:text-white">Features</a></li>
                    <li><a href="#pricing" className="text-base text-gray-400 hover:text-white">Pricing</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Documentation</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">API Reference</a></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Help Center</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Contact Us</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Status</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Community</a></li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">About</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Blog</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Careers</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Press</a></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Privacy</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Terms</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Cookie Policy</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">GDPR</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2025 MCP Chat Support. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;