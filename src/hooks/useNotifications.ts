import { useState, useEffect } from 'react';

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      
      // Check current permission
      const currentPermission = Notification.permission;
      setPermission({
        granted: currentPermission === 'granted',
        denied: currentPermission === 'denied',
        default: currentPermission === 'default'
      });
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      const newPermission = {
        granted: result === 'granted',
        denied: result === 'denied',
        default: result === 'default'
      };
      
      setPermission(newPermission);
      return newPermission.granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendNotification = (notification: PushNotification) => {
    if (!permission.granted || !isSupported) return;

    try {
      const notif = new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/pwa-192x192.png',
        badge: notification.badge || '/pwa-192x192.png',
        tag: notification.tag,
        data: notification.data,
        actions: notification.actions,
        requireInteraction: true
      });

      // Auto close after 5 seconds if not interacted with
      setTimeout(() => {
        notif.close();
      }, 5000);

      return notif;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const scheduleNotification = (notification: PushNotification, delay: number) => {
    setTimeout(() => {
      sendNotification(notification);
    }, delay);
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    scheduleNotification
  };
};