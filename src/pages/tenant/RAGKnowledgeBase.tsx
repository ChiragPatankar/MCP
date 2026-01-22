import React, { useState, useEffect } from 'react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Database,
  X,
  BookOpen,
} from 'lucide-react';
import RAGClient, { KnowledgeBaseStats } from '@/api/ragClient';
import { useToast } from '@/components/ToastContainer';
import { EmptyState } from '@/components/EmptyStates';

const RAGKnowledgeBasePage: React.FC = () => {
  const [kbId, setKbId] = useState('default');
  const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { success, error } = useToast();

  useEffect(() => {
    loadStats();
  }, [kbId]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await RAGClient.getKBStats(kbId);
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
      if (err.response?.status !== 404) {
        error(err.response?.data?.detail || 'Failed to load knowledge base stats');
      }
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
      ];
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.md'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (
        !allowedTypes.includes(file.type) &&
        !allowedExtensions.includes(fileExtension)
      ) {
        error('Invalid file type. Please upload PDF, DOC, DOCX, TXT, or MD files.');
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        error('File size exceeds 50MB limit.');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const response = await RAGClient.uploadDocument(selectedFile, kbId);
      success(`Document uploaded successfully! Created ${response.chunks_created} chunks.`);
      setSelectedFile(null);
      setShowUploadModal(false);
      await loadStats(); // Refresh stats
    } catch (err: any) {
      console.error('Upload error:', err);
      if (err.response?.status === 402) {
        error('Quota exceeded. Please upgrade your plan.');
      } else {
        error(err.response?.data?.detail || err.message || 'Failed to upload document');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = document.createElement('input');
      input.type = 'file';
      input.files = e.dataTransfer.files;
      handleFileSelect({ target: input } as any);
    }
  };

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="space-y-8 pb-8">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                  RAG Knowledge Base
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Upload documents to train your AI assistant. Supports PDF, DOCX, TXT, and Markdown files.
                </p>
              </div>
              <div className="mt-6 lg:mt-0">
                <Button onClick={() => setShowUploadModal(true)} className="btn-modern">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6">
            {/* KB ID Selector (Dev Mode Only) */}
            {import.meta.env.DEV && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Knowledge Base ID (Dev Mode)
                  </label>
                  <input
                    type="text"
                    value={kbId}
                    onChange={(e) => setKbId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="default"
                  />
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </CardContent>
              </Card>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                        <Database className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.total_documents}</h3>
                        <p className="text-sm text-gray-600 font-medium">Documents</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.total_chunks}</h3>
                        <p className="text-sm text-gray-600 font-medium">Chunks</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.file_names.length}</h3>
                        <p className="text-sm text-gray-600 font-medium">Files</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <EmptyState
                icon={<BookOpen className="h-8 w-8" />}
                title="No Knowledge Base Yet"
                description="Upload your first document to start building your knowledge base."
                actionLabel="Upload Document"
                onAction={() => setShowUploadModal(true)}
              />
            )}

            {/* File List */}
            {stats && stats.file_names.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.file_names.map((fileName, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{fileName}</span>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upload Document</CardTitle>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedFile(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    selectedFile
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-400'
                  }`}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {selectedFile ? selectedFile.name : 'Drag and drop your file here, or'}
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.md"
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium"
                  >
                    browse files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, TXT, MD (max 50MB)
                  </p>
                </div>

                {selectedFile && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedFile(null);
                    }}
                    className="flex-1"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TenantLayout>
  );
};

export default RAGKnowledgeBasePage;

