// src/utils/formatters.js (Complete file)
import { APP_CONSTANTS } from './constants';
import { helpers } from './helpers';

// Date and number formatting utilities
export const formatters = {
  // Date formatting
  date: {
    // Format date for display (e.g., "Jan 15, 2024")
    display: (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    // Format date for API (e.g., "2024-01-15")
    api: (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    },

    // Format full date with time (e.g., "January 15, 2024 at 2:30 PM")
    full: (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    },

    // Relative time (e.g., "2 days ago", "in 3 months")
    relative: (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = date - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === -1) return 'Yesterday';
      if (diffDays > 0) return `In ${diffDays} days`;
      return `${Math.abs(diffDays)} days ago`;
    },

    // Get time until expiry
    timeUntilExpiry: (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = date - now;
      
      if (diffMs < 0) return 'Expired';
      
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 30) return `${diffDays} days left`;
      if (diffDays <= 365) {
        const months = Math.ceil(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''} left`;
      }
      
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} left`;
    }
  },

  // Number formatting
  number: {
    // Format with commas (e.g., "1,234")
    withCommas: (num) => {
      if (num == null) return '';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // Format as currency (e.g., "$1,234.56")
    currency: (amount, currency = 'USD') => {
      if (amount == null) return '';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    },

    // Format as percentage (e.g., "25.5%")
    percentage: (value, decimals = 1) => {
      if (value == null) return '';
      return `${(value * 100).toFixed(decimals)}%`;
    },

    // Format file size
    fileSize: (bytes) => {
      return helpers.formatBytes(bytes);
    },

    // Format confidence score
    confidence: (score) => {
      if (score == null) return '';
      return `${Math.round(score * 100)}%`;
    }
  },

  // Text formatting
  text: {
    // Capitalize words
    titleCase: (str) => {
      if (!str) return '';
      return str.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    },

    // Convert camelCase to readable text
    camelToWords: (str) => {
      if (!str) return '';
      return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    },

    // Truncate with ellipsis
    truncate: (str, maxLength = 50) => {
      return helpers.truncate(str, maxLength);
    },

    // Format contract parties
    parties: (partiesString) => {
      if (!partiesString) return '';
      return partiesString.replace(' & ', ' • ');
    }
  },

  // Risk and status formatting
  status: {
    // Get status color class
    getStatusColor: (status) => {
      const statusColors = {
        'Active': 'bg-green-100 text-green-800 border-green-200',
        'Expired': 'bg-red-100 text-red-800 border-red-200',
        'Renewal Due': 'bg-orange-100 text-orange-800 border-orange-200',
        'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
        'Terminated': 'bg-red-100 text-red-800 border-red-200',
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Cancelled': 'bg-gray-100 text-gray-800 border-gray-200'
      };
      return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    },

    // Get risk color class
    getRiskColor: (risk) => {
      const riskColors = {
        'High': 'bg-red-100 text-red-800 border-red-200',
        'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Low': 'bg-green-100 text-green-800 border-green-200'
      };
      return riskColors[risk] || 'bg-gray-100 text-gray-800 border-gray-200';
    },

    // Get insight background color
    getInsightColor: (risk) => {
      const insightColors = {
        'High': 'border-red-200 bg-red-50',
        'Medium': 'border-yellow-200 bg-yellow-50',
        'Low': 'border-green-200 bg-green-50'
      };
      return insightColors[risk] || 'border-gray-200 bg-gray-50';
    },

    // Get risk icon color
    getRiskIconColor: (risk) => {
      const iconColors = {
        'High': 'text-red-600',
        'Medium': 'text-yellow-600',
        'Low': 'text-green-600'
      };
      return iconColors[risk] || 'text-gray-600';
    },

    // Get status badge variant
    getStatusBadgeVariant: (status) => {
      const variants = {
        'Active': 'success',
        'Expired': 'danger',
        'Renewal Due': 'warning',
        'Draft': 'secondary',
        'Terminated': 'danger',
        'Pending': 'warning',
        'Cancelled': 'secondary'
      };
      return variants[status] || 'secondary';
    },

    // Get risk badge variant
    getRiskBadgeVariant: (risk) => {
      const variants = {
        'High': 'danger',
        'Medium': 'warning',
        'Low': 'success'
      };
      return variants[risk] || 'secondary';
    }
  }
};

// Export specific formatters for convenience
export const { date, number, text, status } = formatters;

// Additional utility functions
export const formatDate = formatters.date.display;
export const formatCurrency = formatters.number.currency;
export const formatPercentage = formatters.number.percentage;
export const getStatusColor = formatters.status.getStatusColor;
export const getRiskColor = formatters.status.getRiskColor;