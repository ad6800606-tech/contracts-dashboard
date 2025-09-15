import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { contractsService } from '../services/contracts.service';

const AppContext = createContext();

// App State
const initialState = {
  contracts: [],
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
    totalItems: 0
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
      return { 
        ...state, 
        contracts: action.payload,
        pagination: {
          ...state.pagination,
          totalItems: action.payload.length
        },
        loading: false,
        error: null
      };
    
    case ActionTypes.SET_SELECTED_CONTRACT:
      return { ...state, selectedContract: action.payload, loading: false };
    
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

  // Actions
  const actions = {
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    
    setCurrentPage: (page) => dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: page }),
    
    setFilters: (filters) => dispatch({ type: ActionTypes.SET_FILTERS, payload: filters }),
    
    setPagination: (pagination) => dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination }),
    
    toggleModal: (modal) => dispatch({ type: ActionTypes.TOGGLE_MODAL, payload: modal }),
    
    toggleUIElement: (element) => dispatch({ type: ActionTypes.TOGGLE_UI_ELEMENT, payload: element }),

    // Async Actions
    fetchContracts: async (filters = {}) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const contracts = await contractsService.getContracts(filters);
        dispatch({ type: ActionTypes.SET_CONTRACTS, payload: contracts });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      }
    },

    fetchContractDetails: async (id) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const contract = await contractsService.getContractById(id);
        dispatch({ type: ActionTypes.SET_SELECTED_CONTRACT, payload: contract });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      }
    },

    uploadFiles: async (files) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Refresh contracts after upload
        actions.fetchContracts(state.filters);
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      }
    }
  };

  // Load initial data
  useEffect(() => {
    actions.fetchContracts();
  }, []);

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
