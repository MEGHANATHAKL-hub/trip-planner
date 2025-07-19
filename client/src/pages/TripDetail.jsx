import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tripAPI } from '../utils/api';
import Loading from '../components/common/Loading';
import { useAuth } from '../context/AuthContext';
import CollaboratorManager from '../components/trip/CollaboratorManager';
import ItineraryBuilder from '../components/itinerary/ItineraryBuilder';

const TripDetail = () => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const response = await tripAPI.getTripById(id);
      setTrip(response.data);
    } catch (error) {
      setError('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripAPI.deleteTrip(id);
        navigate('/dashboard');
      } catch (error) {
        setError('Failed to delete trip');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Trip not found</h2>
          <Link to="/dashboard" className="btn-primary mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-800">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.title}</h1>
            <p className="text-lg text-gray-600">{trip.destination}</p>
            <p className="text-sm text-primary-600 mt-2">
              Created by: {trip.userId?.username || 'Unknown User'}
            </p>
          </div>
          {user && trip.userId && (
            (trip.userId._id === user.id || trip.userId === user.id) || 
            trip.collaborators?.some(c => c._id === user.id)
          ) && (
            <div className="flex space-x-3">
              <Link
                to={`/trips/${trip._id}/edit`}
                className="btn-secondary"
              >
                Edit Trip
              </Link>
              {/* Only trip owner can delete */}
              {(trip.userId._id === user.id || trip.userId === user.id) && (
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Delete Trip
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'itinerary'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Itinerary
            </button>
            <button
              onClick={() => setActiveTab('collaborators')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'collaborators'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Collaborators
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trip Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Start Date:</span> {formatDate(trip.startDate)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">End Date:</span> {formatDate(trip.endDate)}
                  </p>
                  {trip.budget > 0 && (
                    <p className="text-gray-600">
                      <span className="font-medium">Budget:</span> ${trip.budget}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">Created:</span> {formatDate(trip.createdAt)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Created by:</span> {trip.userId?.username || 'Unknown User'}
                  </p>
                </div>
              </div>

              {trip.activities && trip.activities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Activities</h3>
                  <ul className="space-y-1">
                    {trip.activities.map((activity, index) => (
                      <li key={index} className="text-gray-600">
                        • {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {trip.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {trip.description}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'itinerary' && (
          <ItineraryBuilder tripId={trip._id} tripDetails={trip} />
        )}

        {activeTab === 'collaborators' && (
          <CollaboratorManager 
            trip={trip} 
            onTripUpdate={setTrip}
          />
        )}
      </div>
    </div>
  );
};

export default TripDetail;