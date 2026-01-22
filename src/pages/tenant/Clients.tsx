import React, { useState } from 'react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Search, Filter, MoreHorizontal, Calendar, Settings, Bell, Globe, Activity, TrendingUp, Edit, Trash2, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClientsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    website: '',
    description: ''
  });

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleAddClient = () => {
    setShowAddClientModal(true);
  };

  const handleSaveClient = () => {
    // Here you would typically make an API call to save the client
    console.log('Saving client:', newClient);
    setShowAddClientModal(false);
    setNewClient({ name: '', website: '', description: '' });
    // Show success message or refresh client list
  };

  const handleViewClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/clients/${clientId}/edit`);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      // API call to delete client
      console.log('Deleting client:', clientId);
    }
  };

  const handleActionMenuToggle = (clientId: string) => {
    setSelectedClient(selectedClient === clientId ? null : clientId);
  };

  // Mock client data
  const mockClients = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      website: 'techcorp.com',
      status: 'active',
      totalConversations: 1247,
      resolvedPercentage: 94,
      lastActivity: '2 hours ago',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Digital Marketing Pro',
      website: 'digitalmarketingpro.com',
      status: 'active',
      totalConversations: 856,
      resolvedPercentage: 89,
      lastActivity: '1 day ago',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'E-commerce Store',
      website: 'myecomstore.com',
      status: 'pending',
      totalConversations: 234,
      resolvedPercentage: 76,
      lastActivity: '3 days ago',
      createdAt: '2024-01-20'
    }
  ];

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="space-y-8 pb-8">
          {/* Modern Header */}
          <div className="bg-white border-b border-gray-100 -mx-6 px-6 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                    Clients
                  </h1>
                  <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full shadow-sm">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{filteredClients.length} Active</span>
                  </div>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Manage your clients and their chat widget deployments. Monitor performance, track conversations, and ensure optimal support delivery.
                </p>
              </div>
              
              <div className="mt-6 lg:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Last updated</span>
                  </div>
                  <p className="font-semibold text-gray-900">{new Date().toLocaleString()}</p>
                </div>
                <div className="flex space-x-2 relative">
                  <button 
                    onClick={handleNotificationsClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={handleSettingsClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="h-5 w-5 text-gray-600" />
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-900">Client Updates</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">New client added</p>
                            <p className="text-xs text-gray-500">TechCorp Solutions joined</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">Widget deployed</p>
                            <p className="text-xs text-gray-500">E-commerce Store went live</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="bg-white border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Clients</p>
                      <p className="text-3xl font-bold text-gray-900">{mockClients.length}</p>
                      <p className="text-sm text-green-600 mt-1">+2 this month</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {mockClients.reduce((sum, client) => sum + client.totalConversations, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-600 mt-1">+15% this week</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Resolution Rate</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {Math.round(mockClients.reduce((sum, client) => sum + client.resolvedPercentage, 0) / mockClients.length)}%
                      </p>
                      <p className="text-sm text-green-600 mt-1">+3% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card className="bg-white border-0 shadow-soft">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary-600" />
                    Client Management
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <Button onClick={handleAddClient} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Client
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredClients.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Conversations</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Resolution Rate</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Last Activity</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredClients.map((client) => (
                          <tr key={client.id} className="hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold mr-3">
                                  {client.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{client.name}</p>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <Globe className="h-3 w-3 mr-1" />
                                    {client.website}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                client.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center font-medium">
                              {client.totalConversations.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center">
                                <span className="font-medium">{client.resolvedPercentage}%</span>
                                <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${client.resolvedPercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {client.lastActivity}
                            </td>
                            <td className="py-4 px-4 text-center relative">
                              <button 
                                onClick={() => handleActionMenuToggle(client.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <MoreHorizontal className="h-5 w-5" />
                              </button>
                              
                              {/* Action Menu */}
                              {selectedClient === client.id && (
                                <div className="absolute right-0 top-12 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleViewClient(client.id)}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => handleEditClient(client.id)}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClient(client.id)}
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm 
                        ? "No clients match your search criteria." 
                        : "Get started by adding your first client."
                      }
                    </p>
                    <Button onClick={handleAddClient} className="flex items-center gap-2 mx-auto">
                      <Plus className="h-4 w-4" />
                      Add First Client
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Client Modal */}
        {showAddClientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Add New Client</h3>
                <button
                  onClick={() => setShowAddClientModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter client name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL *
                  </label>
                  <input
                    type="text"
                    value={newClient.website}
                    onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newClient.description}
                    onChange={(e) => setNewClient({ ...newClient, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Brief description of the client"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 p-6 border-t">
                <Button
                  onClick={() => setShowAddClientModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveClient}
                  disabled={!newClient.name || !newClient.website}
                >
                  Add Client
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TenantLayout>
  );
};

export default ClientsPage;