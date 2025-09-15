import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  AlertTriangle, 
  Shield, 
  FileText, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Download,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatters } from '../../utils/formatters';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';

const ContractDetailPage = () => {
  const { 
    selectedContract, 
    loading, 
    error, 
    setCurrentPage, 
    fetchContractDetails,
    toggleModal 
  } = useApp();
  
  const [evidencePanelOpen, setEvidencePanelOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  // Mock contract ID for demonstration - in real app this would come from URL params
  const contractId = selectedContract?.id || 'c1';

  useEffect(() => {
    if (!selectedContract || selectedContract.id !== contractId) {
      fetchContractDetails(contractId);
    }
  }, [contractId, selectedContract, fetchContractDetails]);

  const handleBack = () => {
    setCurrentPage('dashboard');
  };

  const handleViewEvidence = (evidence) => {
    setSelectedEvidence(evidence);
    setEvidencePanelOpen(true);
  };

  const handleCloseEvidence = () => {
    setEvidencePanelOpen(false);
    setSelectedEvidence(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Expired':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Renewal Due':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'High':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Medium':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Low':
        return <Shield className="w-4 h-4 text-green-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading size="lg" text="Loading contract details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          type="error"
          title="Failed to load contract"
          description={error}
          actionText="Go Back"
          onAction={handleBack}
        />
      </div>
    );
  }

  if (!selectedContract) {
    return (
      <div className="p-6">
        <EmptyState
          type="contracts"
          title="Contract not found"
          description="The requested contract could not be found."
          actionText="Go Back"
          onAction={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">{selectedContract.name}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Contract Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contract Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Parties</span>
                </div>
                <p className="text-gray-900">{formatters.text.parties(selectedContract.parties)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Duration</span>
                </div>
                <p className="text-gray-900">
                  {formatters.date.display(selectedContract.start)} - {formatters.date.display(selectedContract.expiry)}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(selectedContract.status)}
                  <span className="text-sm font-medium text-gray-700">Status</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters.status.getStatusColor(selectedContract.status)}`}>
                  {selectedContract.status}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getRiskIcon(selectedContract.risk)}
                  <span className="text-sm font-medium text-gray-700">Risk Level</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters.status.getRiskColor(selectedContract.risk)}`}>
                  {selectedContract.risk} Risk
                </span>
              </div>
            </div>

            {selectedContract.expiry && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Time to Expiry</span>
                </div>
                <p className="mt-1 text-gray-900">{formatters.date.timeUntilExpiry(selectedContract.expiry)}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => toggleModal('upload')}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                Upload Amendment
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" />
                View Original Document
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Calendar className="w-4 h-4" />
                Set Renewal Reminder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Clauses Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Contract Clauses</h2>
              <p className="text-sm text-gray-600 mt-1">Key clauses identified by AI analysis</p>
            </div>
            <div className="p-6">
              {selectedContract.clauses && selectedContract.clauses.length > 0 ? (
                <div className="space-y-4">
                  {selectedContract.clauses.map((clause, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{clause.title}</h3>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-500">
                            Confidence: {formatters.number.confidence(clause.confidence)}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${clause.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{clause.summary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  type="insights"
                  title="No clauses identified"
                  description="No clauses have been identified for this contract yet."
                  className="py-8"
                />
              )}
            </div>
          </div>

          {/* Evidence Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Supporting Evidence</h2>
              <p className="text-sm text-gray-600 mt-1">Document sections that support the analysis</p>
            </div>
            <div className="p-6">
              {selectedContract.evidence && selectedContract.evidence.length > 0 ? (
                <div className="space-y-3">
                  {selectedContract.evidence.map((evidence, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{evidence.source}</span>
                          <div className="flex items-center gap-1">
                            <div className="text-xs text-gray-500">
                              {formatters.number.confidence(evidence.relevance)} relevant
                            </div>
                            <div className="w-12 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-green-500 h-1.5 rounded-full" 
                                style={{ width: `${evidence.relevance * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewEvidence(evidence)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{evidence.snippet}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  type="insights"
                  title="No evidence available"
                  description="No supporting evidence has been identified for this contract yet."
                  className="py-8"
                />
              )}
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">AI Risk Insights</h2>
              <p className="text-sm text-gray-600 mt-1">Potential risks and recommendations</p>
            </div>
            <div className="p-6">
              {selectedContract.insights && selectedContract.insights.length > 0 ? (
                <div className="space-y-4">
                  {selectedContract.insights.map((insight, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 ${formatters.status.getInsightColor(insight.risk)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getRiskIcon(insight.risk)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${formatters.status.getRiskColor(insight.risk)}`}>
                              {insight.risk} Risk
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">{insight.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  type="insights"
                  title="No insights available"
                  description="No AI insights have been generated for this contract yet."
                  className="py-8"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Panel */}
      {evidencePanelOpen && selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Evidence Details</h3>
              <button
                onClick={handleCloseEvidence}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Source:</span>
                  <span className="text-sm text-gray-900">{selectedEvidence.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Relevance:</span>
                  <span className="text-sm text-gray-900">
                    {formatters.number.confidence(selectedEvidence.relevance)}
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${selectedEvidence.relevance * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Document Excerpt</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedEvidence.snippet}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetailPage;