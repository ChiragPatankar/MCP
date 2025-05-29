import React, { useState } from 'react';
import { MessageSquare, Search, Filter, Calendar, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

const mockChats = [
  {
    id: '1',
    user: 'John Smith',
    email: 'john@example.com',
    query: 'How do I reset my password?',
    timestamp: new Date('2024-02-20T10:30:00'),
    duration: '5m 30s',
    sentiment: 'positive',
    resolved: true,
    messages: 8
  },
  {
    id: '2',
    user: 'Sarah Johnson',
    email: 'sarah@example.com',
    query: 'Having trouble with checkout',
    timestamp: new Date('2024-02-20T09:15:00'),
    duration: '12m 45s',
    sentiment: 'negative',
    resolved: false,
    messages: 15
  },
  {
    id: '3',
    user: 'Mike Brown',
    email: 'mike@example.com',
    query: 'Where can I find pricing information?',
    timestamp: new Date('2024-02-20T08:45:00'),
    duration: '3m 20s',
    sentiment: 'positive',
    resolved: true,
    messages: 5
  },
  {
    id: '4',
    user: 'Emma Wilson',
    email: 'emma@example.com',
    query: 'Need help with integration',
    timestamp: new Date('2024-02-19T16:20:00'),
    duration: '15m 10s',
    sentiment: 'neutral',
    resolved: true,
    messages: 20
  },
  {
    id: '5',
    user: 'David Lee',
    email: 'david@example.com',
    query: 'Cannot access my account',
    timestamp: new Date('2024-02-19T14:50:00'),
    duration: '8m 15s',
    sentiment: 'negative',
    resolved: true,
    messages: 12
  }
];

const ChatHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterSentiment, setFilterSentiment] = useState<string | null>(null);

  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = 
      chat.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.query.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus ? 
      (filterStatus === 'resolved' ? chat.resolved : !chat.resolved) : 
      true;
    
    const matchesSentiment = filterSentiment ? 
      chat.sentiment === filterSentiment : 
      true;
    
    return matchesSearch && matchesStatus && matchesSentiment;
  });

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chat History</h2>
          <p className="text-muted-foreground mt-1">View and analyze past conversations.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Recent Conversations</CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="pl-8 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-3 py-2 border rounded-md bg-white"
                  value={filterStatus || ''}
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                >
                  <option value="">All Status</option>
                  <option value="resolved">Resolved</option>
                  <option value="unresolved">Unresolved</option>
                </select>
                
                <select
                  className="px-3 py-2 border rounded-md bg-white"
                  value={filterSentiment || ''}
                  onChange={(e) => setFilterSentiment(e.target.value || null)}
                >
                  <option value="">All Sentiment</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Query</th>
                    <th className="px-4 py-3 text-left">Time</th>
                    <th className="px-4 py-3 text-center">Duration</th>
                    <th className="px-4 py-3 text-center">Messages</th>
                    <th className="px-4 py-3 text-center">Sentiment</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredChats.map((chat) => (
                    <tr key={chat.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{chat.user}</p>
                          <p className="text-xs text-gray-500">{chat.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-gray-900">{chat.query}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{formatDate(chat.timestamp)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{chat.duration}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{chat.messages}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          {chat.sentiment === 'positive' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Positive
                            </span>
                          )}
                          {chat.sentiment === 'negative' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              Negative
                            </span>
                          )}
                          {chat.sentiment === 'neutral' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Neutral
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          {chat.resolved ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredChats.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No conversations found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  );
};

export default ChatHistoryPage;