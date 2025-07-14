import React from 'react';
import { Link } from 'react-router-dom';

const TripCard = ({ trip, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      onDelete(trip._id);
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{trip.title}</h3>
        <div className="flex space-x-2">
          <Link
            to={`/trips/${trip._id}/edit`}
            className="text-primary-600 hover:text-primary-800 text-sm"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-600">
          <span className="font-medium">Destination:</span> {trip.destination}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Dates:</span> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
        {trip.budget > 0 && (
          <p className="text-gray-600">
            <span className="font-medium">Budget:</span> ${trip.budget}
          </p>
        )}
      </div>

      {trip.description && (
        <p className="text-gray-700 mb-4 line-clamp-3">
          {trip.description}
        </p>
      )}

      {trip.activities && trip.activities.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Activities:</h4>
          <ul className="space-y-1">
            {trip.activities.slice(0, 3).map((activity, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {activity}
              </li>
            ))}
            {trip.activities.length > 3 && (
              <li className="text-sm text-gray-500">
                ...and {trip.activities.length - 3} more
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Link
          to={`/trips/${trip._id}`}
          className="btn-primary text-sm"
        >
          View Details
        </Link>
        <p className="text-xs text-gray-500">
          Created {formatDate(trip.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default TripCard;