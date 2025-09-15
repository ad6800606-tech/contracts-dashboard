import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized setFilters to prevent recreation on every render
  const memoizedSetFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  // Update search filter when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== filters?.search) {
      memoizedSetFilters({ search: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm, filters?.search, memoizedSetFilters]);

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    if (!allContracts || !Array.isArray(allContracts) || allContracts.length === 0) {
      return { total: 0, active: 0, expiring: 0, highRisk: 0 };
    }
    
    return {
      total: allContracts.length,
      active: allContracts.filter(c => c?.status === 'Active').length,
      expiring: allContracts.filter(c => c?.status === 'Renewal Due').length,
      highRisk: allContracts.filter(c => c?.risk === 'High').length
    };
  }, [allContracts]);

  const handleRefresh = useCallback(() => {
    fetchContracts(filters);
  }, [fetchContracts, filters]);

  const handleViewContract = useCallback((contract) => {
    if (contract?.id) {
      fetchContractDetails(contract.id);
      setCurrentPage('contract-detail');
    }
  }, [fetchContractDetails, setCurrentPage]);

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters({ [filterType]: value });
  }, [setFilters]);

  const handlePageChange = useCallback((newPage) => {
    setPagination({ currentPage: newPage });
  }, [setPagination]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({ search: '', status: 'all', risk: 'all' });
  }, [setFilters]);

  // Get page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const totalPages = pagination?.totalPages || 0;
    const current = pagination?.currentPage || 1;
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
  }, [pagination]);

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
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

  const ContractCard = ({ contract }) => {
    if (!contract) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{contract.name || 'Untitled Contract'}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Users className="w-4 h-4" />
              <span>{formatters?.text?.parties ? formatters.text.parties(contract.parties) : contract.parties || 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters?.status?.getStatusColor ? formatters.status.getStatusColor(contract.status) : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
              {contract.status || 'Unknown'}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters?.status?.getRiskColor ? formatters.status.getRiskColor(contract.risk) : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
              {contract.risk || 'Unknown'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Expires {formatters?.date?.display ? formatters.date.display(contract.expiry) : contract.expiry || 'N/A'}</span>
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
  };

  const ContractTableRow = ({ contract }) => {
    if (!contract) return null;
    
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div>
            <div className="text-sm font-medium text-gray-900">{contract.name || 'Untitled Contract'}</div>
            <div className="text-sm text-gray-500">{formatters?.text?.parties ? formatters.text.parties(contract.parties) : contract.parties || 'N/A'}</div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {formatters?.date?.display ? formatters.date.display(contract.expiry) : contract.expiry || 'N/A'}
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters?.status?.getStatusColor ? formatters.status.getStatusColor(contract.status) : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
            {contract.status || 'Unknown'}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters?.status?.getRiskColor ? formatters.status.getRiskColor(contract.risk) : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
            {contract.risk || 'Unknown'}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewContract(contract)}
              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
            >
              View
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  if (loading && (!contracts || contracts.length === 0)) {
    return (
      <div className="p-6">
        <Loading size="lg" text="Loading contracts..." />
      </div>
    );
  }

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

  const displayContracts = contracts || [];
  const hasContracts = displayContracts.length > 0;
  const hasFilters = (filters?.search && filters.search !== '') || 
                    (filters?.status && filters.status !== 'all') || 
                    (filters?.risk && filters.risk !== 'all');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts Dashboard</h1>
          <p className="text-gray-600">Manage and monitor your contract portfolio</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters?.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {FILTER_OPTIONS?.STATUS?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  )) || <option value="all">All Status</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                <select
                  value={filters?.risk || 'all'}
                  onChange={(e) => handleFilterChange('risk', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {FILTER_OPTIONS?.RISK?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  )) || <option value="all">All Risk Levels</option>}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contracts Content */}
      {!hasContracts ? (
        <EmptyState
          type="contracts"
          title={hasFilters ? "No contracts match your filters" : "No contracts yet"}
          description={hasFilters ? "Try adjusting your search or filter criteria." : "Upload your first contract to get started."}
          actionText={hasFilters ? "Clear Filters" : "Upload Contract"}
          onAction={hasFilters ? clearFilters : () => toggleModal('upload')}
        />
      ) : (
        <>
          {/* Contracts List/Grid */}
          {viewMode === 'table' ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contract
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiry Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayContracts.map((contract, index) => (
                      <ContractTableRow key={contract?.id || index} contract={contract} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayContracts.map((contract, index) => (
                <ContractCard key={contract?.id || index} contract={contract} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-3 border border-gray-200 rounded-lg">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} results
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                      disabled={typeof page !== 'number'}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        page === pagination.currentPage
                          ? 'bg-blue-600 text-white'
                          : typeof page === 'number'
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-400 cursor-default'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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