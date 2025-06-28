import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Sparkles, Trophy, Heart } from 'lucide-react';

interface SuccessAnimationProps {
  type?: 'booking' | 'payment' | 'completion' | 'achievement';
  title: string;
  message: string;
  onComplete?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  type = 'booking',
  title,
  message,
  onComplete,
  autoClose = true,
  duration = 3000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'celebrate' | 'exit'>('enter');

  useEffect(() => {
    // Enter animation
    setTimeout(() => setAnimationPhase('celebrate'), 200);
    
    if (autoClose) {
      // Exit animation
      setTimeout(() => setAnimationPhase('exit'), duration - 500);
      
      // Complete callback
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);
    }
  }, [autoClose, duration, onComplete]);

  const getIcon = () => {
    switch (type) {
      case 'booking':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'payment':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'completion':
        return <Trophy className="h-16 w-16 text-yellow-500" />;
      case 'achievement':
        return <Star className="h-16 w-16 text-purple-500" />;
      default:
        return <CheckCircle className="h-16 w-16 text-green-500" />;
    }
  };

  const getConfettiColor = () => {
    switch (type) {
      case 'booking':
        return 'text-green-400';
      case 'payment':
        return 'text-blue-400';
      case 'completion':
        return 'text-yellow-400';
      case 'achievement':
        return 'text-purple-400';
      default:
        return 'text-green-400';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative bg-white rounded-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 ${
        animationPhase === 'enter' ? 'scale-0 opacity-0' :
        animationPhase === 'celebrate' ? 'scale-100 opacity-100' :
        'scale-95 opacity-0'
      }`}>
        {/* Confetti Animation */}
        {animationPhase === 'celebrate' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute animate-bounce ${getConfettiColor()}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              >
                {i % 3 === 0 ? <Sparkles className="h-4 w-4" /> :
                 i % 3 === 1 ? <Star className="h-3 w-3" /> :
                 <Heart className="h-3 w-3" />}
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10">
          {/* Icon with pulse animation */}
          <div className={`mb-6 flex justify-center ${
            animationPhase === 'celebrate' ? 'animate-pulse' : ''
          }`}>
            <div className="relative">
              {getIcon()}
              {animationPhase === 'celebrate' && (
                <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping"></div>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {/* Progress Bar */}
          {autoClose && (
            <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
              <div 
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1 rounded-full transition-all duration-100 ease-linear"
                style={{
                  width: animationPhase === 'celebrate' ? '100%' : '0%',
                  transitionDuration: `${duration - 700}ms`
                }}
              ></div>
            </div>
          )}

          {/* Close Button (if not auto-close) */}
          {!autoClose && (
            <button
              onClick={() => {
                setAnimationPhase('exit');
                setTimeout(() => {
                  setIsVisible(false);
                  onComplete?.();
                }, 300);
              }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;