import User from '../models/User.js';
import TripPlan from '../models/TripPlan.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Upload user profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile photo if it exists
    if (user.profilePhoto) {
      const oldPhotoPath = path.join(__dirname, '../uploads/profiles', user.profilePhoto);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update user with new profile photo
    user.profilePhoto = req.file.filename;
    await user.save();

    res.json({
      message: 'Profile photo uploaded successfully',
      profilePhoto: req.file.filename,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Upload profile photo error:', error);
    
    // Clean up uploaded file if there's an error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/profiles', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload trip photos
export const uploadTripPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const { tripId } = req.params;
    const { captions } = req.body; // Array of captions for each photo

    const trip = await TripPlan.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user has permission to upload photos
    const isOwner = trip.userId.toString() === req.user._id.toString();
    const isCollaborator = trip.collaborators.some(
      collaboratorId => collaboratorId.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'No permission to upload photos' });
    }

    // Process uploaded files
    const newPhotos = req.files.map((file, index) => ({
      filename: file.filename,
      originalName: file.originalname,
      caption: captions && captions[index] ? captions[index] : '',
      uploadedBy: req.user._id
    }));

    // Add photos to trip
    trip.photos.push(...newPhotos);
    await trip.save();

    // Populate the uploaded photos with user info
    await trip.populate('photos.uploadedBy', 'username');

    res.json({
      message: 'Photos uploaded successfully',
      photos: newPhotos,
      trip: trip
    });
  } catch (error) {
    console.error('Upload trip photos error:', error);
    
    // Clean up uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads/trips', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete trip photo
export const deleteTripPhoto = async (req, res) => {
  try {
    const { tripId, photoId } = req.params;

    const trip = await TripPlan.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const photo = trip.photos.id(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Check if user has permission to delete photo
    const isOwner = trip.userId.toString() === req.user._id.toString();
    const isPhotoUploader = photo.uploadedBy.toString() === req.user._id.toString();

    if (!isOwner && !isPhotoUploader) {
      return res.status(403).json({ message: 'No permission to delete this photo' });
    }

    // Delete photo file
    const photoPath = path.join(__dirname, '../uploads/trips', photo.filename);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }

    // Remove photo from trip
    trip.photos.pull(photoId);
    await trip.save();

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete trip photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update photo caption
export const updatePhotoCaption = async (req, res) => {
  try {
    const { tripId, photoId } = req.params;
    const { caption } = req.body;

    const trip = await TripPlan.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const photo = trip.photos.id(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Check if user has permission to edit caption
    const isOwner = trip.userId.toString() === req.user._id.toString();
    const isPhotoUploader = photo.uploadedBy.toString() === req.user._id.toString();

    if (!isOwner && !isPhotoUploader) {
      return res.status(403).json({ message: 'No permission to edit this photo' });
    }

    // Update caption
    photo.caption = caption || '';
    await trip.save();

    res.json({ 
      message: 'Caption updated successfully',
      photo: photo
    });
  } catch (error) {
    console.error('Update photo caption error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile photo
export const getProfilePhoto = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/profiles', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Get profile photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trip photo
export const getTripPhoto = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/trips', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Get trip photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};