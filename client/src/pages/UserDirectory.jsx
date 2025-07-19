import React, { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/user/UserCard';
import Pagination from '../components/common/Pagination';

const UserDirectory = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching users - isAdmin:', isAdmin, 'user role:', user?.role);
      
      const params = {
        limit: pagination.limit,
        skip: (page - 1) * pagination.limit
      };
      
      if (search.trim()) {
        params.search = search.trim();
      }
      
      console.log('API call params:', params);
      const response = await userAPI.getUsers(params);
      console.log('API response:', response.data);
      
      setUsers(response.data.users);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination,
        page
      }));
    } catch (err) {
      console.error('Error fetching users:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('UserDirectory useEffect - isAdmin:', isAdmin, 'user:', user);
    console.log('User role:', user?.role);
    console.log('Token exists:', !!localStorage.getItem('token'));
    
    if (!user) {
      console.log('No user found, redirecting to login');
      setError('Please log in to access the user directory.');
      setLoading(false);
      return;
    }
    
    if (!isAdmin) {
      console.log('User is not admin. User role:', user.role);
      setError('Access denied. Only administrators can view the user directory.');
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [isAdmin, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, searchTerm);
  };

  const handlePageChange = (page) => {
    fetchUsers(page, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchUsers(1, '');
  };

  const handleDeleteUser = async (userId, username) => {
    if (!isAdmin) {
      setError('Only administrators can delete user accounts');
      return;
    }

    const confirmMessage = `Are you sure you want to delete the user "${username}"? This action cannot be undone and will:
    
• Delete their account permanently
• Remove all their trips
• Remove them from collaborations

Type "DELETE" to confirm:`;

    const confirmation = window.prompt(confirmMessage);
    
    if (confirmation !== 'DELETE') {
      return;
    }

    try {
      setLoading(true);
      await userAPI.deleteUser(userId);
      
      // Refresh the user list
      await fetchUsers(pagination.page, searchTerm);
      
      // Show success message
      setError(''); // Clear any previous errors
      alert(`User "${username}" has been successfully deleted.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    // Update the user's role in the local state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === userId 
          ? { ...user, role: newRole }
          : user
      )
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">👑</span>
          </div>
          <div>
            <h1 className="text-responsive-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Admin Panel - User Directory
            </h1>
            <p className="text-gray-600">Manage user accounts and monitor platform activity</p>
          </div>
        </div>
        
        {isAdmin && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 rounded-xl">
            <div className="flex items-center">
              <span className="text-red-500 text-lg mr-2">⚠️</span>
              <div>
                <p className="text-red-800 font-semibold text-sm">Administrator Access</p>
                <p className="text-red-700 text-sm">You have administrative privileges to view and manage user accounts.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* User Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {searchTerm ? (
            <>Showing {users.length} of {pagination.total} users for "{searchTerm}"</>
          ) : (
            <>Showing {users.length} of {pagination.total} users</>
          )}
        </p>
      </div>

      {/* Users Grid */}
      {users.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {users.map((userData) => (
              <UserCard
                key={userData._id}
                user={userData}
                currentUser={user}
                isAdmin={isAdmin}
                onDeleteUser={handleDeleteUser}
                onUserRoleUpdate={handleUserRoleUpdate}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No users found' : 'No users yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms or browse all users.'
              : 'Be the first to join the trip planning community!'
            }
          </p>
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="btn-primary"
            >
              Browse All Users
            </button>
          )}
        </div>
      )}

      {/* Loading overlay for pagination */}
      {loading && users.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDirectory;