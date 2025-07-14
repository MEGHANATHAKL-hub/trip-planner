import express from 'express';
import { body } from 'express-validator';
import { addCollaborator, removeCollaborator, getCollaborators } from '../controllers/collaboratorController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get collaborators for a trip
router.get('/:tripId', auth, getCollaborators);

// Add collaborator to a trip
router.post('/:tripId', auth, [
  body('username')
    .isLength({ min: 1 })
    .withMessage('Username is required')
    .trim()
], addCollaborator);

// Remove collaborator from a trip
router.delete('/:tripId/:userId', auth, removeCollaborator);

export default router;