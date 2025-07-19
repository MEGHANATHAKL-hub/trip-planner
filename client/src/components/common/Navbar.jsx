import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="glass-card sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              onClick={closeMobileMenu}
            >
              {/* Animated Logo Icon */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-white text-2xl font-bold transform transition-transform duration-300 group-hover:scale-110">✈️</span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300"></div>
              </div>
              
              {/* Enhanced Text Logo */}
              <div className="flex flex-col">
                <div className="relative">
                  {/* Main text with gradient and animation */}
                  <span className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transform transition-all duration-300 group-hover:scale-105">
                    TripPlanner
                  </span>
                  
                  {/* Shimmer effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-700 group-hover:translate-x-full"></div>
                </div>
                
                {/* Subtitle */}
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider transform transition-all duration-300 group-hover:text-purple-600 -mt-1 hidden sm:block">
                  Plan • Explore • Discover
                </span>
              </div>
              
              {/* Decorative elements */}
              <div className="hidden lg:flex items-center space-x-1 ml-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/50"
                >
                  📊 Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/users"
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-red-50 border border-red-200"
                    title="Admin Panel - User Management"
                  >
                    👑 Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-white/60 rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isAdmin 
                        ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                        : 'bg-gradient-to-r from-green-400 to-blue-500'
                    }`}>
                      <span className="text-white text-sm font-bold">
                        {isAdmin ? '👑' : user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden lg:block">
                      <span className="text-gray-700 text-sm font-medium">
                        {user?.username}
                      </span>
                      {isAdmin && (
                        <span className="block text-xs text-red-600 font-bold">
                          Administrator
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/50"
                >
                  🔑 Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm py-2 px-4"
                >
                  ✨ Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-2 pt-2 pb-4 space-y-2 bg-white/80 backdrop-blur-sm rounded-xl mt-2 border border-white/20">
            {isAuthenticated ? (
              <>
                {/* User info in mobile */}
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl mb-3 ${
                  isAdmin 
                    ? 'bg-gradient-to-r from-red-50 to-pink-50' 
                    : 'bg-gradient-to-r from-blue-50 to-purple-50'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isAdmin 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                      : 'bg-gradient-to-r from-green-400 to-blue-500'
                  }`}>
                    <span className="text-white text-lg font-bold">
                      {isAdmin ? '👑' : user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">{user?.username}</p>
                    <p className={`text-sm ${isAdmin ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                      {isAdmin ? '👑 Administrator' : 'Welcome back!'}
                    </p>
                  </div>
                </div>
                
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-white/60 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  <span className="text-lg">📊</span>
                  <span>Dashboard</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/users"
                    className="flex items-center space-x-3 text-gray-700 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border border-red-200"
                    onClick={closeMobileMenu}
                  >
                    <span className="text-lg">👑</span>
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                >
                  <span className="text-lg">🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-white/60 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  <span className="text-lg">🔑</span>
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center space-x-2 btn-primary text-sm py-3 px-4 mx-2 mt-2"
                  onClick={closeMobileMenu}
                >
                  <span>✨</span>
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;