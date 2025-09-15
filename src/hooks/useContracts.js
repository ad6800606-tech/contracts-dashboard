import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const useContracts = () => {
  const { 
    contracts, 
    loading, 
    error, 
    filters, 
    pagination,
    fetchContracts,
    setFilters,
    setPagination
  } = useApp();

  // Memoized filtered and paginated contracts
  const filteredContracts = useMemo(() => {
    let filtered = contracts;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(contract => 
        contract.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        contract.parties.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(contract => contract.status === filters.status);
    }

    // Apply risk filter
    if (filters.risk && filters.risk !== 'all') {
      filtered = filtered.filter(contract => contract.risk === filters.risk);
    }

    return filtered;
  }, [contracts, filters]);

  // Paginated contracts
  const paginatedContracts = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return filteredContracts.slice(startIndex, startIndex + pagination.itemsPerPage);
  }, [filteredContracts, pagination]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredContracts.length / pagination.itemsPerPage);

  // Update search filter
  const updateSearch = (searchTerm) => {
    setFilters({ search: searchTerm });
  };

  // Update status filter
  const updateStatusFilter = (status) => {
    setFilters({ status });
  };

  // Update risk filter
  const updateRiskFilter = (risk) => {
    setFilters({ risk });
  };

  // Navigate to page
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPagination({ currentPage: pageNumber });
    }
  };

  // Refresh contracts
  const refreshContracts = () => {
    fetchContracts(filters);
  };

  return {
    contracts: paginatedContracts,
    allContracts: contracts,
    filteredContracts,
    loading,
    error,
    filters,
    pagination: {
      ...pagination,
      totalPages,
      totalItems: filteredContracts.length
    },
    updateSearch,
    updateStatusFilter,
    updateRiskFilter,
    goToPage,
    refreshContracts
  };
};