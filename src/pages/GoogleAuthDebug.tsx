import React, { useEffect, useState } from 'react';
import { googleAuth } from '@/lib/googleAuth';

const GoogleAuthDebug: React.FC = () => {
  const [status, setStatus] = useState<string>('Initializing...');
  const [clientId, setClientId] = useState<string>('');
  const [envVars, setEnvVars] = useState<Record<string, any>>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Debug environment variables
    setEnvVars(import.meta.env);
    setClientId(googleAuth.getClientId());
    
    // Test Google Auth initialization
    testGoogleAuth();
  }, []);

  const testGoogleAuth = async () => {
    try {
      setStatus('Testing Google Auth initialization...');
      await googleAuth.initialize();
      setStatus('✅ Google Auth initialized successfully!');
    } catch (error: any) {
      setStatus('❌ Google Auth initialization failed');
      setError(error.message);
      console.error('Google Auth Error:', error);
    }
  };

  const testSignIn = async () => {
    try {
      setStatus('Attempting Google Sign In...');
      setError('');
      const user = await googleAuth.signIn();
      setStatus(`✅ Sign in successful! Welcome ${user.name}`);
      console.log('Google User:', user);
    } catch (error: any) {
      setStatus('❌ Sign in failed');
      setError(error.message);
      console.error('Sign In Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🔐 Google Auth Debug</h1>
        
        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <p className="text-lg">{status}</p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-800">Error Details:</h3>
              <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
            </div>
          )}
        </div>

        {/* Environment Check */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">VITE_GOOGLE_CLIENT_ID:</span>
              <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                {clientId ? `${clientId.substring(0, 20)}...` : 'NOT SET'}
              </span>
            </div>
            <div>
              <span className="font-semibold">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-white ${
                clientId && clientId !== 'your_google_client_id_here.apps.googleusercontent.com' 
                  ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {clientId && clientId !== 'your_google_client_id_here.apps.googleusercontent.com' 
                  ? 'VALID' : 'INVALID'}
              </span>
            </div>
          </div>
        </div>

        {/* Available Environment Variables */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">All Environment Variables</h2>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-40">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        {/* Test Buttons */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={testGoogleAuth}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Test Google Auth Initialization
            </button>
            
            <button
              onClick={testSignIn}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              🔑 Test Google Sign In
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🛠️ Troubleshooting</h2>
          <ul className="space-y-2 text-sm">
            <li>1. Check that VITE_GOOGLE_CLIENT_ID shows "VALID" above</li>
            <li>2. Verify your OAuth consent screen is configured</li>
            <li>3. Ensure localhost:5173 is in authorized origins</li>
            <li>4. Check browser console for detailed errors</li>
            <li>5. Make sure you restarted the dev server after adding credentials</li>
          </ul>
        </div>

        {/* Back to App */}
        <div className="text-center mt-8">
          <a 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Login Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthDebug; 