import { useState, useEffect } from 'react';

interface OfflineData {
  profiles: any[];
  sessions: any[];
  lastUpdated: number;
}

const STORAGE_KEY = 'micro-mentor-offline';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data on mount
    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid
        if (now - data.lastUpdated < CACHE_DURATION) {
          setOfflineData(data);
        } else {
          // Clear expired cache
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  const saveOfflineData = (data: Partial<OfflineData>) => {
    try {
      const currentData = offlineData || { profiles: [], sessions: [], lastUpdated: 0 };
      const newData = {
        ...currentData,
        ...data,
        lastUpdated: Date.now()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setOfflineData(newData);
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const cacheProfiles = (profiles: any[]) => {
    saveOfflineData({ profiles });
  };

  const cacheSessions = (sessions: any[]) => {
    saveOfflineData({ sessions });
  };

  const getCachedProfiles = () => {
    return offlineData?.profiles || [];
  };

  const getCachedSessions = () => {
    return offlineData?.sessions || [];
  };

  const clearCache = () => {
    localStorage.removeItem(STORAGE_KEY);
    setOfflineData(null);
  };

  return {
    isOnline,
    offlineData,
    cacheProfiles,
    cacheSessions,
    getCachedProfiles,
    getCachedSessions,
    clearCache
  };
};