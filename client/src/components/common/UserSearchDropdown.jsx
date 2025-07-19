import React, { useState, useEffect, useRef } from 'react';
import { userAPI } from '../../utils/api';

const UserSearchDropdown = ({ onUserSelect, placeholder = "Search users...", excludeUserIds = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchUsers = async (query) => {
    if (!query || query.length < 2) {
      setUsers([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.searchUsers(query);
      // Filter out excluded users (current collaborators and trip owner)
      const filteredUsers = response.data.filter(user => 
        !excludeUserIds.includes(user._id)
      );
      setUsers(filteredUsers);
      setShowDropdown(filteredUsers.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error searching users:', error);
      setUsers([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchUsers(value);
  };

  const handleUserClick = (user) => {
    onUserSelect(user);
    setSearchTerm('');
    setUsers([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || users.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < users.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : users.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < users.length) {
          handleUserClick(users[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const getUserInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (users.length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder}
          className="input-field pr-12"
          autoComplete="off"
        />
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        )}
        
        {!loading && searchTerm && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔍</span>
            </div>
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 glass-card rounded-2xl shadow-xl max-h-60 overflow-y-auto border border-white/20">
          {users.length > 0 ? (
            <ul className="py-2">
              {users.map((user, index) => (
                <li key={user._id}>
                  <button
                    onClick={() => handleUserClick(user)}
                    className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center space-x-3 mx-2 rounded-xl ${
                      index === selectedIndex 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white transform scale-[1.02]' 
                        : 'text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                      index === selectedIndex 
                        ? 'bg-white/20 backdrop-blur-sm' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      {getUserInitials(user.username)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${
                        index === selectedIndex ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.username}
                      </p>
                      <p className={`text-sm truncate ${
                        index === selectedIndex ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {user.email}
                      </p>
                    </div>
                    {index === selectedIndex && (
                      <div className="text-white/80">
                        <span>→</span>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : searchTerm.length >= 2 && !loading ? (
            <div className="px-6 py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">👤</span>
              </div>
              <p className="font-semibold text-gray-900 mb-1">No users found</p>
              <p className="text-sm text-gray-500">for "{searchTerm}"</p>
              <p className="text-xs text-gray-400 mt-2">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
      
      {searchTerm.length > 0 && searchTerm.length < 2 && (
        <div className="flex items-center gap-1 mt-2">
          <span className="text-blue-500 text-sm">💡</span>
          <p className="text-xs text-gray-600 font-medium">
            Type at least 2 characters to search
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSearchDropdown;