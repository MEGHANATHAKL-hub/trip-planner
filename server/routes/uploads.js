import express from 'express';
import {
  uploadProfilePhoto,
  uploadTripPhotos,
  deleteTripPhoto,
  updatePhotoCaption,
  getProfilePhoto,
  getTripPhoto
} from '../controllers/uploadController.js';
import auth from '../middleware/auth.js';
import { 
  uploadProfilePhoto as uploadProfilePhotoMiddleware, 
  uploadTripPhotos as uploadTripPhotosMiddleware,
  handleUploadError 
} from '../middleware/upload.js';

const router = express.Router();

// Profile photo routes
router.post('/profile-photo', auth, uploadProfilePhotoMiddleware, handleUploadError, uploadProfilePhoto);
router.get('/profile-photo/:filename', getProfilePhoto);

// Trip photo routes
router.post('/trip-photos/:tripId', auth, uploadTripPhotosMiddleware, handleUploadError, uploadTripPhotos);
router.delete('/trip-photos/:tripId/:photoId', auth, deleteTripPhoto);
router.put('/trip-photos/:tripId/:photoId/caption', auth, updatePhotoCaption);
router.get('/trip-photo/:filename', getTripPhoto);

export default router;