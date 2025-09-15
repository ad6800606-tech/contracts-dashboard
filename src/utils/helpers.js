import { APP_CONSTANTS } from './constants';

// Generic helper functions
export const helpers = {
  // Delay function for testing
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Generate unique ID
  generateId: () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Deep clone object
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => helpers.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = helpers.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  },

  // Check if object is empty
  isEmpty: (obj) => {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    return Object.keys(obj).length === 0;
  },

  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Convert string to slug
  slugify: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Truncate text
  truncate: (str, length = 100, suffix = '...') => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  // Get initials from name
  getInitials: (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },

  // Sort array of objects by key
  sortBy: (array, key, direction = 'asc') => {
    return array.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Group array by key
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const groupKey = item[key];
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {});
  },

  // Calculate percentage
  percentage: (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  },

  // Check if date is expired
  isExpired: (dateString) => {
    const date = new Date(dateString);
    return date < new Date();
  },

  // Check if date is expiring soon (within 30 days)
  isExpiringSoon: (dateString, days = 30) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days && diffDays > 0;
  },

  // Validate email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate file type
  isValidFileType: (fileName) => {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    return APP_CONSTANTS.ALLOWED_FILE_TYPES.includes(extension);
  },

  // Convert bytes to human readable format
  formatBytes: (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  // Get random color from predefined set
  getRandomColor: () => {
    const colors = Object.values(APP_CONSTANTS.COLORS);
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // Check if user agent is mobile
  isMobile: () => {
    return window.innerWidth < APP_CONSTANTS.MOBILE_BREAKPOINT;
  }
};