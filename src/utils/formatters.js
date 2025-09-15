// src/utils/formatters.js
export const formatters = {
  // Date formatting
  date: {
    display: (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return dateString;
      }
    },
    
    relative: (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          return `${Math.abs(diffDays)} days ago`;
        } else if (diffDays === 0) {
          return 'Today';
        } else if (diffDays === 1) {
          return 'Tomorrow';
        } else if (diffDays <= 30) {
          return `In ${diffDays} days`;
        } else {
          return formatters.date.display(dateString);
        }
      } catch (error) {
        return dateString;
      }
    },
    
    full: (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        return dateString;
      }
    }
  },

  // Text formatting
  text: {
    truncate: (text, maxLength = 50) => {
      if (!text) return 'N/A';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    
    capitalize: (text) => {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    parties: (partiesString) => {
      if (!partiesString) return 'N/A';
      // Handle different formats like "Company A & Company B" or "Company A, Company B"
      if (partiesString.includes(' & ')) {
        return partiesString.replace(' & ', ' • ');
      }
      if (partiesString.includes(', ')) {
        return partiesString.replace(', ', ' • ');
      }
      return partiesString;
    },
    
    initials: (name) => {
      if (!name) return '';
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
  },

  // Status formatting
  status: {
    getStatusColor: (status) => {
      if (!status) return 'bg-gray-100 text-gray-800 border-gray-300';
      
      const statusColors = {
        'Active': 'bg-green-100 text-green-800 border-green-300',
        'Expired': 'bg-red-100 text-red-800 border-red-300',
        'Renewal Due': 'bg-orange-100 text-orange-800 border-orange-300',
        'Draft': 'bg-blue-100 text-blue-800 border-blue-300',
        'Terminated': 'bg-gray-100 text-gray-800 border-gray-300'
      };
      
      return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    },
    
    getRiskColor: (risk) => {
      if (!risk) return 'bg-gray-100 text-gray-800 border-gray-300';
      
      const riskColors = {
        'High': 'bg-red-100 text-red-800 border-red-300',
        'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'Low': 'bg-green-100 text-green-800 border-green-300'
      };
      
      return riskColors[risk] || 'bg-gray-100 text-gray-800 border-gray-300';
    },
    
    getConfidenceColor: (confidence) => {
      if (typeof confidence !== 'number') return 'bg-gray-100 text-gray-800';
      
      if (confidence >= 0.8) {
        return 'bg-green-100 text-green-800';
      } else if (confidence >= 0.6) {
        return 'bg-yellow-100 text-yellow-800';
      } else {
        return 'bg-red-100 text-red-800';
      }
    }
  },

  // Number formatting
  number: {
    currency: (amount, currency = 'USD') => {
      if (typeof amount !== 'number') return 'N/A';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    },
    
    percentage: (value) => {
      if (typeof value !== 'number') return 'N/A';
      return `${Math.round(value * 100)}%`;
    },
    
    decimal: (value, places = 2) => {
      if (typeof value !== 'number') return 'N/A';
      return value.toFixed(places);
    },
    
    compact: (value) => {
      if (typeof value !== 'number') return 'N/A';
      
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toString();
    }
  },

  // File formatting
  file: {
    size: (bytes) => {
      if (typeof bytes !== 'number') return 'N/A';
      
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      if (bytes === 0) return '0 Bytes';
      
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
    },
    
    extension: (filename) => {
      if (!filename) return '';
      const parts = filename.split('.');
      return parts.length > 1 ? `.${parts.pop().toLowerCase()}` : '';
    },
    
    name: (filename) => {
      if (!filename) return 'Unknown';
      const parts = filename.split('.');
      return parts.length > 1 ? parts.slice(0, -1).join('.') : filename;
    }
  },

  // Utility formatters
  utils: {
    phoneNumber: (phone) => {
      if (!phone) return 'N/A';
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      return phone;
    },
    
    email: (email) => {
      if (!email) return 'N/A';
      return email.toLowerCase();
    },
    
    url: (url) => {
      if (!url) return 'N/A';
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
      }
      return url;
    }
  }
};