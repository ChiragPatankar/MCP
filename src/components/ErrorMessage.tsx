import React from 'react';
import { AlertTriangle, X, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ErrorMessageProps {
  error: {
    message: string;
    type: 'network' | 'validation' | 'server' | 'unknown';
    code?: string;
  };
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
  className = ''
}) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return <WifiOff className="h-5 w-5" />;
      case 'server':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'network':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'validation':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'server':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getErrorColor()} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getErrorIcon()}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium mb-1">
            {error.type === 'network' ? 'Connection Error' :
             error.type === 'validation' ? 'Invalid Input' :
             error.type === 'server' ? 'Server Error' :
             'Error'}
          </h3>
          <p className="text-sm opacity-90">
            {error.message}
          </p>
          {error.code && (
            <p className="text-xs opacity-75 mt-1">
              Error Code: {error.code}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
              title="Retry"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;