import React, { useState, useEffect } from 'react';
import { itineraryAPI } from '../../utils/api';
import DayView from './DayView';
import Loading from '../common/Loading';

const ItineraryBuilder = ({ tripId, tripDetails }) => {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    fetchItinerary();
  }, [tripId]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching itinerary for tripId:', tripId);
      
      const response = await itineraryAPI.getItinerary(tripId);
      console.log('Itinerary response:', response.data);
      
      setItinerary(response.data.itinerary);
      setCanEdit(response.data.canEdit || false);
      
      // If no itinerary exists, create days based on trip duration (only if user can edit)
      if (response.data.itinerary.length === 0 && response.data.canEdit) {
        initializeItinerary();
      } else if (response.data.itinerary.length > 0) {
        // Set first day as selected by default
        setSelectedDay(1);
      }
    } catch (err) {
      console.error('Error fetching itinerary:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  const initializeItinerary = () => {
    if (!tripDetails.startDate || !tripDetails.endDate) return;
    
    const start = new Date(tripDetails.startDate);
    const end = new Date(tripDetails.endDate);
    const days = [];
    
    let currentDate = new Date(start);
    let dayNumber = 1;
    
    while (currentDate <= end) {
      days.push({
        day: dayNumber,
        date: new Date(currentDate),
        activities: []
      });
      currentDate.setDate(currentDate.getDate() + 1);
      dayNumber++;
    }
    
    setItinerary(days);
    // Set first day as selected by default
    setSelectedDay(1);
  };

  const handleUpdateDay = async (dayData) => {
    try {
      await itineraryAPI.updateDay(tripId, dayData);
      fetchItinerary();
    } catch (err) {
      console.error('Error updating day:', err);
      setError('Failed to update itinerary');
    }
  };

  const handleDeleteDay = async (day) => {
    if (!window.confirm('Are you sure you want to delete this day?')) return;
    
    try {
      await itineraryAPI.deleteDay(tripId, day);
      fetchItinerary();
    } catch (err) {
      console.error('Error deleting day:', err);
      setError('Failed to delete day');
    }
  };

  const handleReorderActivities = async (day, activities) => {
    try {
      await itineraryAPI.reorderActivities(tripId, { day, activities });
      fetchItinerary();
    } catch (err) {
      console.error('Error reordering activities:', err);
      setError('Failed to reorder activities');
    }
  };

  const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl">📅</span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-responsive-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Trip Itinerary
            </h2>
            <p className="text-gray-600 font-medium text-sm sm:text-base">Plan your daily activities and create a detailed schedule</p>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-4 rounded-xl mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-500 text-lg">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {itinerary.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-white text-4xl">📅</span>
                </div>
                <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Itinerary Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {canEdit 
                  ? "Start planning your trip by adding activities for each day. Create a detailed schedule to make the most of your adventure!"
                  : "This trip doesn't have an itinerary yet. Only the trip creator and collaborators can create one."
                }
              </p>
              {canEdit && (
                <button
                  onClick={initializeItinerary}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  ✨ Create Itinerary
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Day tabs - Mobile responsive */}
              <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                {itinerary.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 touch-target ${
                      selectedDay === day.day
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl'
                        : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 shadow-md border border-white/50'
                    }`}
                  >
                    <div className="text-center min-w-0">
                      <div className="font-bold text-sm sm:text-lg whitespace-nowrap">Day {day.day}</div>
                      <div className="text-xs opacity-80 mt-1 hidden sm:block">
                        {getDayName(day.date)}
                      </div>
                      <div className="text-xs opacity-70 truncate">
                        {formatDate(day.date)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Day content */}
              {selectedDay ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-white/50">
                  <DayView
                    day={itinerary.find(d => d.day === selectedDay)}
                    onUpdateDay={canEdit ? handleUpdateDay : null}
                    onDeleteDay={canEdit ? handleDeleteDay : null}
                    onReorderActivities={canEdit ? handleReorderActivities : null}
                    canEdit={canEdit}
                  />
                </div>
              ) : (
                <div className="text-center py-12 bg-white/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">👆</span>
                  </div>
                  <p className="text-gray-600 font-medium">Select a day above to view and edit activities</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;