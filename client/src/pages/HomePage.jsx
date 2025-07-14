import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Organize your travel plans, manage itineraries, and create unforgettable memories
            with our easy-to-use trip planning application.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-4">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Get Started
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose TripPlanner?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-primary-600 text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Planning
              </h3>
              <p className="text-gray-600">
                Create and organize your trip plans with our intuitive interface.
                Add destinations, dates, and activities effortlessly.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-primary-600 text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Budget Tracking
              </h3>
              <p className="text-gray-600">
                Keep track of your travel expenses and stay within your budget
                with our built-in budget management features.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-primary-600 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mobile Friendly
              </h3>
              <p className="text-gray-600">
                Access your trip plans anywhere, anytime. Our responsive design
                works perfectly on all devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;