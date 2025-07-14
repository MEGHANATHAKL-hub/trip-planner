import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collaboratorAPI } from '../../utils/api';

const CollaboratorManager = ({ trip, onTripUpdate }) => {
  const [newCollaborator, setNewCollaborator] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const isOwner = user && trip.userId && (trip.userId._id === user.id || trip.userId === user.id);

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    if (!newCollaborator.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await collaboratorAPI.addCollaborator(trip._id, { username: newCollaborator });
      onTripUpdate(response.data.trip);
      setNewCollaborator('');
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

  return (
    <div className="border-t pt-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Collaborators</h3>
        {isOwner && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-secondary text-sm"
          >
            {showForm ? 'Cancel' : 'Add Collaborator'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {showForm && isOwner && (
        <form onSubmit={handleAddCollaborator} className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
              placeholder="Enter username"
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newCollaborator.trim()}
              className="btn-primary"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Add a collaborator by their username. They will be able to edit this trip.
          </p>
        </form>
      )}

      <div className="space-y-2">
        {/* Trip Owner */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {trip.userId?.username?.charAt(0).toUpperCase() || 'O'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{trip.userId?.username || 'Unknown'}</p>
              <p className="text-xs text-blue-600">Trip Owner</p>
            </div>
          </div>
        </div>

        {/* Collaborators */}
        {trip.collaborators && trip.collaborators.length > 0 ? (
          trip.collaborators.map((collaborator) => (
            <div key={collaborator._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {collaborator.username?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{collaborator.username}</p>
                  <p className="text-xs text-green-600">Collaborator</p>
                </div>
              </div>
              {isOwner && (
                <button
                  onClick={() => handleRemoveCollaborator(collaborator._id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm py-3">No collaborators yet</p>
        )}
      </div>

      {!isOwner && trip.collaborators?.some(c => c._id === user?.id) && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            🎉 You are a collaborator on this trip and can edit it!
          </p>
        </div>
      )}
    </div>
  );
};

export default CollaboratorManager;