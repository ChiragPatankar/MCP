import React from 'react';
import { useTouchGestures } from '../hooks/useTouchGestures';

interface MobileOptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  children,
  className = '',
  onTap,
  onSwipeLeft,
  onSwipeRight,
  hoverable = true,
  padding = 'md'
}) => {
  const touchGestures = useTouchGestures({
    onTap,
    onSwipeLeft,
    onSwipeRight
  });

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = 'bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200';
  const hoverClasses = hoverable ? 'hover:shadow-md active:shadow-lg active:scale-[0.98]' : '';
  const interactiveClasses = (onTap || onSwipeLeft || onSwipeRight) ? 'cursor-pointer touch-manipulation' : '';

  const classes = [
    baseClasses,
    hoverClasses,
    interactiveClasses,
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      {...touchGestures}
    >
      {children}
    </div>
  );
};

export default MobileOptimizedCard;