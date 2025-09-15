import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  RefreshCw,
  BarChart3,
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useDebounce } from '../../hooks/useDebounce';
import { formatters } from '../../utils/formatters';
import { FILTER_OPTIONS } from '../../utils/constants';
import Loading, { SkeletonCard, SkeletonTableRow } from '../common/Loading';
import EmptyState from '../common/EmptyState';

const ContractsDashboard = () => {
  const { 
    contracts,
    allContracts,
    loading, 
    error, 
    filters,
    pagination,
    fetchContracts,
    setFilters,
    setPagination,
    setCurrentPage,
    fetchContractDetails,
    toggleModal
  } = useApp();

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update search filter when debounced search term changes
  useEffect(() => {
    setFilters({ search: debouncedSearchTerm });
  }, [debouncedSearchTerm, setFilters]);

  // Calculate dashboard statistics
  const stats = React.useMemo(() => {
    if (!allContracts.length) return { total: 0, active: 0, expiring: 0, highRisk: 0 };
    
    return {
      total: allContracts.length,
      active: allContracts.filter(c => c.status === 'Active').length,
      expiring: allContracts.filter(c => c.status === 'Renewal Due').length,
      highRisk: allContracts.filter(c => c.risk === 'High').length
    };
  }, [allContracts]);

  const handleRefresh = () => {
    fetchContracts(filters);
  };

  const handleViewContract = (contract) => {
    fetchContractDetails(contract.id);
    setCurrentPage('contract-detail');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ [filterType]: value });
  };

  const handlePageChange = (newPage) => {
    setPagination({ currentPage: newPage });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ search: '', status: 'all', risk: 'all' });
  };

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const current = pagination.currentPage;
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ContractCard = ({ contract }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{contract.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Users className="w-4 h-4" />
            <span>{formatters.text.parties(contract.parties)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters.status.getStatusColor(contract.status)}`}>
            {contract.status}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters.status.getRiskColor(contract.risk)}`}>
            {contract.risk}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Expires {formatters.date.display(contract.expiry)}</span>
        </div>
        <button
          onClick={() => handleViewContract(contract)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );

  const ContractTableRow = ({ contract }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900">{contract.name}</div>
          <div className="text-sm text-gray-500">{formatters.text.parties(contract.parties)}</div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {formatters.date.display(contract.expiry)}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters.status.getStatusColor(contract.status)}`}>
          {contract.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters.status.getRiskColor(contract.risk)}`}>
          {contract.risk}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewContract(contract)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="More Actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          type="error"
          title="Failed to load contracts"
          description={error}
          actionText="Try Again"
          onAction={handleRefresh}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and analyze your contract portfolio</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={() => toggleModal('upload')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload Contract
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Contracts"
          value={stats.total}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Active Contracts"
          value={stats.active}
          icon={BarChart3}
          color="green"
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiring}
          icon={Calendar}
          color="orange"
        />
        <StatCard
          title="High Risk"
          value={stats.highRisk}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts by name or parties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {FILTER_OPTIONS.STATUS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                <select
                  value={filters.risk || 'all'}
                  onChange={(e) => handleFilterChange('risk', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {FILTER_OPTIONS.RISK.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contracts Display */}
      {loading && !contracts.length ? (
        <div className="space-y-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonTableRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : contracts.length === 0 ? (
        <EmptyState
          type={filters.search || filters.status !== 'all' || filters.risk !== 'all' ? 'search' : 'contracts'}
          title={filters.search || filters.status !== 'all' || filters.risk !== 'all' ? 'No contracts found' : 'No contracts yet'}
          description={filters.search || filters.status !== 'all' || filters.risk !== 'all' ? 'Try adjusting your search or filters.' : 'Get started by uploading your first contract.'}
          actionText={filters.search || filters.status !== 'all' || filters.risk !== 'all' ? 'Clear Filters' : 'Upload Contract'}
          onAction={filters.search || filters.status !== 'all' || filters.risk !== 'all' ? clearFilters : () => toggleModal('upload')}
        />
      ) : (
        <>
          {/* Results Info */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} contracts
            </p>
            
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Updating...
              </div>
            )}
          </div>

          {/* Contracts Grid/Table */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {contracts.map(contract => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract & Parties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map(contract => (
                    <ContractTableRow key={contract.id} contract={contract} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Page</span>
                <span className="text-sm font-medium text-gray-900">
                  {pagination.currentPage} of {pagination.totalPages}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                      disabled={page === '...'}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        page === pagination.currentPage
                          ? 'bg-blue-600 text-white'
                          : page === '...'
                          ? 'text-gray-400 cursor-default'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContractsDashboard;