import React, { useState } from 'react';
import { Calendar, MessageSquare, Users, TrendingUp, Clock, ThumbsUp, TrendingDown, Target, Brain, Zap, Download, Filter, BarChart3, PieChart as PieChartIcon, Activity, Settings, Bell, CheckCircle } from 'lucide-react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MetricCard = ({ icon, title, value, description, gradient, trend, trendType }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  gradient: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="bg-white border-0 shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${gradient} opacity-10 rounded-full blur-xl`}></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              trendType === 'positive' ? 'text-green-600' : 
              trendType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trendType === 'positive' && <TrendingUp className="h-3 w-3" />}
              {trendType === 'negative' && <TrendingDown className="h-3 w-3" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const navigate = useNavigate();

  // Mock notifications for analytics
  const notifications = [
    { id: 1, title: 'Performance Alert', message: 'Resolution rate increased by 15%', time: '2 min ago', type: 'success' },
    { id: 2, title: 'Weekly Report', message: 'Analytics report is ready for download', time: '1 hour ago', type: 'info' },
    { id: 3, title: 'Data Processing', message: 'Monthly analytics compilation completed', time: '3 hours ago', type: 'success' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsExporting(false);
    setExportSuccess(true);
    
    // Reset success state after 3 seconds
    setTimeout(() => {
      setExportSuccess(false);
    }, 3000);
  };

  const handleCustomReport = async () => {
    setIsGeneratingReport(true);
    setReportSuccess(false);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsGeneratingReport(false);
    setReportSuccess(true);
    
    // Reset success state after 3 seconds
    setTimeout(() => {
      setReportSuccess(false);
    }, 3000);
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="space-y-8 pb-8">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b border-gray-100 shadow-soft -mx-6 px-6 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                    Analytics
                  </h1>
                  <div className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full shadow-sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Live Data</span>
                  </div>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Monitor performance metrics, track trends, and gain insights into your AI support system.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Last updated: {new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 lg:mt-0 flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <select
                    className="px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="1d">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
                
                <Button 
                  onClick={handleSettings}
                  variant="outline" 
                  className="btn-secondary"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>

                <div className="relative">
                  <Button
                    onClick={() => setShowNotifications(!showNotifications)}
                    variant="outline"
                    className="btn-secondary relative"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    {notifications.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </div>
                    )}
                  </Button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-large z-50">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Analytics Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="p-4 border-b border-gray-50 hover:bg-gray-50">
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'success' ? 'bg-green-500' : 
                                notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleExport}
                  variant="outline" 
                  className="btn-secondary"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  ) : exportSuccess ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : exportSuccess ? 'Exported!' : 'Export'}
                </Button>

                <Button 
                  onClick={handleCustomReport}
                  className="btn-modern"
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  ) : reportSuccess ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Filter className="h-4 w-4 mr-2" />
                  )}
                  {isGeneratingReport ? 'Generating...' : reportSuccess ? 'Generated!' : 'Custom Report'}
                </Button>
              </div>
            </div>

            {/* Click outside to close notifications */}
            {showNotifications && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
            )}
          </div>

          <div className="px-6">
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <MetricCard
                icon={<MessageSquare className="h-6 w-6" />}
                title="Total Conversations"
                value="2,851"
                description="All time interactions"
                gradient="from-blue-500 to-cyan-500"
                trend="+12%"
                trendType="positive"
              />
              <MetricCard
                icon={<Clock className="h-6 w-6" />}
                title="Avg Response Time"
                value="1.2 min"
                description="Faster than industry avg"
                gradient="from-green-500 to-emerald-500"
                trend="-5%"
                trendType="positive"
              />
              <MetricCard
                icon={<Target className="h-6 w-6" />}
                title="Resolution Rate"
                value="92%"
                description="Successfully resolved"
                gradient="from-purple-500 to-pink-500"
                trend="+3%"
                trendType="positive"
              />
              <MetricCard
                icon={<ThumbsUp className="h-6 w-6" />}
                title="Satisfaction Score"
                value="4.4★"
                description="Customer rating"
                gradient="from-yellow-500 to-orange-500"
                trend="+0.2"
                trendType="positive"
              />
            </div>

            {/* Placeholder for Charts */}
            <div className="grid gap-8 lg:grid-cols-2 mb-8">
              <Card className="bg-white border-0 shadow-soft">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    Conversation Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl">
                    <p className="text-gray-500">Chart will be added here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-soft">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <Target className="h-5 w-5 text-green-600 mr-2" />
                    Resolution & Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl">
                    <p className="text-gray-500">Chart will be added here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="bg-white border-0 shadow-soft">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 text-indigo-600 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">AI Accuracy</span>
                      <span className="text-sm font-semibold">94%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <motion.div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '94%' }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Knowledge Coverage</span>
                      <span className="text-sm font-semibold">89%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <motion.div 
                        className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '89%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">System Uptime</span>
                      <span className="text-sm font-semibold">99.9%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <motion.div 
                        className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '99.9%' }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
};

export default AnalyticsPage;