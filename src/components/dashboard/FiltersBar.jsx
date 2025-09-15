import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { FILTER_OPTIONS } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';

const FiltersBar = ({ 
  filters = {},
  onFiltersChange,
  onSearch,
  showAdvanced = true,
  placeholder = "Search contracts by name or parties...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: filters.startDate || '',
    endDate: filters.endDate || ''
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update search when debounced term changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    } else if (onFiltersChange) {
      onFiltersChange({ ...filters, search: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm]);

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    onFiltersChange?.(newFilters);
  };

  const handleDateRangeChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    
    const newFilters = { 
      ...filters, 
      startDate: newDateRange.startDate,
      endDate: newDateRange.endDate
    };
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDateRange({ startDate: '', endDate: '' });
    const clearedFilters = {
      search: '',
      status: 'all',
      risk: 'all',
      startDate: '',
      endDate: ''
    };
    onFiltersChange?.(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.risk && filters.risk !== 'all') count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    return count;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Expired':
        return <X className="w-4 h-4 text-red-600" />;
      case 'Renewal Due':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return null;
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
        return null;
    }
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4">
        {/* Main Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={filters.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                {FILTER_OPTIONS.STATUS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Risk Filter */}
            <div className="relative">
              <select
                value={filters.risk || 'all'}
                onChange={(e) => handleFilterChange('risk', e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                {FILTER_OPTIONS.RISK.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Advanced Filters Toggle */}
            {showAdvanced && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg transition-colors text-sm ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Advanced</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            )}

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Clear all filters"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-scale-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date From
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date To
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Additional Status Filter with Icons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Status
                </label>
                <div className="relative">
                  <select
                    value={filters.status || 'all'}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    {FILTER_OPTIONS.STATUS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Additional Risk Filter with Icons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Assessment
                </label>
                <div className="relative">
                  <select
                    value={filters.risk || 'all'}
                    onChange={(e) => handleFilterChange('risk', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    {FILTER_OPTIONS.RISK.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Search: "{filters.search}"
                      <button
                        onClick={() => handleFilterChange('search', '')}
                        className="ml-1 p-0.5 hover:bg-blue-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.status && filters.status !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {getStatusIcon(filters.status)}
                      Status: {filters.status}
                      <button
                        onClick={() => handleFilterChange('status', 'all')}
                        className="ml-1 p-0.5 hover:bg-green-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.risk && filters.risk !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {getRiskIcon(filters.risk)}
                      Risk: {filters.risk}
                      <button
                        onClick={() => handleFilterChange('risk', 'all')}
                        className="ml-1 p-0.5 hover:bg-orange-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.startDate && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      From: {filters.startDate}
                      <button
                        onClick={() => handleDateRangeChange('startDate', '')}
                        className="ml-1 p-0.5 hover:bg-purple-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {filters.endDate && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      To: {filters.endDate}
                      <button
                        onClick={() => handleDateRangeChange('endDate', '')}
                        className="ml-1 p-0.5 hover:bg-purple-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Filter Chips (Alternative compact view) */}
        {!showFilters && activeFiltersCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                <Search className="w-3 h-3" />
                "{filters.search}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 p-0.5 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.status && filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {getStatusIcon(filters.status)}
                {filters.status}
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className="ml-1 p-0.5 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.risk && filters.risk !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {getRiskIcon(filters.risk)}
                {filters.risk} Risk
                <button
                  onClick={() => handleFilterChange('risk', 'all')}
                  className="ml-1 p-0.5 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {filters.totalResults !== undefined && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-sm text-gray-600">
            {filters.totalResults === 0 ? (
              "No contracts found matching your criteria"
            ) : filters.totalResults === 1 ? (
              "1 contract found"
            ) : (
              `${filters.totalResults} contracts found`
            )}
            {activeFiltersCount > 0 && (
              <span className="ml-2">
                ({activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied)
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default FiltersBar;