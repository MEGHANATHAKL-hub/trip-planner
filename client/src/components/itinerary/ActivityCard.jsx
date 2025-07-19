import React from 'react';
import { openLocationInMaps, formatCurrency } from '../../utils/maps';

const ActivityCard = ({ 
  activity, 
  index, 
  totalActivities, 
  onEdit, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  getCategoryIcon,
  canEdit = true
}) => {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };


  const getTimeDisplay = () => {
    const start = formatTime(activity.startTime);
    const end = formatTime(activity.endTime);
    
    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return `From ${start}`;
    } else if (end) {
      return `Until ${end}`;
    }
    return 'Time not set';
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      onDelete();
    }
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      transport: 'from-blue-500 to-blue-600',
      accommodation: 'from-green-500 to-green-600',
      food: 'from-orange-500 to-orange-600',
      activity: 'from-purple-500 to-purple-600',
      sightseeing: 'from-indigo-500 to-indigo-600',
      other: 'from-gray-500 to-gray-600'
    };
    return gradients[category] || gradients.other;
  };

  return (
    <div className="group relative overflow-hidden">
      {/* Glassmorphism card */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative z-10">
        {/* Category accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient(activity.category)} rounded-t-2xl`}></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1 w-full">
            <div className="flex items-start gap-3 mb-3">
              {/* Category icon with gradient background */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${getCategoryGradient(activity.category)} rounded-xl flex items-center justify-center text-white text-lg sm:text-xl shadow-lg flex-shrink-0`}>
                {getCategoryIcon(activity.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">{activity.name}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryGradient(activity.category)} capitalize self-start`}>
                    {activity.category}
                  </span>
                </div>
              </div>
            </div>
          
            {activity.description && (
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{activity.description}</p>
            )}
            
            {/* Activity details in modern cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🕒</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Time</p>
                  <p className="text-sm font-semibold text-gray-900">{getTimeDisplay()}</p>
                </div>
              </div>
              
              {activity.location?.name && (
                <button
                  onClick={() => openLocationInMaps(activity.location)}
                  className="w-full flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 maps-button cursor-pointer touch-target"
                  title="Open in Google Maps"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📍</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs text-gray-500 font-medium">Location (tap to open map)</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{activity.location.name}</p>
                    {activity.location.address && (
                      <p className="text-xs text-gray-600 truncate">{activity.location.address}</p>
                    )}
                  </div>
                  <div className="text-green-600 text-lg">🗺️</div>
                </button>
              )}
              
              {activity.cost > 0 && (
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">💰</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Cost</p>
                    <p className="text-sm font-semibold text-gray-900 currency-display">{formatCurrency(activity.cost)}</p>
                  </div>
                </div>
              )}
              
              {activity.bookingReference && (
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">🎫</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Reference</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{activity.bookingReference}</p>
                  </div>
                </div>
              )}
            </div>
            
            {activity.notes && (
              <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-l-4 border-amber-400">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 text-lg flex-shrink-0">💡</span>
                  <div>
                    <p className="text-amber-800 font-semibold text-sm mb-1">Notes</p>
                    <p className="text-amber-700 text-sm leading-relaxed">{activity.notes}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activity.bookingUrl && (
              <div className="mb-4">
                <a
                  href={activity.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <span>🔗</span>
                  View Booking Details
                  <span>→</span>
                </a>
              </div>
            )}
          </div>
        
          {/* Action buttons - Mobile responsive */}
          <div className="flex sm:flex-col gap-2 sm:ml-6 w-full sm:w-auto">
            {/* Mobile: Horizontal layout, Desktop: Vertical layout */}
            <div className="flex sm:flex-col gap-2 flex-1 sm:flex-none">
              {/* Move buttons - Only show if user can edit */}
              {canEdit && (
                <div className="flex gap-2 sm:flex-col sm:gap-1 flex-1 sm:flex-none">
                  <button
                    onClick={onMoveUp}
                    disabled={index === 0}
                    className="flex-1 sm:flex-none w-full sm:w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 hover:shadow-lg flex items-center justify-center touch-target"
                    title="Move up"
                  >
                    <span className="text-sm sm:text-base">⬆️</span>
                    <span className="ml-1 text-xs sm:hidden">Up</span>
                  </button>
                  <button
                    onClick={onMoveDown}
                    disabled={index === totalActivities - 1}
                    className="flex-1 sm:flex-none w-full sm:w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 hover:shadow-lg flex items-center justify-center touch-target"
                    title="Move down"
                  >
                    <span className="text-sm sm:text-base">⬇️</span>
                    <span className="ml-1 text-xs sm:hidden">Down</span>
                  </button>
                </div>
              )}
              
              {/* Edit/Delete buttons - Only show if user can edit */}
              {canEdit && (
                <div className="flex gap-2 sm:flex-col sm:gap-1 flex-1 sm:flex-none">
                  <button
                    onClick={onEdit}
                    className="flex-1 sm:flex-none w-full sm:w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg flex items-center justify-center touch-target"
                    title="Edit activity"
                  >
                    <span className="text-sm sm:text-base">✏️</span>
                    <span className="ml-1 text-xs sm:hidden">Edit</span>
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="flex-1 sm:flex-none w-full sm:w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg flex items-center justify-center touch-target"
                    title="Delete activity"
                  >
                    <span className="text-sm sm:text-base">🗑️</span>
                    <span className="ml-1 text-xs sm:hidden">Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100/50 to-gray-200/50 rounded-full blur-2xl -z-10"></div>
      </div>
    </div>
  );
};

export default ActivityCard;