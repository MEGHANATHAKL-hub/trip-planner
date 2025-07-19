import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../utils/api';

const UserCard = ({ user, currentUser, isAdmin, onDeleteUser, onUserRoleUpdate }) => {
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isCurrentUser = currentUser && user._id === currentUser._id;
  const canDelete = isAdmin && !isCurrentUser && user.role !== 'admin';
  const canChangeRole = isAdmin && !isCurrentUser;

  const handleRoleChange = async (newRole) => {
    if (!canChangeRole || isUpdatingRole) return;
    
    const actionText = newRole === 'admin' ? 'promote to admin' : 'demote to user';
    const confirmMessage = `Are you sure you want to ${actionText} "${user.username}"?`;
    
    if (!window.confirm(confirmMessage)) return;
    
    try {
      setIsUpdatingRole(true);
      console.log('Attempting to update role for user:', user._id, 'to role:', newRole);
      
      const response = await userAPI.updateUserRole(user._id, newRole);
      console.log('Role update response:', response.data);
      
      // Call parent callback to refresh user list
      if (onUserRoleUpdate) {
        onUserRoleUpdate(user._id, newRole);
      }
      
      alert(`${user.username} has been ${newRole === 'admin' ? 'promoted to admin' : 'demoted to user'} successfully.`);
    } catch (error) {
      console.error('Error updating user role:', error);
      console.error('Error details:', error.response);
      alert(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!canChangeRole || isUpdatingPassword) return;
    
    const newPassword = window.prompt(`Enter new password for "${user.username}" (minimum 6 characters):`);
    
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setIsUpdatingPassword(true);
      await userAPI.updateUserPassword(user._id, newPassword);
      
      alert(`Password updated successfully for ${user.username}.`);
    } catch (error) {
      console.error('Error updating user password:', error);
      alert(error.response?.data?.message || 'Failed to update user password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.username}
                {isCurrentUser && (
                  <span className="ml-2 text-sm text-primary-600 font-normal">(You)</span>
                )}
                {user.role === 'admin' && (
                  <span className="ml-2 text-xs bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 rounded-full font-bold">
                    👑 ADMIN
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-4 py-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">{user.stats.tripsCreated}</div>
          <div className="text-xs text-gray-600">Trips Created</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{user.stats.collaborations}</div>
          <div className="text-xs text-gray-600">Collaborations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{user.stats.totalTrips}</div>
          <div className="text-xs text-gray-600">Total Trips</div>
        </div>
      </div>

      {/* Activity Indicators */}
      <div className="flex gap-2 mb-4">
        {user.stats.tripsCreated > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            ✈️ Trip Creator
          </span>
        )}
        {user.stats.collaborations > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            🤝 Collaborator
          </span>
        )}
        {user.stats.totalTrips === 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            🆕 New Member
          </span>
        )}
      </div>

      {/* Member Since */}
      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <span>Member since {formatDate(user.createdAt)}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Link
            to={`/users/${user._id}`}
            className="btn-primary text-sm flex-1 text-center"
          >
            View Profile
          </Link>
          
          {!isCurrentUser && !canDelete && (
            <button
              onClick={() => {
                // Future: Add friend/follow functionality
                alert('Connect feature coming soon!');
              }}
              className="btn-secondary text-sm px-4"
            >
              Connect
            </button>
          )}
          
          {canDelete && (
            <button
              onClick={() => onDeleteUser(user._id, user.username)}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-1"
              title="Delete User Account"
            >
              <span>🗑️</span>
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
        
        {/* Role Management Buttons - Admin Only */}
        {canChangeRole && (
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div className="flex gap-2">
              {user.role === 'user' ? (
                <button
                  onClick={() => handleRoleChange('admin')}
                  disabled={isUpdatingRole}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm px-3 py-2 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Promote to Admin"
                >
                  <span>👑</span>
                  <span>{isUpdatingRole ? 'Updating...' : 'Make Admin'}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleRoleChange('user')}
                  disabled={isUpdatingRole}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm px-3 py-2 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Demote to User"
                >
                  <span>👤</span>
                  <span>{isUpdatingRole ? 'Updating...' : 'Make User'}</span>
                </button>
              )}
            </div>
            
            {/* Password Management */}
            <div className="flex gap-2">
              <button
                onClick={handlePasswordChange}
                disabled={isUpdatingPassword}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-3 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                title="Change User Password"
              >
                <span>🔑</span>
                <span>{isUpdatingPassword ? 'Updating...' : 'Set Password'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;