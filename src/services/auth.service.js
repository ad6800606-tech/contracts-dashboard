import { api } from './api';

export const authService = {
  // Mock login function
  async login(username, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    if (password === 'test123') {
      const user = {
        id: '1',
        username,
        email: `${username}@company.com`,
        firstName: username.split(' ')[0] || username,
        lastName: username.split(' ')[1] || '',
        role: 'admin',
        avatar: null,
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true
        }
      };

      const token = `mock-jwt-token-${Date.now()}`;

      return {
        success: true,
        user,
        token,
        expiresIn: 3600 // 1 hour
      };
    } else {
      return {
        success: false,
        message: 'Invalid credentials. Please use password: test123'
      };
    }
  },

  // Mock logout function
  async logout() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  },

  // Mock token refresh
  async refreshToken() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      token: `refreshed-${token}`,
      expiresIn: 3600
    };
  },

  // Mock user profile fetch
  async getProfile() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('No user found');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      user: JSON.parse(userStr)
    };
  },

  // Mock password change
  async changePassword(currentPassword, newPassword) {
    if (currentPassword !== 'test123') {
      throw new Error('Current password is incorrect');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Password changed successfully'
    };
  }
};