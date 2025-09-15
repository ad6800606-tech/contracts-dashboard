import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic API request handler
  const apiRequest = useCallback(async (requestFn, options = {}) => {
    const { 
      showLoading = true, 
      onSuccess, 
      onError,
      successMessage,
      errorMessage 
    } = options;

    try {
      if (showLoading) setLoading(true);
      setError(null);

      const response = await requestFn();

      if (onSuccess) onSuccess(response);
      if (successMessage) {
        // You can integrate with a toast notification system here
        console.log(successMessage);
      }

      return { success: true, data: response };
    } catch (err) {
      const errorMsg = errorMessage || err.message || 'An error occurred';
      setError(errorMsg);
      
      if (onError) onError(err);
      
      return { success: false, error: errorMsg };
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // GET request
  const get = useCallback((url, options = {}) => {
    return apiRequest(() => api.get(url), options);
  }, [apiRequest]);

  // POST request
  const post = useCallback((url, data, options = {}) => {
    return apiRequest(() => api.post(url, data), options);
  }, [apiRequest]);

  // PUT request
  const put = useCallback((url, data, options = {}) => {
    return apiRequest(() => api.put(url, data), options);
  }, [apiRequest]);

  // PATCH request
  const patch = useCallback((url, data, options = {}) => {
    return apiRequest(() => api.patch(url, data), options);
  }, [apiRequest]);

  // DELETE request
  const del = useCallback((url, options = {}) => {
    return apiRequest(() => api.delete(url), options);
  }, [apiRequest]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError,
    apiRequest
  };
};