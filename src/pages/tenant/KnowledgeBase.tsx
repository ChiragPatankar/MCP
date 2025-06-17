import React, { useState, useEffect } from 'react';
import { Plus, Upload, Globe, Search, FileText, Trash2, CheckCircle, AlertCircle, Clock, BookOpen, Brain, Lightbulb, Database, Filter, Eye, Download, RefreshCw, Settings, Bell, X } from 'lucide-react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeBase } from '@/types';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyStates';
import { useNavigate } from 'react-router-dom';

const DocumentCard = ({ doc, index }: { doc: KnowledgeBase; index: number }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600', bg: 'bg-green-100', text: 'Active' };
      case 'processing':
        return { icon: <RefreshCw className="h-4 w-4 animate-spin" />, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Processing' };
      case 'error':
        return { icon: <AlertCircle className="h-4 w-4" />, color: 'text-red-600', bg: 'bg-red-100', text: 'Error' };
      default:
        return { icon: <Clock className="h-4 w-4" />, color: 'text-gray-600', bg: 'bg-gray-100', text: 'Unknown' };
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'pdf':
        return { icon: <FileText className="h-6 w-6" />, gradient: 'from-red-500 to-pink-500', bgGradient: 'from-red-50 to-pink-50' };
      case 'website':
        return { icon: <Globe className="h-6 w-6" />, gradient: 'from-blue-500 to-cyan-500', bgGradient: 'from-blue-50 to-cyan-50' };
      case 'text':
        return { icon: <FileText className="h-6 w-6" />, gradient: 'from-green-500 to-emerald-500', bgGradient: 'from-green-50 to-emerald-50' };
      default:
        return { icon: <FileText className="h-6 w-6" />, gradient: 'from-gray-500 to-gray-600', bgGradient: 'from-gray-50 to-gray-100' };
    }
  };

  const statusConfig = getStatusConfig(doc.status);
  const typeConfig = getTypeConfig(doc.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="bg-white border-0 shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${typeConfig.bgGradient} opacity-30 rounded-full blur-2xl`}></div>
        
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
              {typeConfig.icon}
            </div>
            <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
              {statusConfig.icon}
              <span>{statusConfig.text}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {doc.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">{doc.source}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(doc.createdAt)}
              </span>
              {doc.size && (
                <span className="font-medium">{doc.size} MB</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
                <Eye className="h-4 w-4 text-gray-600 group-hover/btn:text-primary-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
                <Download className="h-4 w-4 text-gray-600 group-hover/btn:text-primary-600" />
              </button>
            </div>
            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group/btn">
              <Trash2 className="h-4 w-4 text-gray-600 group-hover/btn:text-red-600" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatsCard = ({ icon, title, value, description, gradient }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  gradient: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="bg-white border-0 shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${gradient} opacity-10 rounded-full blur-xl`}></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const EmptyStateCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full"
  >
    <Card className="bg-white border-2 border-dashed border-gray-200">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Building Your Knowledge Base</h3>
        <p className="text-gray-500 mb-8 max-w-md">
          Upload documents or add website URLs to train your AI assistant. The more information you provide, 
          the better it can help your customers.
        </p>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="btn-secondary">
            <Globe className="h-4 w-4 mr-2" />
            Add Website
          </Button>
          <Button className="btn-modern">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const UploadModal = ({ isOpen, onClose, onUpload }: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upload Document</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Drag and drop your file here, or</p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileInput}
            accept=".pdf,.doc,.docx,.txt"
          />
          <label htmlFor="file-upload" className="text-primary-600 hover:text-primary-700 cursor-pointer">
            browse files
          </label>
          <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, TXT (max 10MB)</p>
        </div>

        {selectedFile && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        <div className="flex space-x-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile} className="flex-1">
            Upload Document
          </Button>
        </div>
      </div>
    </div>
  );
};

const UrlModal = ({ isOpen, onClose, onAdd }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (url: string, title: string) => void;
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (url && title) {
      onAdd(url, title);
      setUrl('');
      setTitle('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Website URL</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Website title"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!url || !title} className="flex-1">
            Add Website
          </Button>
        </div>
      </div>
    </div>
  );
};

const KnowledgeBasePage: React.FC = () => {
  const { user } = useAuth();
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Document Processed', message: 'FAQ Database has been successfully processed', time: '5 min ago', type: 'success' },
    { id: 2, title: 'Training Update', message: 'AI model retrained with new knowledge base', time: '1 hour ago', type: 'info' },
    { id: 3, title: 'Storage Alert', message: 'Knowledge base storage at 75% capacity', time: '3 hours ago', type: 'warning' }
  ];

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/knowledge-base`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch knowledge base');
        }

        const data = await response.json();
        setKnowledgeBase(data.documents || []);

      } catch (err) {
        console.error('Error fetching knowledge base:', err);
        setError(err instanceof Error ? err.message : 'Failed to load knowledge base');
        setKnowledgeBase([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeBase();
  }, [user]);

  const filteredDocuments = knowledgeBase.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? doc.type === filterType : true;
    return matchesSearch && matchesType;
  });

  const totalSize = knowledgeBase.reduce((total, doc) => total + (doc.size || 0), 0);
  const activeDocuments = knowledgeBase.filter(doc => doc.status === 'active').length;

  const handleUpload = (file: File) => {
    const newDoc: KnowledgeBase = {
      id: (knowledgeBase.length + 1).toString(),
      tenantId: user?.id || '',
      name: file.name.replace(/\.[^/.]+$/, ""),
      type: (['pdf', 'website', 'text'].includes(file.name.split('.').pop() || '') ? file.name.split('.').pop() : 'text') as 'pdf' | 'website' | 'text',
      source: file.name,
      status: 'processing',
      size: Math.round(file.size / 1024 / 1024 * 100) / 100, // Convert to MB
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setKnowledgeBase([...knowledgeBase, newDoc]);
  };

  const handleAddUrl = (url: string, title: string) => {
    const newDoc: KnowledgeBase = {
      id: (knowledgeBase.length + 1).toString(),
      tenantId: user?.id || '',
      name: title,
      type: 'website',
      source: url,
      status: 'processing',
      size: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setKnowledgeBase([...knowledgeBase, newDoc]);
  };

  const handleView = (id: string) => {
    console.log('Viewing document:', id);
  };

  const handleDownload = (id: string) => {
    console.log('Downloading document:', id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setKnowledgeBase(knowledgeBase.filter(doc => doc.id !== id));
    }
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  if (loading) {
    return (
      <TenantLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="space-y-8 pb-8">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-white via-purple-50 to-blue-50 border-b border-gray-100 shadow-soft -mx-6 px-6 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                    Knowledge Base
                  </h1>
                  <div className="flex items-center bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full shadow-sm">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{knowledgeBase.length} Documents</span>
                  </div>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Manage your AI training documents, FAQs, and knowledge resources to improve response accuracy.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Last updated: {new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 lg:mt-0 flex items-center space-x-3">
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
                    {knowledgeBase.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {knowledgeBase.length}
                      </div>
                    )}
                  </Button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-large z-50">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Knowledge Base Notifications</h3>
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

                {knowledgeBase.length > 0 && (
                  <>
                    <Button 
                      onClick={() => setShowUrlModal(true)} 
                      variant="outline" 
                      className="btn-secondary"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Add Website
                    </Button>
                    <Button 
                      onClick={() => setShowUploadModal(true)} 
                      className="btn-modern"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </>
                )}
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
            {knowledgeBase.length === 0 ? (
              /* Empty State */
              <EmptyState
                icon={<FileText className="h-8 w-8" />}
                title="No Documents Yet"
                description="Start building your knowledge base by uploading documents or adding website URLs to train your AI assistant."
                actionLabel="Upload First Document"
                onAction={() => setShowUploadModal(true)}
              >
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button 
                    onClick={() => setShowUploadModal(true)}
                    className="btn-modern"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button 
                    onClick={() => setShowUrlModal(true)}
                    variant="outline"
                    className="btn-secondary"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Add Website
                  </Button>
                </div>
              </EmptyState>
            ) : (
              <>
                {/* Search Bar */}
                <div className="mb-8">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Documents Grid */}
                <div className="grid gap-6">
                  {filteredDocuments.map((doc, index) => (
                    <DocumentCard 
                      key={doc.id} 
                      doc={doc} 
                      index={index}
                    />
                  ))}
                </div>

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-500">Try adjusting your search terms.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <UploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
      <UrlModal 
        isOpen={showUrlModal} 
        onClose={() => setShowUrlModal(false)}
        onAdd={handleAddUrl}
      />
    </TenantLayout>
  );
};

export default KnowledgeBasePage;