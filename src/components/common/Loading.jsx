// src/components/common/Loading.jsx
import React from 'react';
import { Loader } from 'lucide-react';

const Loading = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  showText = true,
  variant = 'spinner' // 'spinner' | 'dots' | 'bars'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        {showText && text && (
          <span className={`ml-3 text-gray-600 ${textSizeClasses[size]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex space-x-1">
          <div className="w-1 h-6 bg-blue-600 animate-pulse"></div>
          <div className="w-1 h-6 bg-blue-600 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-6 bg-blue-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-6 bg-blue-600 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        </div>
        {showText && text && (
          <span className={`ml-3 text-gray-600 ${textSizeClasses[size]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
      {showText && text && (
        <span className={`ml-3 text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Skeleton components for loading states
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-12"></div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export const SkeletonTableRow = ({ columns = 5, className = '' }) => (
  <tr className={className}>
    {Array.from({ length: columns }, (_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          {index === 0 && <div className="h-3 bg-gray-200 rounded w-3/4 mt-1"></div>}
        </div>
      </td>
    ))}
  </tr>
);

export const SkeletonStatCard = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ 
  items = 5, 
  component: Component = SkeletonCard, 
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }, (_, index) => (
      <Component key={index} />
    ))}
  </div>
);

export const SkeletonTable = ({ 
  rows = 5, 
  columns = 5, 
  showHeader = true,
  className = '' 
}) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {showHeader && (
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }, (_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }, (_, index) => (
            <SkeletonTableRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SkeletonGrid = ({ 
  items = 6, 
  columns = 3, 
  component: Component = SkeletonCard,
  className = '' 
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 ${className}`}>
    {Array.from({ length: items }, (_, index) => (
      <Component key={index} />
    ))}
  </div>
);

// Loading wrapper component
export const LoadingWrapper = ({ 
  loading, 
  error, 
  children, 
  loadingComponent,
  errorComponent,
  className = ''
}) => {
  if (loading) {
    return loadingComponent || <Loading size="lg" text="Loading..." />;
  }

  if (error) {
    return errorComponent || (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-600 text-lg font-medium mb-2">Error</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  return children;
};

export default Loading;