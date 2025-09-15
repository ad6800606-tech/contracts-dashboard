import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  Plus,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { APP_CONSTANTS } from '../../utils/constants';

const FileDropzone = ({ 
  onFilesAdded, 
  disabled = false, 
  maxFiles = APP_CONSTANTS.MAX_FILES_PER_UPLOAD,
  className = "" 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState('');
  const fileInputRef = useRef(null);

  const validateFiles = (files) => {
    const errors = [];
    
    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
    }
    
    for (const file of files) {
      // Check file size
      if (file.size > APP_CONSTANTS.MAX_FILE_SIZE) {
        errors.push(`${file.name} exceeds size limit`);
        continue;
      }
      
      // Check file type
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!APP_CONSTANTS.ALLOWED_FILE_TYPES.includes(extension)) {
        errors.push(`${file.name} has unsupported file type`);
      }
    }
    
    return errors;
  };

  const handleFiles = useCallback((files) => {
    if (disabled) return;
    
    setDragError('');
    const fileArray = Array.from(files);
    
    if (fileArray.length === 0) return;
    
    const errors = validateFiles(fileArray);
    
    if (errors.length > 0) {
      setDragError(errors[0]);
      setTimeout(() => setDragError(''), 3000);
      return;
    }
    
    onFilesAdded?.(fileArray.slice(0, maxFiles));
  }, [disabled, maxFiles, onFilesAdded]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragOver(true);
    setDragError('');
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set drag over to false if we're leaving the dropzone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [disabled, handleFiles]);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
    
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const dropzoneClasses = `
    relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
    ${disabled 
      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50' 
      : isDragOver 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
    }
    ${dragError ? 'border-red-300 bg-red-50' : ''}
    ${className}
  `;

  return (
    <div className="space-y-3">
      <div
        className={dropzoneClasses}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={APP_CONSTANTS.ALLOWED_FILE_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {/* Dropzone Content */}
        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className={`p-4 rounded-full ${
            dragError 
              ? 'bg-red-100' 
              : isDragOver 
                ? 'bg-blue-100' 
                : 'bg-gray-100'
          }`}>
            {dragError ? (
              <AlertCircle className="w-8 h-8 text-red-600" />
            ) : isDragOver ? (
              <FolderOpen className="w-8 h-8 text-blue-600" />
            ) : (
              <Upload className="w-8 h-8 text-gray-600" />
            )}
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            {dragError ? (
              <div className="text-center">
                <p className="text-red-600 font-medium">{dragError}</p>
                <p className="text-sm text-red-500 mt-1">Please check your files and try again</p>
              </div>
            ) : isDragOver ? (
              <div className="text-center">
                <p className="text-blue-600 font-medium">Drop files here</p>
                <p className="text-sm text-blue-500">Release to upload your contracts</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-700 font-medium">
                  {disabled ? 'Upload disabled' : 'Drag and drop files here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {disabled 
                    ? 'Please wait for current upload to complete'
                    : 'or click to browse and select files'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Browse Button */}
          {!disabled && !isDragOver && !dragError && (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <Plus className="w-4 h-4" />
              Browse Files
            </button>
          )}
        </div>

        {/* File Type Icons */}
        {!dragError && !isDragOver && (
          <div className="mt-6 flex items-center justify-center gap-4 opacity-60">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">PDF</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">DOC</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">DOCX</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">TXT</span>
            </div>
          </div>
        )}
      </div>

      {/* Additional Info */}
      {!disabled && !dragError && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Maximum {maxFiles} files • Up to {Math.floor(APP_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024))}MB each
          </p>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;