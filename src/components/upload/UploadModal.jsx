import React, { useState, useCallback } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONSTANTS } from '../../utils/constants';
import { helpers } from '../../utils/helpers';
import FileDropzone from './FileDropzone';
import FileList from './FileList';

const UploadModal = () => {
  const { modals, toggleModal, uploadFiles } = useApp();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadComplete, setUploadComplete] = useState(false);

  const isOpen = modals.upload;

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFiles([]);
      setUploading(false);
      setUploadProgress({});
      setUploadComplete(false);
    }
  }, [isOpen]);

  const validateFile = useCallback((file) => {
    const errors = [];

    // Check file size
    if (file.size > APP_CONSTANTS.MAX_FILE_SIZE) {
      errors.push(`File size exceeds ${helpers.formatBytes(APP_CONSTANTS.MAX_FILE_SIZE)} limit`);
    }

    // Check file type
    if (!helpers.isValidFileType(file.name)) {
      errors.push(`File type not supported. Allowed: ${APP_CONSTANTS.ALLOWED_FILE_TYPES.join(', ')}`);
    }

    return errors;
  }, []);

  const handleFilesSelected = useCallback((selectedFiles) => {
    if (files.length + selectedFiles.length > APP_CONSTANTS.MAX_FILES_PER_UPLOAD) {
      alert(`Maximum ${APP_CONSTANTS.MAX_FILES_PER_UPLOAD} files allowed per upload`);
      return;
    }

    const newFiles = selectedFiles.map(file => {
      const id = helpers.generateId();
      const errors = validateFile(file);
      
      return {
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: errors.length > 0 ? 'error' : 'pending',
        errors,
        progress: 0
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length, validateFile]);

  const handleRemoveFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  }, []);

  const simulateFileUpload = async (fileItem) => {
    const { id } = fileItem;
    
    // Update file status to uploading
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status: 'uploading' } : f
    ));

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await helpers.delay(100 + Math.random() * 100); // Random delay for realism
      
      setUploadProgress(prev => ({
        ...prev,
        [id]: progress
      }));

      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, progress } : f
      ));
    }

    // Simulate occasional upload failures
    const shouldFail = Math.random() < 0.1; // 10% failure rate
    
    if (shouldFail) {
      setFiles(prev => prev.map(f => 
        f.id === id ? { 
          ...f, 
          status: 'error', 
          errors: ['Upload failed. Please try again.'],
          progress: 0
        } : f
      ));
    } else {
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'success', progress: 100 } : f
      ));
    }
  };

  const handleUpload = async () => {
    const validFiles = files.filter(f => f.status === 'pending');
    
    if (validFiles.length === 0) {
      return;
    }

    setUploading(true);

    try {
      // Upload files in parallel
      await Promise.all(
        validFiles.map(fileItem => simulateFileUpload(fileItem))
      );

      // Check if all uploads were successful
      const hasErrors = files.some(f => f.status === 'error');
      if (!hasErrors) {
        setUploadComplete(true);
        
        // Auto-close modal after successful upload
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRetryFile = (fileId) => {
    const fileItem = files.find(f => f.id === fileId);
    if (fileItem) {
      simulateFileUpload(fileItem);
    }
  };

  const handleClose = () => {
    if (uploading) {
      const confirmClose = window.confirm('Upload in progress. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    toggleModal('upload');
  };

  const getUploadStats = () => {
    const total = files.length;
    const pending = files.filter(f => f.status === 'pending').length;
    const uploading = files.filter(f => f.status === 'uploading').length;
    const success = files.filter(f => f.status === 'success').length;
    const error = files.filter(f => f.status === 'error').length;
    
    return { total, pending, uploading, success, error };
  };

  if (!isOpen) return null;

  const stats = getUploadStats();
  const canUpload = stats.pending > 0 && !uploading;
  const allComplete = stats.total > 0 && stats.pending === 0 && stats.uploading === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Upload Contracts</h2>
              <p className="text-sm text-gray-600">
                Add new contracts to your dashboard
              </p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={uploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {uploadComplete ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Complete!
              </h3>
              <p className="text-gray-600 mb-4">
                {stats.success} file{stats.success !== 1 ? 's' : ''} uploaded successfully.
                Your contracts are being processed.
              </p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* File Dropzone */}
              {!uploading && (
                <div className="mb-6">
                  <FileDropzone
                    onFilesSelected={handleFilesSelected}
                    disabled={files.length >= APP_CONSTANTS.MAX_FILES_PER_UPLOAD}
                  />
                </div>
              )}

              {/* Upload Instructions */}
              {files.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Supported File Types
                      </h4>
                      <p className="text-sm text-blue-700 mb-2">
                        {APP_CONSTANTS.ALLOWED_FILE_TYPES.join(', ')} files up to {helpers.formatBytes(APP_CONSTANTS.MAX_FILE_SIZE)}
                      </p>
                      <p className="text-xs text-blue-600">
                        Maximum {APP_CONSTANTS.MAX_FILES_PER_UPLOAD} files per upload
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* File List */}
              {files.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Selected Files ({files.length})
                    </h3>
                    {!uploading && stats.pending > 0 && (
                      <button
                        onClick={() => setFiles([])}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <FileList
                    files={files}
                    onRemoveFile={handleRemoveFile}
                    onRetryFile={handleRetryFile}
                    uploading={uploading}
                  />
                </div>
              )}

              {/* Upload Progress Summary */}
              {uploading && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-gray-900">
                      Uploading files...
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-blue-600">{stats.uploading}</div>
                      <div className="text-xs text-gray-600">Uploading</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">{stats.success}</div>
                      <div className="text-xs text-gray-600">Complete</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-red-600">{stats.error}</div>
                      <div className="text-xs text-gray-600">Failed</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-600">{stats.pending}</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Summary */}
              {stats.error > 0 && !uploading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">
                      {stats.error} file{stats.error !== 1 ? 's' : ''} failed to upload
                    </span>
                  </div>
                  <p className="text-sm text-red-700">
                    Please review the errors and try again.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!uploadComplete && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              {stats.total > 0 && (
                <span>
                  {stats.total} file{stats.total !== 1 ? 's' : ''} selected
                  {stats.success > 0 && `, ${stats.success} uploaded`}
                  {stats.error > 0 && `, ${stats.error} failed`}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                disabled={uploading}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Cancel'}
              </button>
              
              {canUpload && (
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload {stats.pending} File{stats.pending !== 1 ? 's' : ''}
                </button>
              )}

              {allComplete && stats.error > 0 && (
                <button
                  onClick={() => {
                    const failedFiles = files.filter(f => f.status === 'error');
                    failedFiles.forEach(f => handleRetryFile(f.id));
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Retry Failed
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;