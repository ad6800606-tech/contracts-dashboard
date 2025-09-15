// src/components/common/EmptyState.jsx
import React from 'react';
import { 
  FileText, 
  Search, 
  AlertTriangle, 
  Plus, 
  RefreshCw,
  Inbox,
  Archive,
  Filter
} from 'lucide-react';

const EmptyState = ({
  type = 'default',
  title,
  description,
  actionText,
  onAction,
  icon: CustomIcon,
  className = '',
  showIcon = true,
  size = 'md'
}) => {
  // Default configurations for different types
  const configs = {
    contracts: {
      icon: FileText,
      title: 'No contracts found',
      description: 'Get started by uploading your first contract.',
      actionText: 'Upload Contract',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    search: {
      icon: Search,
      title: 'No results found',
      description: 'Try adjusting your search terms or filters.',
      actionText: 'Clear Search',
      iconColor: 'text-gray-500',
      bgColor: 'bg-gray-50'
    },
    error: {
      icon: AlertTriangle,
      title: 'Something went wrong',
      description: 'We encountered an error. Please try again.',
      actionText: 'Try Again',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    filter: {
      icon: Filter,
      title: 'No matches found',
      description: 'No items match your current filters.',
      actionText: 'Clear Filters',
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    upload: {
      icon: Plus,
      title: 'No files uploaded',
      description: 'Upload files to get started with analysis.',
      actionText: 'Upload Files',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    inbox: {
      icon: Inbox,
      title: 'All caught up!',
      description: 'No new items to review.',
      actionText: 'Refresh',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    archived: {
      icon: Archive,
      title: 'No archived items',
      description: 'Archived items will appear here.',
      actionText: null,
      iconColor: 'text-gray-500',
      bgColor: 'bg-gray-50'
    },
    default: {
      icon: Inbox,
      title: 'No data available',
      description: 'There are no items to display.',
      actionText: null,
      iconColor: 'text-gray-500',
      bgColor: 'bg-gray-50'
    }
  };

  const config = configs[type] || configs.default;
  const Icon = CustomIcon || config.icon;

  // Use provided props or fall back to config defaults
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalActionText = actionText !== undefined ? actionText : config.actionText;

  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm'
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base',
      button: 'px-6 py-3 text-base'
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      title: 'text-2xl',
      description: 'text-lg',
      button: 'px-8 py-3 text-lg'
    }
  };

  const sizes = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`text-center ${sizes.container} ${className}`}>
      {showIcon && Icon && (
        <div className={`mx-auto ${config.bgColor} rounded-full p-4 w-fit mb-4`}>
          <Icon className={`${sizes.icon} ${config.iconColor} mx-auto`} />
        </div>
      )}
      
      <h3 className={`font-semibold text-gray-900 mb-2 ${sizes.title}`}>
        {finalTitle}
      </h3>
      
      {finalDescription && (
        <p className={`text-gray-600 mb-6 max-w-sm mx-auto ${sizes.description}`}>
          {finalDescription}
        </p>
      )}
      
      {finalActionText && onAction && (
        <button
          onClick={onAction}
          className={`inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${sizes.button}`}
        >
          {type === 'upload' && <Plus className="w-4 h-4" />}
          {type === 'error' && <RefreshCw className="w-4 h-4" />}
          {finalActionText}
        </button>
      )}
    </div>
  );
};

// Specialized empty state components
export const EmptyContracts = ({ onUpload, className = '' }) => (
  <EmptyState
    type="contracts"
    onAction={onUpload}
    className={className}
  />
);

export const EmptySearchResults = ({ onClear, searchTerm, className = '' }) => (
  <EmptyState
    type="search"
    title={`No results for "${searchTerm}"`}
    description="Try different keywords or check your spelling."
    actionText="Clear Search"
    onAction={onClear}
    className={className}
  />
);

export const EmptyFilterResults = ({ onClear, className = '' }) => (
  <EmptyState
    type="filter"
    onAction={onClear}
    className={className}
  />
);

export const ErrorState = ({ error, onRetry, className = '' }) => (
  <EmptyState
    type="error"
    description={error || 'Something went wrong. Please try again.'}
    actionText="Try Again"
    onAction={onRetry}
    className={className}
  />
);

export const LoadingEmptyState = ({ message = 'Loading...', className = '' }) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="mx-auto bg-blue-50 rounded-full p-4 w-fit mb-4">
      <RefreshCw className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      {message}
    </h3>
    <p className="text-gray-600">
      Please wait while we load your data.
    </p>
  </div>
);

export default EmptyState;