import React from 'react';
import { 
  BarChart, 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Archive,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const DashboardCard = ({ title, value, icon, change, changeType }: { 
  title: string, 
  value: string, 
  icon: React.ReactNode,
  change?: string,
  changeType?: 'positive' | 'negative' | 'neutral'
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="bg-primary/10 p-2 rounded-md text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {changeType === 'positive' && <ArrowUp className="h-3 w-3 text-green-500 mr-1" />}
            {changeType === 'negative' && <ArrowDown className="h-3 w-3 text-red-500 mr-1" />}
            <span className={`${
              changeType === 'positive' ? 'text-green-500' : 
              changeType === 'negative' ? 'text-red-500' : ''
            }`}>
              {change}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const recentConversations = [
    { id: '1', user: 'John Smith', query: 'How do I reset my password?', time: '10 min ago', sentiment: 'positive', resolved: true },
    { id: '2', user: 'Sarah Johnson', query: 'When will my order arrive?', time: '25 min ago', sentiment: 'neutral', resolved: true },
    { id: '3', user: 'Mike Brown', query: 'I want to cancel my subscription', time: '1 hour ago', sentiment: 'negative', resolved: false },
    { id: '4', user: 'Emma Wilson', query: 'Do you offer free shipping?', time: '2 hours ago', sentiment: 'positive', resolved: true },
    { id: '5', user: 'David Lee', query: 'The website is not working for me', time: '3 hours ago', sentiment: 'negative', resolved: false },
  ];

  return (
    <TenantLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">
              Last updated: <span className="font-medium">{new Date().toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Total Conversations" 
            value="2,851" 
            icon={<MessageSquare className="h-4 w-4" />} 
            change="12% from last month" 
            changeType="positive" 
          />
          <DashboardCard 
            title="Avg. Response Time" 
            value="1.2 min" 
            icon={<TrendingUp className="h-4 w-4" />}
            change="5% improvement" 
            changeType="positive"
          />
          <DashboardCard 
            title="Resolution Rate" 
            value="92%" 
            icon={<BarChart className="h-4 w-4" />}
            change="3% from last month" 
            changeType="positive"
          />
          <DashboardCard 
            title="Knowledge Base" 
            value="24 docs" 
            icon={<FileText className="h-4 w-4" />}
            change="Last added 2 days ago" 
            changeType="neutral"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-start space-x-4 bg-gray-50 p-3 rounded-md">
                    <div className={`rounded-full h-2 w-2 mt-2 ${
                      conversation.sentiment === 'positive' ? 'bg-green-500' :
                      conversation.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{conversation.user}</p>
                      <p className="text-sm text-gray-700">{conversation.query}</p>
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-500">{conversation.time}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          conversation.resolved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {conversation.resolved ? 'Resolved' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="/chat-history" className="text-sm text-primary hover:underline">
                  View all conversations
                </a>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Active Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500 h-2 w-2 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">TechCorp Website</p>
                      <p className="text-xs text-gray-500">techcorp.com</p>
                    </div>
                  </div>
                  <div className="text-sm">581 chats</div>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500 h-2 w-2 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Marketing Portal</p>
                      <p className="text-xs text-gray-500">marketing.techcorp.com</p>
                    </div>
                  </div>
                  <div className="text-sm">349 chats</div>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-500 h-2 w-2 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Support Center</p>
                      <p className="text-xs text-gray-500">support.techcorp.com</p>
                    </div>
                  </div>
                  <div className="text-sm">892 chats</div>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-500 h-2 w-2 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">E-commerce Store</p>
                      <p className="text-xs text-gray-500">store.techcorp.com</p>
                    </div>
                  </div>
                  <div className="text-sm">1,029 chats</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <a href="/clients" className="text-sm text-primary hover:underline">
                  Manage all clients
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/knowledge-base" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Archive className="h-10 w-10 text-primary mb-2" />
                <p className="text-sm font-medium">Upload Documentation</p>
                <p className="text-xs text-gray-500 text-center mt-1">Add new documents to your knowledge base</p>
              </a>
              
              <a href="/widget" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <MessageSquare className="h-10 w-10 text-primary mb-2" />
                <p className="text-sm font-medium">Customize Widget</p>
                <p className="text-xs text-gray-500 text-center mt-1">Change the appearance of your chat widget</p>
              </a>
              
              <a href="/analytics" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <BarChart className="h-10 w-10 text-primary mb-2" />
                <p className="text-sm font-medium">View Analytics</p>
                <p className="text-xs text-gray-500 text-center mt-1">See detailed performance metrics</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  );
};

export default Dashboard;