import { validationResult } from 'express-validator';
import TripPlan from '../models/TripPlan.js';

export const getTrips = async (req, res) => {
  try {
    const trips = await TripPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await TripPlan.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

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

    const trip = await TripPlan.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    trip.title = title || trip.title;
    trip.description = description || trip.description;
    trip.destination = destination || trip.destination;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;
    trip.activities = activities || trip.activities;
    trip.budget = budget !== undefined ? budget : trip.budget;

    await trip.save();

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
    const trip = await TripPlan.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};