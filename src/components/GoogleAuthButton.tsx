import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { googleAuth } from '@/lib/googleAuth';

interface GoogleAuthButtonProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
  mode: 'signin' | 'signup';
  disabled?: boolean;
  className?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onError,
  mode,
  disabled = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Initialize Google Auth
    const initGoogle = async () => {
      try {
        await googleAuth.initialize();
        setIsGoogleReady(true);
      } catch (error) {
        console.error('Google Auth initialization failed:', error);
        setIsGoogleReady(false);
      }
    };

    initGoogle();
  }, []);

  const handleGoogleAuth = async () => {
    if (!isGoogleReady || isLoading || disabled) return;

    setIsLoading(true);
    try {
      const user = await googleAuth.signIn();
      onSuccess(user);
    } catch (error: any) {
      console.error('Google authentication failed:', error);
      onError(error.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Show different states based on Google readiness
  if (!isGoogleReady) {
    return (
      <Button
        variant="outline"
        disabled={true}
        className={`w-full ${className}`}
      >
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading Google...</span>
        </div>
      </Button>
    );
  }

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      onClick={handleGoogleAuth}
      disabled={disabled || isLoading}
      className={`w-full ${className}`}
    >
      <div className="flex items-center justify-center space-x-2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span>
          {isLoading 
            ? `${mode === 'signin' ? 'Signing in' : 'Signing up'}...` 
            : `${mode === 'signin' ? 'Sign in' : 'Sign up'} with Google`
          }
        </span>
      </div>
    </Button>
  );
};

export default GoogleAuthButton; 