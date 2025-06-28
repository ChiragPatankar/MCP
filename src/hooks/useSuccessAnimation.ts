import { useState } from 'react';

interface SuccessAnimationOptions {
  type?: 'booking' | 'payment' | 'completion' | 'achievement';
  title: string;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

export const useSuccessAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationProps, setAnimationProps] = useState<SuccessAnimationOptions | null>(null);

  const showSuccess = (options: SuccessAnimationOptions) => {
    setAnimationProps(options);
    setIsVisible(true);
  };

  const hideSuccess = () => {
    setIsVisible(false);
    setAnimationProps(null);
  };

  return {
    isVisible,
    animationProps,
    showSuccess,
    hideSuccess
  };
};