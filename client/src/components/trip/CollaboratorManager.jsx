import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collaboratorAPI } from '../../utils/api';
import UserSearchDropdown from '../common/UserSearchDropdown';

const CollaboratorManager = ({ trip, onTripUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const isOwner = user && trip.userId && (trip.userId._id === user.id || trip.userId === user.id);

  const handleAddCollaborator = async (selectedUser) => {
    setLoading(true);
    setError('');

    try {
      const response = await collaboratorAPI.addCollaborator(trip._id, { username: selectedUser.username });
      onTripUpdate(response.data.trip);
      setShowForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add collaborator');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    if (!window.confirm('Are you sure you want to remove this collaborator?')) return;

    setLoading(true);
    try {
      const response = await collaboratorAPI.removeCollaborator(trip._id, collaboratorId);
      onTripUpdate(response.data.trip);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove collaborator');
    } finally {
      setLoading(false);
    }
  };

  const getCollaboratorCount = () => {
    return (trip.collaborators?.length || 0) + 1; // +1 for owner
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Trip Collaborators</h3>
          <p className="text-sm text-gray-600">
            {getCollaboratorCount()} {getCollaboratorCount() === 1 ? 'person' : 'people'} can access this trip
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              showForm 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {showForm ? '✕ Cancel' : '+ Add Collaborator'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {showForm && isOwner && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search and select a user to add as collaborator:
            </label>
            <UserSearchDropdown
              onUserSelect={handleAddCollaborator}
              placeholder="Type username or email to search..."
              excludeUserIds={[
                trip.userId._id || trip.userId,
                ...(trip.collaborators?.map(c => c._id) || [])
              ]}
            />
          </div>
          <p className="text-xs text-gray-500">
            Search for users by username or email. Selected collaborators will be able to view and edit this trip.
          </p>
          {loading && (
            <div className="mt-2 flex items-center text-sm text-primary-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
              Adding collaborator...
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {/* Trip Owner */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-md">
              {trip.userId?.username?.charAt(0).toUpperCase() || 'O'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{trip.userId?.username || 'Unknown'}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">👑 Owner</span>
                <span className="text-xs text-blue-700">Full access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collaborators */}
        {trip.collaborators && trip.collaborators.length > 0 ? (
          trip.collaborators.map((collaborator) => (
            <div key={collaborator._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-md">
                  {collaborator.username?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{collaborator.username}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🤝 Collaborator</span>
                    <span className="text-xs text-gray-500">Can edit</span>
                  </div>
                </div>
              </div>
              {isOwner && (
                <button
                  onClick={() => handleRemoveCollaborator(collaborator._id)}
                  disabled={loading}
                  className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-400 text-4xl mb-2">👥</div>
            <p className="text-gray-500 font-medium">No collaborators yet</p>
            <p className="text-gray-400 text-sm">Add collaborators to plan this trip together</p>
          </div>
        )}
      </div>

      {!isOwner && trip.collaborators?.some(c => c._id === user?.id) && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 text-lg">🎉</span>
            <p className="text-green-700 font-medium">
              You're a collaborator on this trip!
            </p>
          </div>
          <p className="text-green-600 text-sm mt-1">
            You can view and edit all trip details including the itinerary.
          </p>
        </div>
      )}
    </div>
  );
};

export default CollaboratorManager;