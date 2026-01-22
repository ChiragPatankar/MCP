import React, { useState } from 'react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, FileText, ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import RAGClient, { SearchResponse, RetrievalResult } from '@/api/ragClient';
import { useToast } from '@/components/ToastContainer';

const RetrievalTestPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [kbId, setKbId] = useState('default');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [expandedChunks, setExpandedChunks] = useState<Set<string>>(new Set());
  const { success, error } = useToast();

  const exampleQueries = [
    "What are your pricing plans?",
    "How do I reset my password?",
    "What file types can I upload?",
    "What is your refund policy?",
    "How do I integrate ClientSphere?",
    "What languages do you support?",
    "What are your support hours?",
    "How secure is my data?"
  ];

  const handleSearch = async () => {
    if (!query.trim()) {
      error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const response = await RAGClient.searchKB(query, kbId, 5);
      setResults(response);
      if (response.results.length === 0) {
        error('No results found. Try a different query or upload documents first.');
      } else {
        success(`Found ${response.results.length} relevant chunks`);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      error(err.response?.data?.detail || err.message || 'Failed to search knowledge base');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (chunkId: string) => {
    setExpandedChunks((prev) => {
      const next = new Set(prev);
      if (next.has(chunkId)) {
        next.delete(chunkId);
      } else {
        next.add(chunkId);
      }
      return next;
    });
  };

  const formatScore = (score: number) => {
    return (score * 100).toFixed(1);
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
                  Retrieval Test
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Test document retrieval without LLM. See which chunks match your query and their similarity scores.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6">
            {/* Search Input */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Search Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* KB ID Selector (Dev Mode Only) */}
                  {import.meta.env.DEV && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Knowledge Base ID
                      </label>
                      <input
                        type="text"
                        value={kbId}
                        onChange={(e) => setKbId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="default"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !loading && query.trim() && handleSearch()}
                        placeholder="Enter your search query..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        disabled={loading}
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={loading || !query.trim()}
                      className="btn-modern"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Example Queries */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Try these example queries:</p>
                    <div className="flex flex-wrap gap-2">
                      {exampleQueries.map((example, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setQuery(example);
                            if (!loading) {
                              setTimeout(() => handleSearch(), 100);
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                          disabled={loading}
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <CardTitle>Retrieval Results</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                      <div className="flex items-center gap-2 group relative">
                        <span>Confidence:</span>
                        <span className={`font-semibold ${
                          results.confidence >= 0.7 ? 'text-green-600' :
                          results.confidence >= 0.5 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {formatScore(results.confidence)}%
                        </span>
                        <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Average similarity score of all retrieved chunks. Higher = better match.
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Results:</span>
                        <span className="font-semibold">{results.results.length}</span>
                      </div>
                      {results.has_relevant_results && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Relevant</span>
                        </div>
                      )}
                      {results.confidence < 0.5 && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Low Confidence</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {results.results.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-500 mb-4">
                        Try a different query or upload documents to your knowledge base.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuery('');
                          setResults(null);
                        }}
                        className="mt-2"
                      >
                        Clear & Try Again
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.results.map((result: RetrievalResult, index: number) => {
                        const isExpanded = expandedChunks.has(result.chunk_id);
                        const previewLength = 200;
                        const showPreview = result.content.length > previewLength;

                        return (
                          <div
                            key={result.chunk_id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="flex items-center gap-2 px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm font-medium">
                                    #{index + 1}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FileText className="h-4 w-4" />
                                    <span className="font-medium">
                                      {result.metadata?.file_name || 'Unknown'}
                                    </span>
                                    {result.metadata?.page_number && (
                                      <span className="text-gray-500">
                                        • Page {result.metadata.page_number}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-gray-500">Similarity:</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary-600 transition-all"
                                        style={{ width: `${result.similarity_score * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">
                                      {formatScore(result.similarity_score)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {isExpanded || !showPreview
                                  ? result.content
                                  : `${result.content.substring(0, previewLength)}...`}
                              </p>
                              {showPreview && (
                                <button
                                  onClick={() => toggleExpand(result.chunk_id)}
                                  className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="h-4 w-4" />
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-4 w-4" />
                                      Show More
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="text-xs text-gray-500">
                                Chunk ID: <code className="bg-gray-100 px-1 rounded">{result.chunk_id}</code>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            {!results && !loading && (
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary-600" />
                    About Retrieval Testing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      <strong>What is this?</strong> This tool tests document retrieval without generating AI answers. 
                      It shows you which chunks from your knowledge base match your query and their similarity scores.
                    </p>
                    <p>
                      <strong>Why use it?</strong> Perfect for debugging and understanding how your knowledge base 
                      responds to different queries before using the full chat interface.
                    </p>
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="font-medium mb-2">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Upload documents first in the Knowledge Base page</li>
                        <li>Try specific queries related to your uploaded content</li>
                        <li>Higher similarity scores (above 0.7) indicate better matches</li>
                        <li>Use this to verify your documents are being indexed correctly</li>
                        <li><strong>Low confidence?</strong> Try more specific queries or upload more relevant documents</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TenantLayout>
  );
};

export default RetrievalTestPage;

