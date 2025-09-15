import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return {
    user: context.user,
    token: context.token,
    loading: context.loading,
    error: context.error,
    isAuthenticated: context.isAuthenticated,
    login: context.login,
    logout: context.logout,
    clearError: context.clearError
  };
};