// File: src/components/upload/UploadModal.jsx
import React, { useState, useCallback } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Loader,
  CloudUpload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const UploadModal = () => {
  const { modals, toggleModal, uploadFiles } = useApp();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadComplete, setUploadComplete] = useState(false);

  const isOpen = modals.upload;

  // App constants - Define here since we don't have access to constants file
  const APP_CONSTANTS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_FILES_PER_UPLOAD: 5,
    ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.txt']
  };

  // Helper functions
  const helpers = {
    formatBytes: (bytes, decimals = 2) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    
    isValidFileType: (fileName) => {
      const extension = '.' + fileName.split('.').pop().toLowerCase();
      return APP_CONSTANTS.ALLOWED_FILE_TYPES.includes(extension);
    },
    
    generateId: () => Math.random().toString(36).substr(2, 9),
    
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms))
  };

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
      await helpers.delay(100 + Math.random() * 100);
      
      setUploadProgress(prev => ({
        ...prev,
        [id]: progress
      }));

      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, progress } : f
      ));
    }

    // Simulate success/failure
    const success = Math.random() > 0.2; // 80% success rate
    
    setFiles(prev => prev.map(f => 
      f.id === id 
        ? { ...f, status: success ? 'success' : 'error', progress: 100 }
        : f
    ));
  };

  const handleUpload = async () => {
    const validFiles = files.filter(f => f.status === 'pending');
    if (validFiles.length === 0) return;

    setUploading(true);

    // Upload files concurrently
    await Promise.all(
      validFiles.map(file => simulateFileUpload(file))
    );

    setUploading(false);
    setUploadComplete(true);
  };

  const handleRetryFile = async (fileId) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      await simulateFileUpload(file);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      toggleModal('upload');
    }
  };

  // File drop handlers
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFilesSelected(droppedFiles);
  }, [handleFilesSelected]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFilesSelected(selectedFiles);
    e.target.value = ''; // Reset input
  }, [handleFilesSelected]);

  // Calculate stats
  const stats = {
    total: files.length,
    pending: files.filter(f => f.status === 'pending').length,
    uploading: files.filter(f => f.status === 'uploading').length,
    success: files.filter(f => f.status === 'success').length,
    error: files.filter(f => f.status === 'error').length
  };

  const canUpload = stats.pending > 0 && !uploading;
  const allComplete = stats.uploading === 0 && stats.pending === 0 && stats.total > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upload Contracts</h2>
              <p className="text-sm text-gray-500">Upload your contract documents for analysis</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {uploadComplete && stats.success > 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Complete!</h3>
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
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileInput}
                      className="hidden"
                      id="fileInput"
                    />
                    <label htmlFor="fileInput" className="cursor-pointer">
                      <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Drop files here or click to browse
                      </h3>
                      <p className="text-gray-500">
                        Select up to {APP_CONSTANTS.MAX_FILES_PER_UPLOAD} files
                      </p>
                    </label>
                  </div>
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
                  
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {helpers.formatBytes(file.size)}
                            </p>
                            {file.errors.length > 0 && (
                              <p className="text-xs text-red-600 mt-1">
                                {file.errors[0]}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {file.status === 'uploading' && (
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{file.progress}%</span>
                            </div>
                          )}
                          
                          {file.status === 'success' && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          
                          {file.status === 'error' && (
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                              <button
                                onClick={() => handleRetryFile(file.id)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Retry
                              </button>
                            </div>
                          )}
                          
                          {(file.status === 'pending' || file.status === 'error') && !uploading && (
                            <button
                              onClick={() => handleRemoveFile(file.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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