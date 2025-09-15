import React, { useState } from 'react';
import { 
  Eye, 
  MoreHorizontal, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Download,
  Edit3,
  Trash2,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { formatters } from '../../utils/formatters';
import { SkeletonTableRow } from '../common/Loading';
import EmptyState from '../common/EmptyState';

const ContractsTable = ({ 
  contracts = [], 
  loading = false, 
  onViewContract, 
  onEditContract,
  onDeleteContract,
  onDownloadContract,
  pagination,
  onSort,
  sortConfig = { key: null, direction: 'asc' }
}) => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  const handleSort = (columnKey) => {
    if (onSort) {
      const direction = sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      onSort(columnKey, direction);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Expired':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Renewal Due':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'High':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'Low':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleActionClick = (contractId, action) => {
    setActionMenuOpen(null);
    
    switch (action) {
      case 'view':
        onViewContract?.(contractId);
        break;
      case 'edit':
        onEditContract?.(contractId);
        break;
      case 'download':
        onDownloadContract?.(contractId);
        break;
      case 'delete':
        onDeleteContract?.(contractId);
        break;
      default:
        break;
    }
  };

  const ActionMenu = ({ contract }) => (
    <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
      <button
        onClick={() => handleActionClick(contract, 'view')}
        className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Eye className="w-4 h-4" />
        View Details
      </button>
      
      {onEditContract && (
        <button
          onClick={() => handleActionClick(contract, 'edit')}
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Edit Contract
        </button>
      )}
      
      {onDownloadContract && (
        <button
          onClick={() => handleActionClick(contract, 'download')}
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      )}
      
      <div className="border-t border-gray-100 my-1" />
      
      {onDeleteContract && (
        <button
          onClick={() => handleActionClick(contract, 'delete')}
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Contract
        </button>
      )}
    </div>
  );

  if (loading && contracts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
            {[...Array(5)].map((_, i) => (
              <SkeletonTableRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <EmptyState
          type="contracts"
          title="No contracts found"
          description="No contracts match the current filters. Try adjusting your search criteria."
          className="py-8"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Contract & Parties
                  {getSortIcon('name')}
                </div>
              </th>
              
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('expiry')}
              >
                <div className="flex items-center gap-2">
                  Expiry Date
                  {getSortIcon('expiry')}
                </div>
              </th>
              
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('risk')}
              >
                <div className="flex items-center gap-2">
                  Risk Level
                  {getSortIcon('risk')}
                </div>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {contracts.map((contract) => (
              <tr 
                key={contract.id} 
                className="hover:bg-gray-50 transition-colors group"
              >
                {/* Contract & Parties */}
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {contract.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {contract.name}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <Users className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{formatters.text.parties(contract.parties)}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Expiry Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-900">
                        {formatters.date.display(contract.expiry)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatters.date.timeUntilExpiry(contract.expiry)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(contract.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters.status.getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </div>
                </td>

                {/* Risk Level */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(contract.risk)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${formatters.status.getRiskColor(contract.risk)}`}>
                      {contract.risk} Risk
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewContract?.(contract)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === contract.id ? null : contract.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {actionMenuOpen === contract.id && (
                        <ActionMenu contract={contract} />
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination Info */}
      {pagination && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} contracts
            </div>
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close action menu */}
      {actionMenuOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActionMenuOpen(null)}
        />
      )}
    </div>
  );
};

export default ContractsTable;