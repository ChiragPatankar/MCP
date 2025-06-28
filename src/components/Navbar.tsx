import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Video, User, LogOut, Settings, Brain, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-primary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Micro-Mentor
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link 
              to="/smart-match" 
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <Brain className="h-4 w-4" />
              <span>Smart Match</span>
            </Link>
            <Link 
              to="/discover" 
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              Find Mentors
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      to="/profile-setup" 
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-b-lg w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white rounded-b-lg shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/about" 
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link 
                to="/smart-match" 
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <Brain className="h-4 w-4" />
                <span>Smart Match</span>
              </Link>
              <Link 
                to="/discover" 
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                Find Mentors
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile-setup" 
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;