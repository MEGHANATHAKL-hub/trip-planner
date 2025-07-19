import React, { useState, useRef } from 'react';
import { uploadAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const ProfilePhotoUpload = ({ onUploadSuccess }) => {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const response = await uploadAPI.uploadProfilePhoto(formData);
      
      // Update user context with new profile photo
      if (updateUser) {
        updateUser(response.data.user);
      }

      if (onUploadSuccess) {
        onUploadSuccess(response.data.profilePhoto);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
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
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getProfilePhotoUrl = (photo) => {
    if (!photo) return null;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/uploads/profile-photo/${photo}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Current Profile Photo */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {user?.profilePhoto ? (
            <img
              src={getProfilePhotoUrl(user.profilePhoto)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl text-gray-400">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Upload Overlay */}
        <div
          className={`absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer transition-opacity ${
            dragOver ? 'opacity-100' : 'opacity-0 hover:opacity-100'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : (
            <div className="text-white text-center">
              <div className="text-2xl mb-1">📷</div>
              <div className="text-xs">Upload</div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleClick}
        disabled={uploading}
        className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Change Photo'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 text-center">
        <p>JPG, PNG, GIF, or WebP</p>
        <p>Maximum size: 5MB</p>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;