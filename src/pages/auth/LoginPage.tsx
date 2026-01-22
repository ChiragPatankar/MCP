import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { googleAuth } from '@/lib/googleAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      
      // Redirect based on role
      const isAdmin = email === 'admin@clientsphere.com';
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google button on mount and listen for auth events
  useEffect(() => {
    if (googleButtonRef.current) {
      googleAuth.initialize().then(() => {
        googleAuth.renderButton(googleButtonRef.current!, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
        });
      }).catch(err => {
        console.error('Failed to initialize Google button:', err);
      });
    }

    // Listen for Google auth success event (when button is clicked directly)
    const handleAuthSuccess = async (event: CustomEvent) => {
      const googleUser = event.detail;
      console.log('📥 Received google-auth-success event:', googleUser);
      setError('');
      setIsLoading(true);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mcp-backend.officialchiragp1605.workers.dev';
        
        // Authenticate with backend
        const response = await fetch(`${API_BASE_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: googleUser.credential,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Network error' }));
          throw new Error(errorData.error || 'Google authentication failed');
        }

        const { token, user: userData } = await response.json();
        console.log('✅ Backend authentication successful:', userData);
        
        // Store auth token
        localStorage.setItem("auth-token", token);
        
        // Convert backend user format to frontend format
        const userWithCorrectFormat = {
          id: userData.id.toString(),
          name: userData.name,
          email: userData.email,
          role: "tenant" as const,
          createdAt: new Date(userData.created_at),
        };
        
        localStorage.setItem("mcp-user", JSON.stringify(userWithCorrectFormat));
        
        // Dispatch a custom event that AuthContext can listen to
        const authUpdateEvent = new CustomEvent('auth-state-updated', {
          detail: { user: userWithCorrectFormat }
        });
        window.dispatchEvent(authUpdateEvent);
        
        // Reload the page to ensure AuthContext picks up the new user
        // This is the most reliable way to update the auth state
        console.log('🚀 Reloading page to update auth state...');
        window.location.href = '/dashboard';
      } catch (error: any) {
        console.error('❌ Google authentication failed:', error);
        setError(error.message || 'Failed to sign in with Google. Please try again.');
        setIsLoading(false);
      }
    };

    const handleAuthError = (event: CustomEvent) => {
      setError(event.detail.error || 'Failed to sign in with Google. Please try again.');
    };

    window.addEventListener('google-auth-success', handleAuthSuccess as EventListener);
    window.addEventListener('google-auth-error', handleAuthError as EventListener);

    return () => {
      window.removeEventListener('google-auth-success', handleAuthSuccess as EventListener);
      window.removeEventListener('google-auth-error', handleAuthError as EventListener);
    };
  }, [loginWithGoogle, navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center">
          <img src="/logo.png" alt="ClientSphere" className="h-12 w-12 rounded-lg" />
          <span className="ml-2 text-xl font-bold">ClientSphere</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full flex justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : 'Sign in'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <div ref={googleButtonRef} className="flex justify-center"></div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;