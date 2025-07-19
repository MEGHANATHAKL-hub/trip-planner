import express from 'express';
import auth from '../middleware/auth.js';
import {
  getItinerary,
  updateItineraryDay,
  deleteItineraryDay,
  reorderActivities,
  copyActivities
} from '../controllers/itineraryController.js';

const router = express.Router();

// Get itinerary for a trip
router.get('/:tripId', auth, getItinerary);

// Add or update a day in the itinerary
router.put('/:tripId/day', auth, updateItineraryDay);

// Delete a day from the itinerary
router.delete('/:tripId/day/:day', auth, deleteItineraryDay);

// Reorder activities within a day
router.put('/:tripId/reorder', auth, reorderActivities);

// Copy activities between days
router.post('/:tripId/copy', auth, copyActivities);

export default router;