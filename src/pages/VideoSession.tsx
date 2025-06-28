import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Video, AlertCircle, CheckCircle, Star } from 'lucide-react';
import VideoCall from '../components/VideoCall';
import { useAuth } from '../contexts/AuthContext';

interface SessionSummary {
  duration: number;
  topics: string[];
  keyPoints: string[];
  actionItems: string[];
  rating?: number;
  feedback?: string;
}

const VideoSession: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreJoin, setShowPreJoin] = useState(true);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false
  });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [finalSummary, setFinalSummary] = useState<SessionSummary | null>(null);

  useEffect(() => {
    loadSessionData();
    checkDevicePermissions();
  }, [sessionId]);

  const loadSessionData = async () => {
    try {
      // In a real app, fetch session data from API
      const mockSessionData = {
        id: sessionId,
        mentorId: 'mentor-123',
        menteeId: 'mentee-456',
        mentor: {
          name: 'Sarah Chen',
          title: 'Senior Product Manager at Google',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
          rating: 4.9
        },
        mentee: {
          name: 'John Doe',
          title: 'Product Manager',
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        topic: 'Product Strategy Review',
        scheduledTime: new Date(),
        duration: 300, // 5 minutes
        status: 'active'
      };
      
      setSessionData(mockSessionData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading session data:', error);
      setIsLoading(false);
    }
  };

  const checkDevicePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setDevicePermissions({
        camera: true,
        microphone: true
      });
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Device permission error:', error);
      
      // Check individual permissions
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setDevicePermissions(prev => ({ ...prev, camera: true }));
        videoStream.getTracks().forEach(track => track.stop());
      } catch (e) {
        setDevicePermissions(prev => ({ ...prev, camera: false }));
      }
      
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setDevicePermissions(prev => ({ ...prev, microphone: true }));
        audioStream.getTracks().forEach(track => track.stop());
      } catch (e) {
        setDevicePermissions(prev => ({ ...prev, microphone: false }));
      }
    }
  };

  const handleJoinSession = () => {
    if (devicePermissions.camera && devicePermissions.microphone) {
      setShowPreJoin(false);
    }
  };

  const handleCallEnd = (summary: SessionSummary) => {
    setFinalSummary(summary);
    setSessionComplete(true);
    
    // In a real app, save session data to backend
    console.log('Session completed:', summary);
    
    // Redirect to dashboard after a delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
          <p className="text-gray-400 mb-6">The session you're looking for doesn't exist or has expired.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (sessionComplete && finalSummary) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h2>
            <p className="text-gray-600">
              Your session with {sessionData.mentor.name} has ended successfully.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Session Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium ml-2">
                  {Math.floor(finalSummary.duration / 60)}:{(finalSummary.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Rating:</span>
                <div className="inline-flex items-center ml-2">
                  {finalSummary.rating && [...Array(finalSummary.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              A detailed summary has been sent to your email and saved to your dashboard.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all font-medium"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPreJoin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="bg-primary-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Video className="h-10 w-10 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Join?</h2>
            <p className="text-gray-600">
              You're about to join a session with {sessionData.mentor.name}
            </p>
          </div>

          {/* Session Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src={sessionData.mentor.avatar} 
                alt={sessionData.mentor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{sessionData.mentor.name}</h3>
                <p className="text-gray-600 text-sm">{sessionData.mentor.title}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{sessionData.mentor.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Topic:</span>
                <span className="font-medium">{sessionData.topic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">5 minutes</span>
              </div>
            </div>
          </div>

          {/* Device Check */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900">Device Check</h3>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Video className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Camera</span>
              </div>
              {devicePermissions.camera ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Microphone</span>
              </div>
              {devicePermissions.microphone ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>

          {/* Permission Issues */}
          {(!devicePermissions.camera || !devicePermissions.microphone) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Permission Required</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Please allow camera and microphone access to join the video session.
                  </p>
                  <button
                    onClick={checkDevicePermissions}
                    className="text-yellow-800 underline text-sm mt-2 hover:text-yellow-900"
                  >
                    Check permissions again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Join Button */}
          <button
            onClick={handleJoinSession}
            disabled={!devicePermissions.camera || !devicePermissions.microphone}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Video className="h-5 w-5" />
            <span>Join Session</span>
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel and return to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <VideoCall
      sessionId={sessionData.id}
      mentorId={sessionData.mentorId}
      menteeId={sessionData.menteeId}
      isHost={user?.type === 'mentor'}
      onCallEnd={handleCallEnd}
    />
  );
};

export default VideoSession;