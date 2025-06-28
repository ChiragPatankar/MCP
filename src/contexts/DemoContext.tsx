import React, { createContext, useContext, useState, useEffect } from 'react';

interface DemoUser {
  id: string;
  name: string;
  email: string;
  type: 'mentor' | 'mentee';
  avatar: string;
  profileComplete: boolean;
}

interface DemoSession {
  id: string;
  mentorId: string;
  menteeId: string;
  topic: string;
  status: 'scheduled' | 'active' | 'completed';
  scheduledTime: Date;
  duration: number;
  rating?: number;
  revenue: number;
}

interface DemoMetrics {
  totalRevenue: number;
  totalSessions: number;
  activeUsers: number;
  growthRate: number;
  monthlyRevenue: number[];
  sessionsByCategory: { [key: string]: number };
  userGrowth: number[];
  averageRating: number;
}

interface DemoContextType {
  isDemoMode: boolean;
  demoUser: DemoUser | null;
  demoSessions: DemoSession[];
  demoMetrics: DemoMetrics;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  simulateUserAction: (action: string, data?: any) => void;
  generateDemoData: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [demoMetrics, setDemoMetrics] = useState<DemoMetrics>({
    totalRevenue: 0,
    totalSessions: 0,
    activeUsers: 0,
    growthRate: 0,
    monthlyRevenue: [],
    sessionsByCategory: {},
    userGrowth: [],
    averageRating: 0
  });

  const generateDemoData = () => {
    // Generate demo sessions
    const sessions: DemoSession[] = [];
    const categories = ['Product Management', 'Software Development', 'Marketing', 'Design', 'Leadership'];
    const sessionsByCategory: { [key: string]: number } = {};
    
    for (let i = 0; i < 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const session: DemoSession = {
        id: `demo-session-${i}`,
        mentorId: `mentor-${Math.floor(Math.random() * 10)}`,
        menteeId: `mentee-${Math.floor(Math.random() * 20)}`,
        topic: category,
        status: Math.random() > 0.8 ? 'scheduled' : 'completed',
        scheduledTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        duration: 300, // 5 minutes
        rating: Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 4 : undefined,
        revenue: Math.floor(Math.random() * 3) + 3 // $3-5
      };
      sessions.push(session);
      sessionsByCategory[category] = (sessionsByCategory[category] || 0) + 1;
    }

    // Generate monthly revenue data
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const baseRevenue = 15000 + (11 - i) * 2000;
      const variance = Math.random() * 3000 - 1500;
      monthlyRevenue.push(Math.max(0, baseRevenue + variance));
    }

    // Generate user growth data
    const userGrowth = [];
    for (let i = 11; i >= 0; i--) {
      const baseUsers = 500 + (11 - i) * 150;
      const variance = Math.random() * 100 - 50;
      userGrowth.push(Math.max(0, baseUsers + variance));
    }

    const totalRevenue = sessions.reduce((sum, session) => sum + session.revenue, 0);
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const averageRating = completedSessions.reduce((sum, session) => sum + (session.rating || 0), 0) / completedSessions.length;

    setDemoSessions(sessions);
    setDemoMetrics({
      totalRevenue,
      totalSessions: sessions.length,
      activeUsers: 1250,
      growthRate: 23.5,
      monthlyRevenue,
      sessionsByCategory,
      userGrowth,
      averageRating
    });
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setDemoUser({
      id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@micro-mentor.app',
      type: 'mentee',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
      profileComplete: true
    });
    generateDemoData();
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    setDemoUser(null);
    setDemoSessions([]);
  };

  const simulateUserAction = (action: string, data?: any) => {
    switch (action) {
      case 'book_session':
        // Simulate booking a session
        const newSession: DemoSession = {
          id: `demo-session-${Date.now()}`,
          mentorId: data?.mentorId || 'mentor-1',
          menteeId: demoUser?.id || 'demo-user-1',
          topic: data?.topic || 'Product Strategy',
          status: 'scheduled',
          scheduledTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
          duration: 300,
          revenue: data?.rate || 5
        };
        setDemoSessions(prev => [...prev, newSession]);
        break;

      case 'complete_session':
        setDemoSessions(prev => 
          prev.map(session => 
            session.id === data?.sessionId 
              ? { ...session, status: 'completed', rating: data?.rating || 5 }
              : session
          )
        );
        break;

      case 'switch_user_type':
        setDemoUser(prev => prev ? { ...prev, type: data?.type || 'mentor' } : null);
        break;

      default:
        console.log('Unknown demo action:', action);
    }
  };

  useEffect(() => {
    // Check if demo mode should be enabled from URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
      enableDemoMode();
    }
  }, []);

  const value = {
    isDemoMode,
    demoUser,
    demoSessions,
    demoMetrics,
    enableDemoMode,
    disableDemoMode,
    simulateUserAction,
    generateDemoData
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};