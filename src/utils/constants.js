export const APP_CONSTANTS = {
  APP_NAME: 'ContractPro',
  APP_VERSION: '1.0.0',
  API_TIMEOUT: 10000,
  
  // Authentication
  TOKEN_EXPIRY: 3600000, // 1 hour in milliseconds
  REFRESH_TOKEN_THRESHOLD: 300000, // 5 minutes in milliseconds
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.txt'],
  MAX_FILES_PER_UPLOAD: 10,
  
  // Contract Status
  CONTRACT_STATUS: {
    ACTIVE: 'Active',
    EXPIRED: 'Expired',
    RENEWAL_DUE: 'Renewal Due',
    DRAFT: 'Draft',
    TERMINATED: 'Terminated'
  },
  
  // Risk Levels
  RISK_LEVELS: {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High'
  },
  
  // Date Formats
  DATE_FORMATS: {
    DISPLAY: 'MMM DD, YYYY',
    API: 'YYYY-MM-DD',
    FULL: 'MMMM DD, YYYY HH:mm:ss'
  },
  
  // UI Constants
  SIDEBAR_WIDTH: 256,
  TOPBAR_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  
  // Colors for charts and UI
  COLORS: {
    PRIMARY: '#3B82F6',
    SUCCESS: '#22C55E',
    WARNING: '#F59E0B',
    DANGER: '#EF4444',
    INFO: '#06B6D4',
    GRAY: '#6B7280'
  },
  
  // Local Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER: 'user',
    PREFERENCES: 'user_preferences',
    THEME: 'theme'
  }
};

export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Contracts',
    icon: 'FileText',
    path: '/dashboard'
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: 'BarChart3',
    path: '/insights'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'FileBarChart',
    path: '/reports'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings'
  }
];

export const FILTER_OPTIONS = {
  STATUS: [
    { value: 'all', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Renewal Due', label: 'Renewal Due' },
    { value: 'Draft', label: 'Draft' }
  ],
  RISK: [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'Low', label: 'Low Risk' },
    { value: 'Medium', label: 'Medium Risk' },
    { value: 'High', label: 'High Risk' }
  ]
};
