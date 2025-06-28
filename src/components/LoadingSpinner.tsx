import React from 'react';
import { Video, Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'branded' | 'minimal';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'branded') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-full animate-pulse">
            <Video className={`${sizeClasses[size]} text-white`} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-ping opacity-20"></div>
        </div>
        {text && (
          <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-500`} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-primary-500 ${sizeClasses[size]}`}></div>
      </div>
      {text && (
        <p className={`text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;