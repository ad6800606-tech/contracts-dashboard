import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

// Auth State
const initialAuthState = {
  user: null,
  token: null,
  loading: true,
  error: null,
  isAuthenticated: false
};

// Action Types
const AuthActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case AuthActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AuthActionTypes.LOGOUT:
      return {
        ...initialAuthState,
        loading: false
      };
    
    case AuthActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Actions
  const login = async (username, password) => {
    try {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
      dispatch({ type: AuthActionTypes.CLEAR_ERROR });

      const response = await authService.login(username, password);
      
      if (response.success) {
        // Store in localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        dispatch({ 
          type: AuthActionTypes.LOGIN_SUCCESS, 
          payload: { user: response.user, token: response.token }
        });
        
        return { success: true };
      } else {
        dispatch({ type: AuthActionTypes.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({ type: AuthActionTypes.SET_ERROR, payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    dispatch({ type: AuthActionTypes.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  // Check for existing authentication on mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch({ 
            type: AuthActionTypes.LOGIN_SUCCESS, 
            payload: { user, token }
          });
        } catch (error) {
          // Invalid stored data, clear it
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
        }
      } else {
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  const value = {
    ...state,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use Auth Context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};