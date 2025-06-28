import React from 'react';
import { TrendingUp, DollarSign, Users, Star, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';

const DemoRevenueDashboard: React.FC = () => {
  const { demoMetrics, demoSessions } = useDemo();

  const recentSessions = demoSessions.slice(-5).reverse();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonth - 11 + i + 12) % 12;
    return monthNames[monthIndex];
  });

  const topCategories = Object.entries(demoMetrics.sessionsByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your platform's growth and performance</p>
        </div>
        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          Demo Mode
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${demoMetrics.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +{demoMetrics.growthRate}% this month
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{demoMetrics.totalSessions.toLocaleString()}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Activity className="h-4 w-4 mr-1" />
                +15% this week
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{demoMetrics.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-purple-600 flex items-center mt-1">
                <Users className="h-4 w-4 mr-1" />
                +8% this month
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Rating</p>
              <p className="text-3xl font-bold text-gray-900">{demoMetrics.averageRating.toFixed(1)}</p>
              <p className="text-sm text-yellow-600 flex items-center mt-1">
                <Star className="h-4 w-4 mr-1" />
                Excellent quality
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary-500" />
              Monthly Revenue
            </h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>Last 12 months</option>
              <option>Last 6 months</option>
              <option>Last 3 months</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {demoMetrics.monthlyRevenue.map((revenue, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 text-sm text-gray-600">{last12Months[index]}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${(revenue / Math.max(...demoMetrics.monthlyRevenue)) * 100}%` }}
                  ></div>
                </div>
                <div className="w-20 text-sm font-medium text-gray-900 text-right">
                  ${revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-secondary-500" />
              Top Categories
            </h3>
          </div>
          
          <div className="space-y-4">
            {topCategories.map(([category, count], index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
              const percentage = (count / demoMetrics.totalSessions) * 100;
              
              return (
                <div key={category} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${colors[index]}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{category}</span>
                      <span className="text-sm text-gray-600">{count} sessions</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index]} transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 w-12 text-right">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Sessions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Session ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Topic</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-mono text-gray-600">
                    {session.id.slice(-8)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{session.topic}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {session.scheduledTime.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'completed' ? 'bg-green-100 text-green-700' :
                      session.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    ${session.revenue}
                  </td>
                  <td className="py-3 px-4">
                    {session.rating ? (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{session.rating}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">Peak Hours</h4>
          <p className="text-blue-100 text-sm mb-3">Most sessions happen between 2-4 PM</p>
          <div className="text-2xl font-bold">2:00 PM</div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">Avg. Session Value</h4>
          <p className="text-green-100 text-sm mb-3">Revenue per completed session</p>
          <div className="text-2xl font-bold">${(demoMetrics.totalRevenue / demoMetrics.totalSessions).toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">Retention Rate</h4>
          <p className="text-purple-100 text-sm mb-3">Users who book multiple sessions</p>
          <div className="text-2xl font-bold">78%</div>
        </div>
      </div>
    </div>
  );
};

export default DemoRevenueDashboard;