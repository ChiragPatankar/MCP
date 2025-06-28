import React from 'react';
import { Play, Square, RotateCcw, Users, TrendingUp } from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';

const DemoModeToggle: React.FC = () => {
  const { isDemoMode, enableDemoMode, disableDemoMode, generateDemoData, simulateUserAction } = useDemo();

  if (!isDemoMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={enableDemoMode}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>Demo Mode</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Play className="h-4 w-4 mr-2 text-purple-500" />
          Demo Mode
        </h3>
        <button
          onClick={disableDemoMode}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Square className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => simulateUserAction('book_session', { 
            mentorId: 'sarah-chen', 
            topic: 'Product Strategy',
            rate: 5 
          })}
          className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
        >
          📅 Book Demo Session
        </button>
        
        <button
          onClick={() => simulateUserAction('switch_user_type', { type: 'mentor' })}
          className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors flex items-center"
        >
          <Users className="h-4 w-4 mr-2" />
          Switch to Mentor
        </button>
        
        <button
          onClick={generateDemoData}
          className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors flex items-center"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh Data
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Demo mode shows realistic interactions and data
        </p>
      </div>
    </div>
  );
};

export default DemoModeToggle;