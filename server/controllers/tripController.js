import { validationResult } from 'express-validator';
import TripPlan from '../models/TripPlan.js';

export const getTrips = async (req, res) => {
  try {
    const trips = await TripPlan.find({})
      .populate('userId', 'username email')
      .populate('collaborators', 'username email')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await TripPlan.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('collaborators', 'username email');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Get trip by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTrip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, destination, startDate, endDate, activities, budget } = req.body;

    const trip = new TripPlan({
      title,
      description,
      destination,
      startDate,
      endDate,
      activities: activities || [],
      budget: budget || 0,
      userId: req.user._id
    });

    await trip.save();
    await trip.populate('userId', 'username email');
    await trip.populate('collaborators', 'username email');

    res.status(201).json({
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, destination, startDate, endDate, activities, budget } = req.body;

    const trip = await TripPlan.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Allow owner and collaborators to edit the trip
    const isOwner = trip.userId.toString() === req.user._id.toString();
    const isCollaborator = trip.collaborators.some(
      collaboratorId => collaboratorId.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'You can only edit trips you own or collaborate on' });
    }

    trip.title = title || trip.title;
    trip.description = description || trip.description;
    trip.destination = destination || trip.destination;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;
    trip.activities = activities || trip.activities;
    trip.budget = budget !== undefined ? budget : trip.budget;

    await trip.save();
    await trip.populate('userId', 'username email');
    await trip.populate('collaborators', 'username email');

    res.json({
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await TripPlan.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Only allow the original creator to delete the trip (not collaborators)
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only trip owner can delete the trip' });
    }

    await TripPlan.findByIdAndDelete(req.params.id);

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};