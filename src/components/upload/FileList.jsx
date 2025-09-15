import React from 'react';
import { 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  RotateCcw,
  Download,
  File,
  FileType,
  FileSpreadsheet
} from 'lucide-react';
import { helpers } from '../../utils/helpers';

const FileList = ({ 
  files = [], 
  onRemoveFile, 
  onRetryFile, 
  uploading = false,
  showActions = true 
}) => {
  const getFileIcon = (fileName, mimeType) => {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    switch (extension) {
      case '.pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case '.doc':
      case '.docx':
        return <FileType className="w-5 h-5 text-blue-600" />;
      case '.txt':
        return <File className="w-5 h-5 text-gray-600" />;
      case '.xls':
      case '.xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Loader className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploading':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'pending':
        return 'border-gray-200 bg-white hover:bg-gray-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const FileItem = ({ file }) => {
    const canRemove = !uploading || file.status === 'error' || file.status === 'success';
    const canRetry = file.status === 'error' && !uploading;

    return (
      <div className={`border rounded-lg p-4 transition-all ${getStatusColor(file.status)}`}>
        <div className="flex items-start gap-3">
          {/* File Icon */}
          <div className="flex-shrink-0 mt-1">
            {getFileIcon(file.name, file.type)}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-gray-900 truncate pr-2">
                {file.name}
              </h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(file.status)}
                {showActions && (
                  <div className="flex items-center gap-1">
                    {canRetry && (
                      <button
                        onClick={() => onRetryFile?.(file.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Retry upload"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                    
                    {file.status === 'success' && (
                      <button
                        className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded transition-colors"
                        title="Download file"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    )}
                    
                    {canRemove && (
                      <button
                        onClick={() => onRemoveFile?.(file.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Remove file"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* File Details */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
              <span>{helpers.formatBytes(file.size)}</span>
              <span className="capitalize">
                {file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase()}
              </span>
              <span className="capitalize">{file.status}</span>
            </div>

            {/* Progress Bar */}
            {(file.status === 'uploading' || file.status === 'success') && (
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      file.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${file.progress || 0}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {file.status === 'uploading' ? 'Uploading...' : 'Complete'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(file.progress || 0)}%
                  </span>
                </div>
              </div>
            )}

            {/* Error Messages */}
            {file.status === 'error' && file.errors && file.errors.length > 0 && (
              <div className="mt-2">
                {file.errors.map((error, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Success Message */}
            {file.status === 'success' && (
              <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>Upload completed successfully</span>
              </div>
            )}

            {/* Pending Message */}
            {file.status === 'pending' && (
              <div className="text-xs text-gray-500 mt-1">
                Ready to upload
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No files selected</p>
      </div>
    );
  }

  // Group files by status for better organization
  const groupedFiles = files.reduce((groups, file) => {
    const status = file.status;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(file);
    return groups;
  }, {});

  // Define display order for statuses
  const statusOrder = ['uploading', 'pending', 'success', 'error'];

  return (
    <div className="space-y-4">
      {/* Files grouped by status */}
      {statusOrder.map(status => {
        const statusFiles = groupedFiles[status];
        if (!statusFiles || statusFiles.length === 0) return null;

        return (
          <div key={status}>
            {/* Status Header (only show if multiple statuses exist) */}
            {Object.keys(groupedFiles).length > 1 && (
              <div className="flex items-center gap-2 mb-3">
                {getStatusIcon(status)}
                <h4 className="text-sm font-medium text-gray-700 capitalize">
                  {status === 'pending' ? 'Ready to Upload' : status}
                  <span className="text-gray-500 ml-1">
                    ({statusFiles.length})
                  </span>
                </h4>
              </div>
            )}

            {/* Files List */}
            <div className="space-y-3">
              {statusFiles.map(file => (
                <FileItem key={file.id} file={file} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Summary Stats */}
      {files.length > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </span>
            <span className="text-gray-600">
              Total size: {helpers.formatBytes(
                files.reduce((total, file) => total + file.size, 0)
              )}
            </span>
          </div>
          
          {/* Overall Progress */}
          {files.some(f => f.status === 'uploading' || f.status === 'success') && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Overall Progress</span>
                <span className="text-xs text-gray-600">
                  {Math.round(
                    files.reduce((total, file) => total + (file.progress || 0), 0) / files.length
                  )}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${files.reduce((total, file) => total + (file.progress || 0), 0) / files.length}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileList;