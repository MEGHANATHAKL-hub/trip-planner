import React, { useState } from 'react';
import { uploadAPI } from '../../utils/api';
import FileUpload from '../common/FileUpload';

const TripPhotoUpload = ({ tripId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [captions, setCaptions] = useState({});

  const handleFileSelect = (files) => {
    setSelectedFiles(files);
    setError('');
    
    // Initialize captions for new files
    const newCaptions = {};
    files.forEach((file, index) => {
      newCaptions[index] = '';
    });
    setCaptions(newCaptions);
  };

  const handleCaptionChange = (index, caption) => {
    setCaptions(prev => ({
      ...prev,
      [index]: caption
    }));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one photo');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Add files
      selectedFiles.forEach((file) => {
        formData.append('tripPhotos', file);
      });

      // Add captions
      const captionArray = selectedFiles.map((_, index) => captions[index] || '');
      formData.append('captions', JSON.stringify(captionArray));

      const response = await uploadAPI.uploadTripPhotos(tripId, formData);
      
      // Reset form
      setSelectedFiles([]);
      setCaptions({});
      
      if (onUploadSuccess) {
        onUploadSuccess(response.data.photos);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Add Photos to Trip</h3>
      
      {/* File Upload */}
      <FileUpload
        onFileSelect={handleFileSelect}
        multiple={true}
        accept="image/*"
        maxFiles={10}
        label="Upload Trip Photos"
        description="Select up to 10 photos to add to your trip"
      />

      {/* Captions for Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Add Captions (Optional):</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="flex-shrink-0">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">{file.name}</div>
                <input
                  type="text"
                  value={captions[index] || ''}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Photo${selectedFiles.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default TripPhotoUpload;