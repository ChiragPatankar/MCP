import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Shield, AlertTriangle, Settings, Bell, Plus, X, CheckCircle } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const mockTenants = [
  { id: '1', name: 'TechCorp', plan: 'Pro', status: 'active', users: 12, bots: 8, messagesThisMonth: 9842, storageUsed: '45 MB', owner: 'John Smith', created: new Date('2023-11-15') },
  { id: '2', name: 'MarketingPro', plan: 'Starter', status: 'active', users: 5, bots: 3, messagesThisMonth: 3241, storageUsed: '12 MB', owner: 'Sarah Johnson', created: new Date('2023-12-02') },
  { id: '3', name: 'DesignMasters', plan: 'Enterprise', status: 'active', users: 45, bots: 15, messagesThisMonth: 21504, storageUsed: '120 MB', owner: 'Michael Brown', created: new Date('2023-10-10') },
  { id: '4', name: 'EcomStore', plan: 'Free', status: 'pending', users: 1, bots: 1, messagesThisMonth: 154, storageUsed: '2 MB', owner: 'Emma Wilson', created: new Date('2024-01-05') },
  { id: '5', name: 'HealthTech', plan: 'Starter', status: 'suspended', users: 8, bots: 2, messagesThisMonth: 0, storageUsed: '8 MB', owner: 'David Lee', created: new Date('2023-08-22') },
  { id: '6', name: 'FinanceApp', plan: 'Pro', status: 'active', users: 15, bots: 5, messagesThisMonth: 7623, storageUsed: '32 MB', owner: 'Jessica Taylor', created: new Date('2023-09-30') },
  { id: '7', name: 'EdTech Solutions', plan: 'Free', status: 'active', users: 3, bots: 1, messagesThisMonth: 947, storageUsed: '5 MB', owner: 'Robert Johnson', created: new Date('2024-01-15') },
  { id: '8', name: 'GameDev Studio', plan: 'Starter', status: 'active', users: 7, bots: 2, messagesThisMonth: 2156, storageUsed: '18 MB', owner: 'Amanda Clark', created: new Date('2023-11-20') },
];

// Add Tenant Modal Component
const AddTenantModal = ({ isOpen, onClose, onAdd }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tenant: any) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    email: '',
    plan: 'Free'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTenant = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      owner: formData.owner,
      email: formData.email,
      plan: formData.plan,
      status: 'active',
      users: 1,
      bots: 0,
      messagesThisMonth: 0,
      storageUsed: '0 MB',
      created: new Date()
    };
    onAdd(newTenant);
    setFormData({ name: '', owner: '', email: '', plan: 'Free' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add New Tenant</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
            <input
              type="text"
              required
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter owner name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Free">Free</option>
              <option value="Starter">Starter</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Tenant
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Action Menu Component
const ActionMenu = ({ tenant, onView, onEdit, onDelete }: {
  tenant: any;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="text-gray-500 hover:text-gray-700 p-1"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {showMenu && (
        <>
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => { onView(tenant.id); setShowMenu(false); }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                View Details
              </button>
              <button
                onClick={() => { onEdit(tenant.id); setShowMenu(false); }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Tenant
              </button>
              <hr className="my-1" />
              <button
                onClick={() => { onDelete(tenant.id); setShowMenu(false); }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete Tenant
              </button>
            </div>
          </div>
          <div 
            className="fixed inset-0 z-5" 
            onClick={() => setShowMenu(false)}
          />
        </>
      )}
    </div>
  );
};

const TenantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPlan, setFilterPlan] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [tenants, setTenants] = useState(mockTenants);

  // Mock notifications for admin
  const notifications = [
    { id: 1, title: 'New Tenant', message: 'GameDev Studio just signed up', time: '10 min ago', type: 'success' },
    { id: 2, title: 'Suspension Alert', message: 'HealthTech account suspended due to payment issues', time: '1 hour ago', type: 'warning' },
    { id: 3, title: 'Upgrade', message: 'TechCorp upgraded to Enterprise plan', time: '2 hours ago', type: 'info' }
  ];

  const filteredTenants = tenants.filter(tenant => {
    // Apply search filter
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tenant.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = filterStatus ? tenant.status === filterStatus : true;
    
    // Apply plan filter
    const matchesPlan = filterPlan ? tenant.plan === filterPlan : true;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleAddTenant = (newTenant: any) => {
    setTenants([...tenants, newTenant]);
  };

  const handleViewTenant = (tenantId: string) => {
    navigate(`/admin/tenants/${tenantId}`);
  };

  const handleEditTenant = (tenantId: string) => {
    console.log('Edit tenant:', tenantId);
  };

  const handleDeleteTenant = (tenantId: string) => {
    if (confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      setTenants(tenants.filter(t => t.id !== tenantId));
    }
  };

  const handleSettings = () => {
    navigate('/admin/settings');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b border-gray-100 shadow-soft -mx-6 px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Tenants
                </h2>
                <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full shadow-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{tenants.length} Organizations</span>
                </div>
              </div>
              <p className="text-lg text-gray-600">Manage all tenant organizations and their subscriptions.</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>Last updated: {new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
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
                      <h3 className="font-semibold text-gray-900">Tenant Notifications</h3>
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
                onClick={() => setShowAddModal(true)}
                variant="default"
                className="btn-modern"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant
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
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>All Tenants</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search tenants..."
                    className="pl-8 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative inline-block">
                  <select
                    className="appearance-none pl-4 pr-8 py-2 border rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={filterStatus || ''}
                    onChange={(e) => setFilterStatus(e.target.value || null)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                
                <div className="relative inline-block">
                  <select
                    className="appearance-none pl-4 pr-8 py-2 border rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={filterPlan || ''}
                    onChange={(e) => setFilterPlan(e.target.value || null)}
                  >
                    <option value="">All Plans</option>
                    <option value="Free">Free</option>
                    <option value="Starter">Starter</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left">Tenant</th>
                    <th className="px-4 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Users</th>
                    <th className="px-4 py-3 text-center">Bots</th>
                    <th className="px-4 py-3 text-right">Messages</th>
                    <th className="px-4 py-3 text-right">Storage</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                            {tenant.status === 'suspended' ? 
                              <AlertTriangle className="h-4 w-4" /> : 
                              <Shield className="h-4 w-4" />
                            }
                          </div>
                          <div className="ml-3">
                            <p 
                              className="font-medium text-gray-900 hover:text-primary-600 cursor-pointer transition-colors"
                              onClick={() => handleViewTenant(tenant.id)}
                            >
                              {tenant.name}
                            </p>
                            <p className="text-xs text-gray-500">{tenant.owner}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tenant.plan === 'Free' ? 'bg-gray-100 text-gray-800' :
                          tenant.plan === 'Starter' ? 'bg-blue-100 text-blue-800' :
                          tenant.plan === 'Pro' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {tenant.plan}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                          tenant.status === 'suspended' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">{tenant.users}</td>
                      <td className="px-4 py-4 text-center">{tenant.bots}</td>
                      <td className="px-4 py-4 text-right">{tenant.messagesThisMonth.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">{tenant.storageUsed}</td>
                      <td className="px-4 py-4">{formatDate(tenant.created)}</td>
                      <td className="px-4 py-4 text-center">
                        <ActionMenu 
                          tenant={tenant}
                          onView={handleViewTenant}
                          onEdit={handleEditTenant}
                          onDelete={handleDeleteTenant}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredTenants.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tenants found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Tenant Modal */}
      <AddTenantModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTenant}
      />
    </AdminLayout>
  );
};

export default TenantsPage;