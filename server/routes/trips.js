import express from 'express';
import { body } from 'express-validator';
import { getTrips, getTripById, createTrip, updateTrip, deleteTrip } from '../controllers/tripController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const tripValidation = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
    .trim(),
  body('destination')
    .isLength({ min: 1, max: 100 })
    .withMessage('Destination must be between 1 and 100 characters')
    .trim(),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array'),
  body('budget')
    .optional()
    .isNumeric()
    .withMessage('Budget must be a number')
    .isFloat({ min: 0 })
    .withMessage('Budget cannot be negative')
];

router.get('/', auth, getTrips);
router.get('/:id', auth, getTripById);
router.post('/', auth, tripValidation, createTrip);
router.put('/:id', auth, tripValidation, updateTrip);
router.delete('/:id', auth, deleteTrip);

export default router;