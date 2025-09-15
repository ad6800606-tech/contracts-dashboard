import React from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Upload,
  BarChart3,
  Settings,
  AlertCircle
} from 'lucide-react';

const EmptyState = ({ 
  type = 'default',
  title,
  description,
  actionText,
  onAction,
  icon: CustomIcon,
  className = ''
}) => {
  const getDefaultProps = () => {
    switch (type) {
      case 'contracts':
        return {
          icon: FileText,
          title: 'No contracts found',
          description: 'Get started by uploading your first contract or adjust your search filters.',
          actionText: 'Upload Contract'
        };
      case 'search':
        return {
          icon: Search,
          title: 'No results found',
          description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
          actionText: 'Clear Filters'
        };
      case 'insights':
        return {
          icon: BarChart3,
          title: 'No insights available',
          description: 'Upload contracts to generate AI-powered insights and risk analysis.',
          actionText: 'Upload Contract'
        };
      case 'reports':
        return {
          icon: BarChart3,
          title: 'No reports generated',
          description: 'Create your first report to analyze contract data and trends.',
          actionText: 'Generate Report'
        };
      case 'error':
        return {
          icon: AlertCircle,
          title: 'Something went wrong',
          description: 'We encountered an error while loading the data. Please try again.',
          actionText: 'Retry'
        };
      default:
        return {
          icon: FileText,
          title: 'Nothing here yet',
          description: 'This section is empty. Start by adding some content.',
          actionText: 'Get Started'
        };
    }
  };

  const defaults = getDefaultProps();
  const Icon = CustomIcon || defaults.icon;
  const finalTitle = title || defaults.title;
  const finalDescription = description || defaults.description;
  const finalActionText = actionText || defaults.actionText;

  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-4">
          <Icon className="w-16 h-16 text-gray-400 mx-auto" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {finalTitle}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {finalDescription}
        </p>

        {/* Action Button */}
        {onAction && finalActionText && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {type === 'contracts' || type === 'insights' ? (
              <Upload className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {finalActionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;