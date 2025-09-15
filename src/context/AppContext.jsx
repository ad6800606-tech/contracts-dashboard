import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { contractsService } from '../services/contracts.service';

const AppContext = createContext();

// App State
const initialState = {
  contracts: [],
  allContracts: [], // Add this missing property
  selectedContract: null,
  currentPage: 'dashboard',
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    risk: 'all'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  },
  modals: {
    upload: false,
    evidence: false
  },
  ui: {
    sidebarCollapsed: false,
    userDropdownOpen: false
  }
};

// Action Types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CONTRACTS: 'SET_CONTRACTS',
  SET_ALL_CONTRACTS: 'SET_ALL_CONTRACTS',
  SET_SELECTED_CONTRACT: 'SET_SELECTED_CONTRACT',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  TOGGLE_MODAL: 'TOGGLE_MODAL',
  TOGGLE_UI_ELEMENT: 'TOGGLE_UI_ELEMENT',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.SET_CONTRACTS:
      const filteredContracts = action.payload.filtered || action.payload;
      const allContracts = action.payload.all || action.payload;
      const totalPages = Math.ceil(filteredContracts.length / state.pagination.itemsPerPage);
      
      return { 
        ...state, 
        contracts: filteredContracts,
        allContracts: allContracts,
        pagination: {
          ...state.pagination,
          totalItems: filteredContracts.length,
          totalPages: totalPages
        },
        loading: false,
        error: null
      };
    
    case ActionTypes.SET_ALL_CONTRACTS:
      return { 
        ...state, 
        allContracts: action.payload,
        loading: false,
        error: null
      };
    
    case ActionTypes.SET_SELECTED_CONTRACT:
      return { ...state, selectedContract: action.payload, loading: false, error: null };
    
    case ActionTypes.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    
    case ActionTypes.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 }
      };
    
    case ActionTypes.SET_PAGINATION:
      return { 
        ...state, 
        pagination: { ...state.pagination, ...action.payload }
      };
    
    case ActionTypes.TOGGLE_MODAL:
      return {
        ...state,
        modals: { ...state.modals, [action.payload]: !state.modals[action.payload] }
      };
    
    case ActionTypes.TOGGLE_UI_ELEMENT:
      return {
        ...state,
        ui: { ...state.ui, [action.payload]: !state.ui[action.payload] }
      };
    
    case ActionTypes.RESET_STATE:
      return { ...initialState };
    
    default:
      return state;
  }
};

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Memoized actions to prevent unnecessary re-renders
  const actions = {
    setLoading: useCallback((loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    }, []),
    
    setError: useCallback((error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    }, []),
    
    setCurrentPage: useCallback((page) => {
      dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: page });
    }, []),
    
    setFilters: useCallback((filters) => {
      dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
    }, []),
    
    setPagination: useCallback((pagination) => {
      dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination });
    }, []),
    
    toggleModal: useCallback((modal) => {
      dispatch({ type: ActionTypes.TOGGLE_MODAL, payload: modal });
    }, []),
    
    toggleUIElement: useCallback((element) => {
      dispatch({ type: ActionTypes.TOGGLE_UI_ELEMENT, payload: element });
    }, []),

    // Async Actions
    fetchContracts: useCallback(async (filters = {}) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const contracts = await contractsService.getContracts(filters);
        
        // Store both all contracts and filtered contracts
        dispatch({ type: ActionTypes.SET_ALL_CONTRACTS, payload: contracts });
        dispatch({ type: ActionTypes.SET_CONTRACTS, payload: contracts });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message || 'Failed to fetch contracts' });
      }
    }, []),

    fetchContractDetails: useCallback(async (id) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const contract = await contractsService.getContractById(id);
        dispatch({ type: ActionTypes.SET_SELECTED_CONTRACT, payload: contract });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message || 'Failed to fetch contract details' });
      }
    }, []),

    uploadFiles: useCallback(async (files) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Refresh contracts after upload
        const contracts = await contractsService.getContracts(state.filters);
        dispatch({ type: ActionTypes.SET_CONTRACTS, payload: contracts });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message || 'Failed to upload files' });
      }
    }, [state.filters])
  };

  // Load initial data - only run once on mount
  useEffect(() => {
    actions.fetchContracts();
  }, []); // Remove actions dependency to prevent infinite loop

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use App Context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};