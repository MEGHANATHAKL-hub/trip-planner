import express from 'express';
import { getUsers, getUserProfile, searchUsers, deleteUser, updateUserRole, updateUserPassword } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import { requireAdmin, requireAdminOrSelf } from '../middleware/admin.js';

const router = express.Router();

// Admin-only: Get all users with pagination and search
router.get('/', auth, requireAdmin, getUsers);

// Search users (for quick lookup) - available to all authenticated users
router.get('/search', auth, searchUsers);

// Get specific user profile - admin can view anyone, users can view their own
router.get('/:userId', auth, requireAdminOrSelf, getUserProfile);

// Admin-only: Update user role (promote/demote admin)
router.put('/:userId/role', auth, requireAdmin, updateUserRole);

// Admin-only: Update user password
router.put('/:userId/password', auth, requireAdmin, updateUserPassword);

// Admin-only: Delete user account
router.delete('/:userId', auth, requireAdmin, deleteUser);

export default router;