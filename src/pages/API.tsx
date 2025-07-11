import React from 'react';
import { Code, Server, Cloud, Database, Star, ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const endpoints = [
  {
    icon: <Server className="h-8 w-8 text-blue-500" />,
    title: 'RESTful API',
    description: 'Easily integrate with our RESTful endpoints for chat, knowledge base, and analytics.'
  },
  {
    icon: <Cloud className="h-8 w-8 text-purple-500" />,
    title: 'WebSocket Support',
    description: 'Real-time messaging and event updates via WebSocket.'
  },
  {
    icon: <Database className="h-8 w-8 text-green-500" />,
    title: 'Data Access',
    description: 'Secure access to user, session, and analytics data.'
  }
];

const testimonial = {
  name: 'Alex Kim',
  role: 'Lead Developer',
  company: 'Appify',
  image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
  content: 'The API is well-documented and easy to use. We built our integration in a single afternoon!',
  rating: 5
};

const API: React.FC = () => (
  <div className="relative min-h-screen py-12 overflow-hidden">
    {/* Decorative Background Gradient */}
    <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-blue-200 via-purple-100 to-cyan-100 rounded-full blur-3xl opacity-60 z-0" />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100 via-cyan-100 to-purple-100 rounded-full blur-2xl opacity-50 z-0" />
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
      {/* Back to Home Button */}
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium bg-white/80 hover:bg-white px-3 py-2 rounded-lg shadow transition-all">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>
      </div>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-xl shadow-lg">
          <Code className="h-7 w-7" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">API</h1>
      </div>
      {/* Hero Section */}
      <div className="mb-12">
        <p className="text-xl text-gray-700 max-w-2xl">
          Integrate MCP Chat Support into your product with our robust, developer-friendly API.
        </p>
      </div>
      {/* API Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {endpoints.map((ep) => (
          <div key={ep.title} className="rounded-2xl shadow-lg p-8 bg-white flex flex-col items-start">
            <div className="mb-4">{ep.icon}</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">{ep.title}</h2>
            <p className="text-base text-gray-700 opacity-90">{ep.description}</p>
          </div>
        ))}
      </div>
      {/* Testimonial Section */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-primary-100 to-blue-100 rounded-2xl p-8 flex flex-col md:flex-row items-center shadow">
          <img src={testimonial.image} alt={testimonial.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary-200 mb-4 md:mb-0 md:mr-8" />
          <div>
            <div className="flex items-center mb-2">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400" />
              ))}
            </div>
            <p className="text-lg text-gray-800 mb-2">“{testimonial.content}”</p>
            <div className="text-gray-600 text-sm">
              <span className="font-semibold">{testimonial.name}</span> — {testimonial.role}, {testimonial.company}
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="mt-20 flex justify-center">
        <div className="bg-gradient-to-r from-primary-500 to-blue-500 rounded-2xl shadow-lg px-10 py-8 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
            <Rocket className="h-6 w-6 mr-2" /> Ready to build with our API?
          </h2>
          <p className="text-white/90 mb-6">Start your free trial today and experience the future of customer support.</p>
          <Link to="/signup" className="inline-flex items-center bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-50 transition-all">
            Get Started Free <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default API; 