import React, { useState, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  MessageSquare,
  Clock,
  User,
  Sparkles
} from 'lucide-react';

interface DemoVideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  mentorData: {
    name: string;
    avatar: string;
    title: string;
  };
}

const DemoVideoCall: React.FC<DemoVideoCallProps> = ({
  isOpen,
  onClose,
  mentorData
}) => {
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callPhase, setCallPhase] = useState<'connecting' | 'connected' | 'ending'>('connecting');
  const [demoMessages, setDemoMessages] = useState<Array<{
    id: string;
    sender: 'mentor' | 'mentee';
    message: string;
    timestamp: Date;
  }>>([]);

  const demoConversation = [
    { delay: 3000, sender: 'mentor' as const, message: "Hi! Great to meet you. What's your main challenge today?" },
    { delay: 8000, sender: 'mentee' as const, message: "I'm struggling with prioritizing features for our product roadmap." },
    { delay: 12000, sender: 'mentor' as const, message: "Perfect! Let me share a framework I use. First, consider user impact vs effort..." },
    { delay: 18000, sender: 'mentee' as const, message: "That makes sense! How do you handle stakeholder pressure?" },
    { delay: 22000, sender: 'mentor' as const, message: "Great question! I use a scoring matrix. Let me explain..." }
  ];

  useEffect(() => {
    if (!isOpen) return;

    // Simulate connection process
    setTimeout(() => setCallPhase('connected'), 2000);

    // Start countdown
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setCallPhase('ending');
          setTimeout(onClose, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Add demo messages
    demoConversation.forEach(({ delay, sender, message }) => {
      setTimeout(() => {
        setDemoMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender,
          message,
          timestamp: new Date()
        }]);
      }, delay);
    });

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Demo Badge */}
      <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2 z-10">
        <Sparkles className="h-4 w-4" />
        <span>Demo Call</span>
      </div>

      {/* Timer */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg z-10">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span className={`font-mono text-lg ${timeRemaining <= 60 ? 'text-red-400' : ''}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Connection Status */}
      {callPhase === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Connecting to {mentorData.name}...</p>
          </div>
        </div>
      )}

      {/* Main Video Area */}
      <div className="relative h-full flex">
        {/* Remote Video (Mentor) */}
        <div className="flex-1 relative bg-gradient-to-br from-blue-900 to-purple-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <img 
                src={mentorData.avatar} 
                alt={mentorData.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
              />
              <h3 className="text-2xl font-bold mb-2">{mentorData.name}</h3>
              <p className="text-blue-200">{mentorData.title}</p>
            </div>
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
            <div className="w-full h-full flex items-center justify-center">
              {isVideoEnabled ? (
                <div className="text-center text-white">
                  <User className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">You</p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <VideoOff className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs">Video Off</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Session Chat</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {demoMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'mentee' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.sender === 'mentee'
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
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled
              />
              <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Audio Toggle */}
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
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
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`p-4 rounded-full transition-all ${
              isVideoEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </button>

          {/* Chat Toggle */}
          <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all">
            <MessageSquare className="h-6 w-6" />
          </button>

          {/* End Call */}
          <button
            onClick={onClose}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Ending Message */}
      {callPhase === 'ending' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
            <p className="text-lg">Thank you for using Micro-Mentor</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoVideoCall;