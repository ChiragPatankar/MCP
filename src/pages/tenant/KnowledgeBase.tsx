import React, { useState } from 'react';
import { Plus, Upload, Globe, Search, FileText, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeBase } from '@/types';
import { formatDate } from '@/lib/utils';

const mockKnowledgeBase: KnowledgeBase[] = [
  { id: '1', tenantId: 'tenant-1', name: 'Product Documentation.pdf', type: 'pdf', status: 'active', createdAt: new Date('2023-12-15'), updatedAt: new Date('2023-12-15'), size: 2.4, source: '/documents/product-doc.pdf' },
  { id: '2', tenantId: 'tenant-1', name: 'User Manual.pdf', type: 'pdf', status: 'active', createdAt: new Date('2023-12-20'), updatedAt: new Date('2023-12-20'), size: 1.8, source: '/documents/user-manual.pdf' },
  { id: '3', tenantId: 'tenant-1', name: 'FAQ Page', type: 'website', status: 'active', createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05'), source: 'https://example.com/faq' },
  { id: '4', tenantId: 'tenant-1', name: 'API Documentation', type: 'website', status: 'processing', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10'), source: 'https://example.com/api/docs' },
  { id: '5', tenantId: 'tenant-1', name: 'Troubleshooting Guide.pdf', type: 'pdf', status: 'error', createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-15'), size: 3.2, source: '/documents/troubleshooting.pdf' },
  { id: '6', tenantId: 'tenant-1', name: 'Release Notes.pdf', type: 'pdf', status: 'active', createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-01-20'), size: 0.9, source: '/documents/release-notes.pdf' },
];

const KnowledgeBasePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);

  const filteredDocuments = mockKnowledgeBase.filter(doc => {
    // Apply search filter
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const matchesType = filterType ? doc.type === filterType : true;
    
    return matchesSearch && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'website':
        return <Globe className="h-5 w-5 text-primary" />;
      case 'text':
        return <FileText className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowUrlModal(true)}>
              <Globe className="h-4 w-4 mr-2" />
              Add URL
            </Button>
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Documents</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="pl-8 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative inline-block">
                  <select
                    className="appearance-none pl-4 pr-8 py-2 border rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={filterType || ''}
                    onChange={(e) => setFilterType(e.target.value || null)}
                  >
                    <option value="">All Types</option>
                    <option value="pdf">PDF</option>
                    <option value="website">Website</option>
                    <option value="text">Text</option>
                  </select>
                  <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date Added</th>
                    <th className="px-4 py-3 text-right">Size</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
                            {getTypeIcon(doc.type)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{doc.source}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 capitalize">{doc.type}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(doc.status)}
                          <span className="ml-1.5 capitalize">{doc.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{formatDate(doc.createdAt)}</td>
                      <td className="px-4 py-4 text-right">{doc.size ? `${doc.size} MB` : '-'}</td>
                      <td className="px-4 py-4 text-center">
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No documents found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload tips card */}
        <Card>
          <CardHeader>
            <CardTitle>Tips for Better AI Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Optimize Your Documents</h3>
                <p className="text-sm text-gray-600">For best results, ensure PDFs are text-searchable and not just scanned images. This allows our AI to properly read and understand the content.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Website Crawling</h3>
                <p className="text-sm text-gray-600">When adding a website URL, provide the main page or sitemap for comprehensive crawling. Our system will navigate through links to gather all relevant information.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Regular Updates</h3>
                <p className="text-sm text-gray-600">Keep your knowledge base current by regularly uploading updated documentation. The AI will automatically incorporate the latest information.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Document Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Upload Document</h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Drag and drop your file here, or click to browse</p>
                    <p className="text-xs text-gray-500 mt-1">Supports PDF, DOCX, TXT (Max 10MB)</p>
                    <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm">
                      Choose File
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md" 
                      placeholder="Enter document name" 
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </Button>
                  <Button>
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Add URL Modal */}
        {showUrlModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Add Website URL</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md" 
                      placeholder="https://example.com/documentation" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the full URL including https://</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md" 
                      placeholder="Website name" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crawl Options</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="subpages" className="rounded text-primary focus:ring-primary" />
                        <label htmlFor="subpages" className="ml-2 text-sm text-gray-700">Include subpages</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="pdf" className="rounded text-primary focus:ring-primary" />
                        <label htmlFor="pdf" className="ml-2 text-sm text-gray-700">Process PDF files found on the site</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowUrlModal(false)}>
                    Cancel
                  </Button>
                  <Button>
                    Add URL
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TenantLayout>
  );
};

export default KnowledgeBasePage;