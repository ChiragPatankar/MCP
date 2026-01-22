import React from 'react';
import { 
  Building, 
  Users, 
  MessageSquare, 
  Zap, 
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Settings,
  Bell,
  TrendingUp
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Mock admin notifications
  const notifications = [
    { id: 1, title: 'System Alert', message: 'High server load detected', time: '10 min ago', type: 'warning' },
    { id: 2, title: 'New Signup', message: 'TechCorp upgraded to Pro plan', time: '1 hour ago', type: 'success' },
    { id: 3, title: 'Payment Issue', message: 'HealthTech payment failed', time: '2 hours ago', type: 'error' }
  ];

  const recentTenants = [
    { id: '1', name: 'TechCorp', plan: 'Pro', status: 'active', users: 12, bots: 8, date: '2 days ago' },
    { id: '2', name: 'MarketingPro', plan: 'Starter', status: 'active', users: 5, bots: 3, date: '1 week ago' },
    { id: '3', name: 'DesignMasters', plan: 'Enterprise', status: 'active', users: 45, bots: 15, date: '2 weeks ago' },
    { id: '4', name: 'EcomStore', plan: 'Free', status: 'pending', users: 1, bots: 1, date: '3 days ago' },
    { id: '5', name: 'HealthTech', plan: 'Starter', status: 'suspended', users: 8, bots: 2, date: '1 month ago' },
  ];

  const alerts = [
    { id: '1', tenant: 'HealthTech', message: 'Payment failed for subscription renewal', level: 'high', time: '4 hours ago' },
    { id: '2', tenant: 'MarketingPro', message: 'Approaching storage limit (90% used)', level: 'medium', time: '1 day ago' },
    { id: '3', tenant: 'TechCorp', message: 'Unusual traffic spike detected', level: 'low', time: '2 days ago' },
  ];

  const handleViewAllTenants = () => {
    navigate('/admin/tenants');
  };

  const handleViewTenant = (tenantId: string) => {
    navigate(`/admin/tenants/${tenantId}`);
  };

  const handleSettings = () => {
    navigate('/admin/settings');
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b border-gray-100 shadow-soft -mx-6 px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h2>
                <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full shadow-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Live Data</span>
                </div>
              </div>
              <p className="text-lg text-gray-600">Welcome back, {user?.name}!</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>Last updated: {new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 md:mt-0 flex items-center space-x-3">
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
                      <h3 className="font-semibold text-gray-900">Admin Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-50 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' : 
                              notification.type === 'warning' ? 'bg-yellow-500' : 
                              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Total Tenants" 
            value="128" 
            icon={<Building className="h-4 w-4" />} 
            change="12% from last month" 
            changeType="positive" 
          />
          <DashboardCard 
            title="Active Users" 
            value="3,842" 
            icon={<Users className="h-4 w-4" />}
            change="8% from last month" 
            changeType="positive"
          />
          <DashboardCard 
            title="Active Bots" 
            value="536" 
            icon={<MessageSquare className="h-4 w-4" />}
            change="15% from last month" 
            changeType="positive"
          />
          <DashboardCard 
            title="System Load" 
            value="42%" 
            icon={<Zap className="h-4 w-4" />}
            change="5% increase" 
            changeType="negative"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTenants.map((tenant) => (
                  <div 
                    key={tenant.id} 
                    className="flex items-start space-x-4 bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleViewTenant(tenant.id)}
                  >
                    <div className={`rounded-full h-2 w-2 mt-2 ${
                      tenant.status === 'active' ? 'bg-green-500' :
                      tenant.status === 'suspended' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium hover:text-primary-600 transition-colors">{tenant.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          tenant.plan === 'Free' ? 'bg-gray-100 text-gray-800' :
                          tenant.plan === 'Starter' ? 'bg-blue-100 text-blue-800' :
                          tenant.plan === 'Pro' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {tenant.plan}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{tenant.users} users</span>
                        <span>{tenant.bots} bots</span>
                        <span>Created {tenant.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button 
                  onClick={handleViewAllTenants}
                  variant="outline"
                  className="text-sm text-primary hover:underline"
                >
                  View all tenants
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-4 bg-gray-50 p-3 rounded-md">
                    <div className={`p-1 rounded-md ${
                      alert.level === 'high' ? 'bg-red-100 text-red-500' :
                      alert.level === 'medium' ? 'bg-yellow-100 text-yellow-500' : 
                      'bg-blue-100 text-blue-500'
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{alert.tenant}</p>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{alert.message}</p>
                    </div>
                  </div>
                ))}

                {alerts.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500">No alerts at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscription Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Free Plan</p>
                <p className="text-2xl font-bold mt-1">42</p>
                <p className="text-xs text-gray-500 mt-1">Tenants</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Starter Plan</p>
                <p className="text-2xl font-bold mt-1">56</p>
                <p className="text-xs text-gray-500 mt-1">Tenants</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Pro Plan</p>
                <p className="text-2xl font-bold mt-1">23</p>
                <p className="text-xs text-gray-500 mt-1">Tenants</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Enterprise Plan</p>
                <p className="text-2xl font-bold mt-1">7</p>
                <p className="text-xs text-gray-500 mt-1">Tenants</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Monthly Recurring Revenue</h4>
              <div className="h-10 bg-gray-100 rounded-md overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-gray-300 h-full w-[33%]" title="Free: $0"></div>
                  <div className="bg-blue-400 h-full w-[28%]" title="Starter: $2,744"></div>
                  <div className="bg-purple-500 h-full w-[23%]" title="Pro: $2,277"></div>
                  <div className="bg-green-500 h-full w-[16%]" title="Enterprise: $1,750"></div>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Free: $0</span>
                <span>Starter: $2,744</span>
                <span>Pro: $2,277</span>
                <span>Enterprise: $1,750</span>
              </div>
              <p className="text-right mt-2 font-medium">Total MRR: $6,771</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;