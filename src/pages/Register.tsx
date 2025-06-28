import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Users, Video, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') as 'mentor' | 'mentee' || 'mentee';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: initialType
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.name, formData.type);
      navigate('/profile-setup');
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600">
            Join thousands of professionals accelerating their growth
          </p>
        </div>

        {/* Account Type Selection */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'mentee' }))}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                formData.type === 'mentee'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="font-semibold">I need advice</div>
              <div className="text-sm text-gray-600">Find mentors</div>
            </button>
            
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'mentor' }))}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                formData.type === 'mentor'
                  ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Video className="h-8 w-8 mx-auto mb-2" />
              <div className="font-semibold">I give advice</div>
              <div className="text-sm text-gray-600">Become a mentor</div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-error-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-error-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? 'border-error-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-error-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 pr-10 ${
                    errors.password ? 'border-error-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-error-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  errors.confirmPassword ? 'border-error-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-error-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;