import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Video, User, LogOut, Settings, Brain, Home, Search, Calendar, MessageSquare, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTouchGestures } from '../hooks/useTouchGestures';

const MobileNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const swipeGestures = useTouchGestures({
    onSwipeLeft: () => setIsMenuOpen(false),
    onSwipeRight: () => setIsMenuOpen(true)
  });

  const navigationItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/about', icon: Info, label: 'About' },
    { path: '/smart-match', icon: Brain, label: 'Smart Match' },
    { path: '/discover', icon: Search, label: 'Find Mentors' },
    { path: '/dashboard', icon: Calendar, label: 'Dashboard' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-lg border-b border-primary-100 sticky top-0 z-50 safe-area-top">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <Video className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Micro-Mentor
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 touch-manipulation"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMenu}
            {...swipeGestures}
          />
        )}

        {/* Mobile Menu Drawer - Complete White Background */}
        <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header - White Background */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content Area - White Background */}
          <div className="flex flex-col h-full bg-white">
            {/* Navigation Items */}
            <div className="flex-1 py-6 bg-white">
              <div className="space-y-2 px-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 touch-manipulation ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* User Section - White Background */}
              {user && (
                <div className="mt-8 px-6 bg-white">
                  <div className="border-t border-gray-200 pt-6 bg-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.type}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        to="/profile-setup"
                        onClick={closeMenu}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 touch-manipulation"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Profile Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full text-left touch-manipulation"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Auth Buttons for Non-logged in Users - White Background */}
              {!user && (
                <div className="mt-8 px-6 bg-white">
                  <div className="border-t border-gray-200 pt-6 space-y-3 bg-white">
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="block w-full text-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium touch-manipulation"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="block w-full text-center px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium touch-manipulation"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Area - White Background */}
            <div className="bg-white h-16"></div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom md:hidden">
        <div className="grid grid-cols-4 h-16">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 touch-manipulation ${
                isActive(item.path)
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;