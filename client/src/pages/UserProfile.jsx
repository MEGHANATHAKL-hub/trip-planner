import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TripCard from '../components/trip/TripCard';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await userAPI.getUserProfile(userId);
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <Link to="/users" className="btn-primary">Back to Directory</Link>
        </div>
      </div>
    );
  }

  const isCurrentUser = currentUser && profile.user._id === currentUser.id;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/users" className="text-primary-600 hover:text-primary-800 mb-4 inline-block">
          ← Back to User Directory
        </Link>
        
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.user.username}
                {isCurrentUser && (
                  <span className="ml-2 text-lg text-primary-600 font-normal">(You)</span>
                )}
              </h1>
              <p className="text-gray-600">{profile.user.email}</p>
              <p className="text-sm text-gray-500">
                Member since {formatDate(profile.stats.joinedDate)}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600">{profile.stats.tripsCreated}</div>
              <div className="text-sm text-gray-600">Trips Created</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{profile.stats.collaborations}</div>
              <div className="text-sm text-gray-600">Collaborations</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {profile.stats.tripsCreated + profile.stats.collaborations}
              </div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
          </div>

          {/* Activity Badges */}
          <div className="flex gap-2 mb-4">
            {profile.stats.tripsCreated > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                ✈️ Trip Creator
              </span>
            )}
            {profile.stats.collaborations > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                🤝 Active Collaborator
              </span>
            )}
            {profile.stats.tripsCreated + profile.stats.collaborations === 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                🆕 New Member
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      {profile.recentTrips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Trips {isCurrentUser ? '(Your Trips)' : `by ${profile.user.username}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.recentTrips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDelete={() => {}} // No delete functionality in profile view
              />
            ))}
          </div>
          {profile.stats.tripsCreated > 5 && (
            <div className="text-center mt-4">
              <Link
                to={`/trips?user=${profile.user._id}`}
                className="text-primary-600 hover:text-primary-800"
              >
                View all {profile.stats.tripsCreated} trips →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Recent Collaborations */}
      {profile.recentCollaborations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Collaborations {isCurrentUser ? '(Your Collaborations)' : `by ${profile.user.username}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.recentCollaborations.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDelete={() => {}} // No delete functionality in profile view
              />
            ))}
          </div>
          {profile.stats.collaborations > 5 && (
            <div className="text-center mt-4">
              <Link
                to={`/trips?collaborator=${profile.user._id}`}
                className="text-primary-600 hover:text-primary-800"
              >
                View all {profile.stats.collaborations} collaborations →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {profile.recentTrips.length === 0 && profile.recentCollaborations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">✈️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isCurrentUser ? 'No trips yet' : `${profile.user.username} hasn't created any trips yet`}
          </h3>
          <p className="text-gray-600 mb-4">
            {isCurrentUser 
              ? 'Start planning your first adventure!'
              : 'Check back later to see their travel plans.'
            }
          </p>
          {isCurrentUser && (
            <Link to="/trips/new" className="btn-primary">
              Create Your First Trip
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;