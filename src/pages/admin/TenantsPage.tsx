import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Shield, AlertTriangle } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

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

const TenantsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPlan, setFilterPlan] = useState<string | null>(null);

  const filteredTenants = mockTenants.filter(tenant => {
    // Apply search filter
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tenant.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = filterStatus ? tenant.status === filterStatus : true;
    
    // Apply plan filter
    const matchesPlan = filterPlan ? tenant.plan === filterPlan : true;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Tenants</h2>
          <Button variant="default">Add Tenant</Button>
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
                            <p className="font-medium text-gray-900">{tenant.name}</p>
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
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
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
    </AdminLayout>
  );
};

export default TenantsPage;