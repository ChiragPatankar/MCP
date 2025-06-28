import { useRef, useCallback } from 'react';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  longPressDelay?: number;
}

export const useTouchGestures = (options: TouchGestureOptions) => {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onLongPress,
    threshold = 50,
    longPressDelay = 500
  } = options;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
    }
  }, [onLongPress, longPressDelay]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Check for tap (short duration, small movement)
    if (distance < 10 && deltaTime < 300 && onTap) {
      onTap();
      return;
    }

    // Check for swipe gestures
    if (distance > threshold) {
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      
      if (angle >= -45 && angle <= 45 && onSwipeRight) {
        onSwipeRight();
      } else if (angle >= 135 || angle <= -135 && onSwipeLeft) {
        onSwipeLeft();
      } else if (angle >= 45 && angle <= 135 && onSwipeDown) {
        onSwipeDown();
      } else if (angle >= -135 && angle <= -45 && onSwipeUp) {
        onSwipeUp();
      }
    }

    touchStart.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, threshold]);

  const handleTouchMove = useCallback(() => {
    // Cancel long press if user moves finger
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove
  };
};