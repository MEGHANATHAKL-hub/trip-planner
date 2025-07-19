import React, { useState, useEffect } from 'react';
import ActivityCard from './ActivityCard';
import ActivityForm from './ActivityForm';
import { formatCurrency } from '../../utils/maps';

const DayView = ({ day, onUpdateDay, onDeleteDay, onReorderActivities, canEdit = true }) => {
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activities, setActivities] = useState(day.activities || []);

  // Sync activities when day prop changes
  useEffect(() => {
    setActivities(day.activities || []);
    setShowAddActivity(false); // Close add form when switching days
    setEditingActivity(null); // Close edit form when switching days
  }, [day]);

  const handleAddActivity = (activityData) => {
    const newActivities = [...activities, { ...activityData, orderIndex: activities.length }];
    onUpdateDay({
      day: day.day,
      date: day.date,
      activities: newActivities
    });
    setShowAddActivity(false);
  };

  const handleUpdateActivity = (index, activityData) => {
    const newActivities = [...activities];
    newActivities[index] = { ...activityData, orderIndex: index };
    onUpdateDay({
      day: day.day,
      date: day.date,
      activities: newActivities
    });
    setEditingActivity(null);
  };

  const handleDeleteActivity = (index) => {
    const newActivities = activities.filter((_, i) => i !== index);
    // Re-index activities
    const reindexedActivities = newActivities.map((activity, i) => ({
      ...activity,
      orderIndex: i
    }));
    onUpdateDay({
      day: day.day,
      date: day.date,
      activities: reindexedActivities
    });
  };

  const handleMoveActivity = (fromIndex, direction) => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= activities.length) return;
    
    const newActivities = [...activities];
    const [movedActivity] = newActivities.splice(fromIndex, 1);
    newActivities.splice(toIndex, 0, movedActivity);
    
    // Re-index activities
    const reindexedActivities = newActivities.map((activity, i) => ({
      ...activity,
      orderIndex: i
    }));
    
    onReorderActivities(day.day, reindexedActivities);
  };

  const calculateTotalCost = () => {
    return activities.reduce((total, activity) => total + (activity.cost || 0), 0);
  };


  const getCategoryIcon = (category) => {
    const icons = {
      transport: '🚗',
      accommodation: '🏨',
      food: '🍽️',
      activity: '🎯',
      sightseeing: '🏛️',
      other: '📌'
    };
    return icons[category] || '📌';
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header - Mobile responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mx-auto sm:mx-0">
            <span className="text-white text-xl sm:text-2xl font-bold">{day.day}</span>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-responsive-lg font-bold text-gray-900">
              Day {day.day} Activities
            </h3>
            <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 mt-2 sm:mt-1">
              <div className="flex items-center space-x-1">
                <span className="text-blue-500">📊</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">{activities.length} activities</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-green-500">💰</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">{formatCurrency(calculateTotalCost())}</span>
              </div>
            </div>
          </div>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowAddActivity(true)}
            className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto touch-target"
          >
            <span>➕</span>
            <span className="hidden sm:inline">Add Activity</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {activities.length === 0 && !showAddActivity ? (
        <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white text-3xl">🗓️</span>
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-ping opacity-20"></div>
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">No activities planned yet</h4>
          <p className="text-gray-600 mb-6">
            {canEdit 
              ? "Start planning your day by adding your first activity"
              : "This day doesn't have any activities planned yet"
            }
          </p>
          {canEdit && (
            <button
              onClick={() => setShowAddActivity(true)}
              className="btn-primary px-8 py-3"
            >
              ✨ Add your first activity
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="relative">
              {editingActivity === index && canEdit ? (
                <div className="mb-4">
                  <ActivityForm
                    activity={activity}
                    onSave={(data) => handleUpdateActivity(index, data)}
                    onCancel={() => setEditingActivity(null)}
                  />
                </div>
              ) : (
                <ActivityCard
                  activity={activity}
                  index={index}
                  totalActivities={activities.length}
                  onEdit={canEdit ? () => setEditingActivity(index) : null}
                  onDelete={canEdit ? () => handleDeleteActivity(index) : null}
                  canEdit={canEdit}
                  onMoveUp={() => handleMoveActivity(index, 'up')}
                  onMoveDown={() => handleMoveActivity(index, 'down')}
                  getCategoryIcon={getCategoryIcon}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {showAddActivity && (
        <div className="mt-4">
          <ActivityForm
            onSave={handleAddActivity}
            onCancel={() => setShowAddActivity(false)}
          />
        </div>
      )}

      {/* Day Summary - Mobile responsive */}
      {activities.length > 0 && (
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl border border-indigo-200">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 text-center sm:text-left">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
              <span className="text-white text-lg">📋</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900">Day Summary</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-indigo-600">{activities.length}</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Activities</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(calculateTotalCost())}</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Total Cost</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
              <div className="text-sm sm:text-lg font-bold text-blue-600">
                {activities[0]?.startTime || '--:--'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Start Time</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
              <div className="text-sm sm:text-lg font-bold text-purple-600">
                {activities[activities.length - 1]?.endTime || '--:--'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">End Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayView;