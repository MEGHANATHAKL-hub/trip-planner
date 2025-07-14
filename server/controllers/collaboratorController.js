import TripPlan from '../models/TripPlan.js';
import User from '../models/User.js';

export const addCollaborator = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { username } = req.body;

    // Find the trip
    const trip = await TripPlan.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is the owner
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only trip owner can add collaborators' });
    }

    // Find the user to be added as collaborator
    const collaborator = await User.findOne({ username });
    if (!collaborator) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a collaborator
    if (trip.collaborators.includes(collaborator._id)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    // Check if user is the owner (can't add owner as collaborator)
    if (collaborator._id.toString() === trip.userId.toString()) {
      return res.status(400).json({ message: 'Trip owner cannot be added as collaborator' });
    }

    // Add collaborator
    trip.collaborators.push(collaborator._id);
    await trip.save();

    // Populate and return updated trip
    await trip.populate('collaborators', 'username email');
    await trip.populate('userId', 'username email');

    res.json({
      message: 'Collaborator added successfully',
      trip
    });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeCollaborator = async (req, res) => {
  try {
    const { tripId, userId } = req.params;

    // Find the trip
    const trip = await TripPlan.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is the owner
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only trip owner can remove collaborators' });
    }

    // Remove collaborator
    trip.collaborators = trip.collaborators.filter(
      collaboratorId => collaboratorId.toString() !== userId
    );
    await trip.save();

    // Populate and return updated trip
    await trip.populate('collaborators', 'username email');
    await trip.populate('userId', 'username email');

    res.json({
      message: 'Collaborator removed successfully',
      trip
    });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCollaborators = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Find the trip with collaborators populated
    const trip = await TripPlan.findById(tripId)
      .populate('collaborators', 'username email')
      .populate('userId', 'username email');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({
      owner: trip.userId,
      collaborators: trip.collaborators
    });
  } catch (error) {
    console.error('Get collaborators error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};