import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOfflineStorage } from '../hooks/useOfflineStorage';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = useOfflineStorage();

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">You're offline. Some features may be limited.</span>
    </div>
  );
};

export default OfflineIndicator;