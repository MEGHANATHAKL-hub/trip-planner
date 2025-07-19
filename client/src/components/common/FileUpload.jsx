import React, { useState, useRef } from 'react';

const FileUpload = ({ 
  onFileSelect, 
  multiple = false, 
  accept = "image/*", 
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 10,
  label = "Upload Files",
  description = "Choose files to upload",
  className = ""
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const validateFiles = (files) => {
    const fileArray = Array.from(files);
    const errors = [];

    // Check file count
    if (multiple && fileArray.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
    }

    // Check individual files
    fileArray.forEach((file, index) => {
      // Check file size
      if (file.size > maxSize) {
        errors.push(`File ${file.name} is too large (max ${Math.round(maxSize / (1024 * 1024))}MB)`);
      }

      // Check file type
      if (accept && !file.type.match(accept.replace(/\*/g, '.*'))) {
        errors.push(`File ${file.name} is not an accepted type`);
      }
    });

    return errors;
  };

  const handleFileSelect = (files) => {
    const validationErrors = validateFiles(files);
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setError('');
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    
    if (onFileSelect) {
      onFileSelect(fileArray);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    if (onFileSelect) {
      onFileSelect(newFiles);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <div className="text-4xl text-gray-400 mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{label}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <div className="text-sm text-gray-500">
            <p>Drag and drop files here, or click to select</p>
            <p>
              Max file size: {Math.round(maxSize / (1024 * 1024))}MB
              {multiple && ` • Max files: ${maxFiles}`}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Files:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">📎</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;