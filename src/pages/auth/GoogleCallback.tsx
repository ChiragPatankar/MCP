import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { googleAuth, GoogleUser } from '@/lib/googleAuth';

const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authenticateWithGoogle } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const error = searchParams.get('error');
        const code = searchParams.get('code');

        if (error) {
          throw new Error(`Google authentication error: ${error}`);
        }

        // If this is opened in a popup, close it and let parent handle
        if (window.opener && window.opener !== window) {
          if (code) {
            // Send code to opener (they'll need to exchange it server-side)
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_CALLBACK',
              code,
            }, window.location.origin);
          }
          window.close();
          return;
        }

        // Direct redirect - show error and redirect to login
        // The app uses Google Identity Services (GSI) which doesn't use this callback
        setStatus('error');
        setErrorMessage('Please use the "Sign in with Google" button on the login page.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        console.error('Google callback error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing sign-in...
            </h2>
            <p className="text-gray-600">
              Please wait while we authenticate your Google account.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign-in successful!
            </h2>
            <p className="text-gray-600">
              Redirecting you to the dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign-in failed
            </h2>
            <p className="text-gray-600 mb-4">
              {errorMessage || 'An error occurred during authentication.'}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Return to login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;

