import React, { useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../contexts/AuthContext';

const NotificationManager: React.FC = () => {
  const { user } = useAuth();
  const { permission, isSupported, requestPermission, sendNotification, scheduleNotification } = useNotifications();

  useEffect(() => {
    // Request permission when user logs in
    if (user && !permission.granted && !permission.denied && isSupported) {
      requestPermission();
    }
  }, [user, permission, isSupported, requestPermission]);

  // Example notification functions that can be called from other components
  const notifySessionReminder = (mentorName: string, timeUntilSession: number) => {
    if (permission.granted) {
      scheduleNotification({
        title: 'Session Starting Soon',
        body: `Your session with ${mentorName} starts in ${timeUntilSession} minutes`,
        icon: '/pwa-192x192.png',
        tag: 'session-reminder',
        data: { type: 'session-reminder' }
      }, (timeUntilSession - 5) * 60 * 1000); // 5 minutes before
    }
  };

  const notifySessionBooked = (mentorName: string, sessionTime: string) => {
    if (permission.granted) {
      sendNotification({
        title: 'Session Booked Successfully',
        body: `Your session with ${mentorName} is confirmed for ${sessionTime}`,
        icon: '/pwa-192x192.png',
        tag: 'session-booked',
        data: { type: 'session-booked' }
      });
    }
  };

  const notifyNewMessage = (senderName: string, message: string) => {
    if (permission.granted) {
      sendNotification({
        title: `New message from ${senderName}`,
        body: message,
        icon: '/pwa-192x192.png',
        tag: 'new-message',
        data: { type: 'new-message' }
      });
    }
  };

  // Expose notification functions globally for use in other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).notificationManager = {
        notifySessionReminder,
        notifySessionBooked,
        notifyNewMessage
      };
    }
  }, [permission.granted]);

  return null; // This component doesn't render anything
};

export default NotificationManager;