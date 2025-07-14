import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripAPI } from '../utils/api';
import TripCard from '../components/trip/TripCard';
import Loading from '../components/common/Loading';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrips();
    
    // Auto-refresh every 30 seconds to sync with other users
    const interval = setInterval(() => {
      loadTrips(false); // Don't show loading spinner for background updates
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadTrips = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await tripAPI.getTrips();
      setTrips(response.data);
      setError(''); // Clear any previous errors
    } catch (error) {
      setError('Failed to load trips');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await tripAPI.deleteTrip(tripId);
      setTrips(trips.filter(trip => trip._id !== tripId));
    } catch (error) {
      setError('Failed to delete trip');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Trips</h1>
          <p className="text-gray-600 mt-1">Discover and share amazing travel plans with the community</p>
        </div>
        <Link to="/trips/new" className="btn-primary">
          Create New Trip
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {trips.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              No trips shared yet
            </h2>
            <p className="text-gray-600 mb-6">
              Be the first to share an amazing travel plan with the community!
            </p>
            <Link to="/trips/new" className="btn-primary">
              Create the First Trip
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;