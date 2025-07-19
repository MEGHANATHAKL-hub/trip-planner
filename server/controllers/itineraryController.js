import TripPlan from '../models/TripPlan.js';

// Get itinerary for a trip - All authenticated users can view
export const getItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const trip = await TripPlan.findById(tripId).select('itinerary title startDate endDate userId collaborators');
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // All authenticated users can view itineraries
    // No access restrictions for viewing
    
    // Determine if current user has edit permissions
    const canEdit = trip.userId.toString() === req.user._id.toString() || 
                   trip.collaborators.includes(req.user._id);
    
    res.json({
      tripTitle: trip.title,
      startDate: trip.startDate,
      endDate: trip.endDate,
      itinerary: trip.itinerary || [],
      canEdit // Include edit permission info
    });
  } catch (error) {
    console.error('Get itinerary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add or update a day in the itinerary
export const updateItineraryDay = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { day, date, activities } = req.body;
    
    const trip = await TripPlan.findById(tripId);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Check if user has edit access
    const hasEditAccess = trip.userId.toString() === req.user._id.toString() || 
                         trip.collaborators.includes(req.user._id);
    
    if (!hasEditAccess) {
      return res.status(403).json({ message: 'Edit access denied' });
    }
    
    // Initialize itinerary if it doesn't exist
    if (!trip.itinerary) {
      trip.itinerary = [];
    }
    
    // Find existing day or create new one
    const existingDayIndex = trip.itinerary.findIndex(d => d.day === day);
    
    if (existingDayIndex !== -1) {
      // Update existing day
      trip.itinerary[existingDayIndex] = {
        day,
        date,
        activities: activities.map((activity, index) => ({
          ...activity,
          orderIndex: index
        }))
      };
    } else {
      // Add new day
      trip.itinerary.push({
        day,
        date,
        activities: activities.map((activity, index) => ({
          ...activity,
          orderIndex: index
        }))
      });
      
      // Sort itinerary by day
      trip.itinerary.sort((a, b) => a.day - b.day);
    }
    
    await trip.save();
    
    res.json({
      message: 'Itinerary updated successfully',
      itinerary: trip.itinerary
    });
  } catch (error) {
    console.error('Update itinerary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a day from the itinerary
export const deleteItineraryDay = async (req, res) => {
  try {
    const { tripId, day } = req.params;
    
    const trip = await TripPlan.findById(tripId);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Check if user has edit access
    const hasEditAccess = trip.userId.toString() === req.user._id.toString() || 
                         trip.collaborators.includes(req.user._id);
    
    if (!hasEditAccess) {
      return res.status(403).json({ message: 'Edit access denied' });
    }
    
    // Remove the day from itinerary
    trip.itinerary = trip.itinerary.filter(d => d.day !== parseInt(day));
    
    // Reorder remaining days
    trip.itinerary = trip.itinerary.map((d, index) => ({
      ...d,
      day: index + 1
    }));
    
    await trip.save();
    
    res.json({
      message: 'Day deleted successfully',
      itinerary: trip.itinerary
    });
  } catch (error) {
    console.error('Delete itinerary day error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reorder activities within a day
export const reorderActivities = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { day, activities } = req.body;
    
    const trip = await TripPlan.findById(tripId);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Check if user has edit access
    const hasEditAccess = trip.userId.toString() === req.user._id.toString() || 
                         trip.collaborators.includes(req.user._id);
    
    if (!hasEditAccess) {
      return res.status(403).json({ message: 'Edit access denied' });
    }
    
    // Find the day and update activities order
    const dayIndex = trip.itinerary.findIndex(d => d.day === day);
    
    if (dayIndex === -1) {
      return res.status(404).json({ message: 'Day not found in itinerary' });
    }
    
    // Update activities with new order
    trip.itinerary[dayIndex].activities = activities.map((activity, index) => ({
      ...activity,
      orderIndex: index
    }));
    
    await trip.save();
    
    res.json({
      message: 'Activities reordered successfully',
      activities: trip.itinerary[dayIndex].activities
    });
  } catch (error) {
    console.error('Reorder activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Copy activities from one day to another
export const copyActivities = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { fromDay, toDay, activityIds } = req.body;
    
    const trip = await TripPlan.findById(tripId);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Check if user has edit access
    const hasEditAccess = trip.userId.toString() === req.user._id.toString() || 
                         trip.collaborators.includes(req.user._id);
    
    if (!hasEditAccess) {
      return res.status(403).json({ message: 'Edit access denied' });
    }
    
    // Find source and target days
    const fromDayData = trip.itinerary.find(d => d.day === fromDay);
    const toDayIndex = trip.itinerary.findIndex(d => d.day === toDay);
    
    if (!fromDayData || toDayIndex === -1) {
      return res.status(404).json({ message: 'Source or target day not found' });
    }
    
    // Copy selected activities
    const activitiesToCopy = fromDayData.activities.filter(activity => 
      activityIds.includes(activity._id.toString())
    );
    
    // Add copied activities to target day
    const newActivities = activitiesToCopy.map((activity, index) => ({
      ...activity.toObject(),
      _id: undefined,
      orderIndex: trip.itinerary[toDayIndex].activities.length + index
    }));
    
    trip.itinerary[toDayIndex].activities.push(...newActivities);
    
    await trip.save();
    
    res.json({
      message: 'Activities copied successfully',
      targetDay: trip.itinerary[toDayIndex]
    });
  } catch (error) {
    console.error('Copy activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};