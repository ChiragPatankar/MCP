import React from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, MessageSquare, Users, TrendingUp, Clock, ThumbsUp } from 'lucide-react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for demonstration
const dailyData = [
  { date: '2024-01-01', conversations: 45, resolvedRate: 92 },
  { date: '2024-01-02', conversations: 52, resolvedRate: 88 },
  { date: '2024-01-03', conversations: 61, resolvedRate: 95 },
  { date: '2024-01-04', conversations: 48, resolvedRate: 90 },
  { date: '2024-01-05', conversations: 55, resolvedRate: 93 },
  { date: '2024-01-06', conversations: 67, resolvedRate: 91 },
  { date: '2024-01-07', conversations: 58, resolvedRate: 94 },
];

const topQuestions = [
  { question: 'How do I reset my password?', count: 156 },
  { question: 'Where can I find pricing information?', count: 124 },
  { question: 'How do I cancel my subscription?', count: 98 },
  { question: 'What payment methods do you accept?', count: 87 },
  { question: 'How long does shipping take?', count: 76 },
];

const AnalyticsPage: React.FC = () => {
  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground mt-1">Monitor your chat support performance and trends.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,851</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2 min</div>
              <p className="text-xs text-muted-foreground mt-1">-5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
              <ThumbsUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground mt-1">+3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Conversations Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="conversations" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="resolvedRate" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Most Common Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topQuestions.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-md">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{item.question}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.count} times</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Under 1 min</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">1-2 mins</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">2-5 mins</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">5+ mins</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Very Satisfied</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Satisfied</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Neutral</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Unsatisfied</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TenantLayout>
  );
};

export default AnalyticsPage;