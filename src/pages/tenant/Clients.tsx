import React from 'react';
import TenantLayout from '@/components/layout/TenantLayout';

const ClientsPage = () => {
  return (
    <TenantLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Clients</h1>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-600">Manage your clients and their access here.</p>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
};

export default ClientsPage;