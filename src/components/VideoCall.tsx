import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MonitorOff,
  Settings,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  MessageSquare,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  Camera,
  Wifi,
  WifiOff
} from 'lucide-react';
import Peer from 'simple-peer';
import { io, Socket } from 'socket.io-client';

interface VideoCallProps {
  sessionId: string;
  mentorId: string;
  menteeId: string;
  isHost: boolean;
  onCallEnd: (summary: SessionSummary) => void;
}

interface SessionSummary {
  duration: number;
  topics: string[];
  keyPoints: string[];
  actionItems: string[];
  rating?: number;
  feedback?: string;
}

interface CallQuality {
  video: 'high' | 'medium' | 'low';
  audio: 'high' | 'medium' | 'low';
  bandwidth: number;
  latency: number;
  packetLoss: number;
}

const VideoCall: React.FC<VideoCallProps> = ({
  sessionId,
  mentorId,
  menteeId,
  isHost,
  onCallEnd
}) => {
  // Video/Audio refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Call state
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);

  // Quality monitoring
  const [callQuality, setCallQuality] = useState<CallQuality>({
    video: 'high',
    audio: 'high',
    bandwidth: 0,
    latency: 0,
    packetLoss: 0
  });
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'poor' | 'disconnected'>('connecting');

  // Post-call state
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Array<{id: string, sender: string, message: string, timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState('');

  // Initialize WebRTC and Socket connection
  useEffect(() => {
    initializeCall();
    return () => {
      cleanup();
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCallActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive, timeRemaining]);

  // Quality monitoring
  useEffect(() => {
    if (peerRef.current && isConnected) {
      const interval = setInterval(() => {
        monitorCallQuality();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const initializeCall = async () => {
    try {
      // Initialize socket connection
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3001');
      
      socketRef.current.on('connect', () => {
        console.log('Socket connected');
        socketRef.current?.emit('join-session', { sessionId, userId: isHost ? mentorId : menteeId });
      });

      socketRef.current.on('user-joined', () => {
        if (isHost) {
          initiateCall();
        }
      });

      socketRef.current.on('call-signal', (data) => {
        if (peerRef.current) {
          peerRef.current.signal(data.signal);
        }
      });

      socketRef.current.on('chat-message', (data) => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: data.sender,
          message: data.message,
          timestamp: new Date()
        }]);
      });

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, frameRate: 30 },
        audio: { echoCancellation: true, noiseSuppression: true }
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setCallStartTime(new Date());
      setIsCallActive(true);

    } catch (error) {
      console.error('Error initializing call:', error);
      setConnectionStatus('disconnected');
    }
  };

  const initiateCall = () => {
    if (!localStreamRef.current || !socketRef.current) return;

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: localStreamRef.current,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', (data) => {
      socketRef.current?.emit('call-signal', {
        sessionId,
        signal: data,
        to: isHost ? menteeId : mentorId
      });
    });

    peer.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
    });

    peer.on('stream', (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    peer.on('error', (error) => {
      console.error('Peer error:', error);
      setConnectionStatus('poor');
    });

    peerRef.current = peer;
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: true
        });

        const videoTrack = screenStream.getVideoTracks()[0];
        if (peerRef.current && localStreamRef.current) {
          const sender = peerRef.current._pc?.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        }

        videoTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
      } else {
        stopScreenShare();
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const stopScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, frameRate: 30 },
        audio: false
      });

      const videoTrack = stream.getVideoTracks()[0];
      if (peerRef.current) {
        const sender = peerRef.current._pc?.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      }

      setIsScreenSharing(false);
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  };

  const monitorCallQuality = () => {
    if (!peerRef.current?._pc) return;

    peerRef.current._pc.getStats().then(stats => {
      let bandwidth = 0;
      let latency = 0;
      let packetLoss = 0;

      stats.forEach(report => {
        if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
          bandwidth = report.bytesReceived || 0;
        }
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          latency = report.currentRoundTripTime * 1000 || 0;
        }
        if (report.type === 'inbound-rtp') {
          const packetsLost = report.packetsLost || 0;
          const packetsReceived = report.packetsReceived || 0;
          packetLoss = packetsLost / (packetsLost + packetsReceived) * 100;
        }
      });

      setCallQuality(prev => ({
        ...prev,
        bandwidth,
        latency,
        packetLoss,
        video: bandwidth > 500000 ? 'high' : bandwidth > 200000 ? 'medium' : 'low',
        audio: latency < 150 ? 'high' : latency < 300 ? 'medium' : 'low'
      }));

      // Update connection status based on quality
      if (latency > 500 || packetLoss > 5) {
        setConnectionStatus('poor');
      } else if (latency < 150 && packetLoss < 1) {
        setConnectionStatus('connected');
      }
    });
  };

  const sendChatMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const message = {
        sessionId,
        sender: isHost ? 'mentor' : 'mentee',
        message: newMessage.trim(),
        timestamp: new Date()
      };

      socketRef.current.emit('chat-message', message);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        ...message
      }]);
      setNewMessage('');
    }
  };

  const endCall = useCallback(() => {
    setIsCallActive(false);
    
    // Generate session summary
    const duration = callStartTime ? Math.floor((Date.now() - callStartTime.getTime()) / 1000) : 0;
    const summary: SessionSummary = {
      duration,
      topics: ['Product Strategy', 'Team Leadership'], // In real app, this would be AI-generated
      keyPoints: [
        'Focus on user research before feature development',
        'Implement weekly 1:1s with team members',
        'Use OKRs for quarterly goal setting'
      ],
      actionItems: [
        'Schedule user interviews next week',
        'Set up 1:1 calendar invites',
        'Draft Q2 OKRs by Friday'
      ]
    };
    
    setSessionSummary(summary);
    setShowRating(true);
    
    cleanup();
  }, [callStartTime]);

  const submitRating = () => {
    if (sessionSummary) {
      const finalSummary = {
        ...sessionSummary,
        rating,
        feedback
      };
      onCallEnd(finalSummary);
    }
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-5 w-5 text-green-500" />;
      case 'poor': return <WifiOff className="h-5 w-5 text-yellow-500" />;
      case 'disconnected': return <WifiOff className="h-5 w-5 text-red-500" />;
      default: return <Wifi className="h-5 w-5 text-gray-500" />;
    }
  };

  if (showRating && sessionSummary) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-8">
          <div className="text-center mb-8">
            <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h2>
            <p className="text-gray-600">Duration: {formatTime(sessionSummary.duration)}</p>
          </div>

          {/* Session Summary */}
          <div className="mb-8 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Topics Discussed</h3>
              <div className="flex flex-wrap gap-2">
                {sessionSummary.topics.map((topic, index) => (
                  <span key={index} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Insights</h3>
              <ul className="space-y-2">
                {sessionSummary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Action Items</h3>
              <ul className="space-y-2">
                {sessionSummary.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-500 rounded mt-1 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Rate this session</h3>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <button
            onClick={submitRating}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all font-medium"
          >
            Complete Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black ${isFullscreen ? 'z-50' : 'z-40'}`}>
      {/* Timer Warning */}
      {timeRemaining <= 60 && timeRemaining > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-50 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Session ending in {formatTime(timeRemaining)}</span>
        </div>
      )}

      {/* Main Video Area */}
      <div className="relative h-full flex">
        {/* Remote Video */}
        <div className="flex-1 relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg">Connecting to session...</p>
              </div>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
            {getConnectionIcon()}
            <span className="text-sm capitalize">{connectionStatus}</span>
          </div>

          {/* Timer */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className={`font-mono text-lg ${timeRemaining <= 60 ? 'text-red-400' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Session Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === (isHost ? 'mentor' : 'mentee') ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender === (isHost ? 'mentor' : 'mentee')
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={sendChatMessage}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all ${
              isAudioEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all ${
              isVideoEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-all ${
              isScreenSharing 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {isScreenSharing ? <MonitorOff className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-4 rounded-full transition-all ${
              showChat 
                ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <MessageSquare className="h-6 w-6" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all"
          >
            <Settings className="h-6 w-6" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all"
          >
            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute bottom-24 right-6 bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-80">
          <h3 className="font-semibold text-gray-900 mb-4">Call Settings</h3>
          
          {/* Quality Metrics */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Video Quality:</span>
              <span className={`font-medium ${getQualityColor(callQuality.video)}`}>
                {callQuality.video.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Audio Quality:</span>
              <span className={`font-medium ${getQualityColor(callQuality.audio)}`}>
                {callQuality.audio.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Latency:</span>
              <span className="font-medium">{Math.round(callQuality.latency)}ms</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Packet Loss:</span>
              <span className="font-medium">{callQuality.packetLoss.toFixed(1)}%</span>
            </div>
          </div>

          {/* Quality Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Quality
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="auto">Auto</option>
                <option value="high">High (720p)</option>
                <option value="medium">Medium (480p)</option>
                <option value="low">Low (240p)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio Quality
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;