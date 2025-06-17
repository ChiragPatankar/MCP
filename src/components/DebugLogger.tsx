import React, { useState, useEffect } from 'react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
  data?: any;
}

const DebugLogger: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Override console methods to capture logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    const addLog = (level: 'log' | 'error' | 'warn' | 'info', message: string, data?: any) => {
      const logEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level,
        message,
        data
      };
      
      setLogs(prev => [...prev.slice(-49), logEntry]); // Keep last 50 logs
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog('log', args.join(' '), args.length > 1 ? args.slice(1) : undefined);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('error', args.join(' '), args.length > 1 ? args.slice(1) : undefined);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args.join(' '), args.length > 1 ? args.slice(1) : undefined);
    };

    console.info = (...args) => {
      originalInfo(...args);
      addLog('info', args.join(' '), args.length > 1 ? args.slice(1) : undefined);
    };

    // Keyboard shortcut to toggle debug logger
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded cursor-pointer text-sm z-50"
        onClick={() => setIsVisible(true)}
      >
        📊 Debug Logger (Ctrl+Shift+L)
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-64 bg-gray-900 text-white rounded-lg shadow-lg z-50 flex flex-col">
      <div className="flex justify-between items-center p-2 border-b border-gray-700">
        <span className="text-sm font-medium">Debug Logger</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setLogs([])}
            className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
          >
            Clear
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 text-xs">
        {logs.length === 0 ? (
          <div className="text-gray-400">No logs yet...</div>
        ) : (
          logs.map(log => (
            <div 
              key={log.id} 
              className={`mb-1 ${
                log.level === 'error' ? 'text-red-400' : 
                log.level === 'warn' ? 'text-yellow-400' : 
                log.level === 'info' ? 'text-blue-400' : 
                'text-gray-300'
              }`}
            >
              <span className="text-gray-500">
                {log.timestamp.toLocaleTimeString()}
              </span>
              {' '}
              <span className="font-medium">[{log.level.toUpperCase()}]</span>
              {' '}
              {log.message}
              {log.data && (
                <div className="text-gray-400 ml-4">
                  {JSON.stringify(log.data, null, 2)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebugLogger; 