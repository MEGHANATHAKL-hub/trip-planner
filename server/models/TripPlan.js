import mongoose from 'mongoose';

const tripPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
    maxlength: [100, 'Destination cannot exceed 100 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  activities: [{
    type: String,
    trim: true,
    maxlength: [200, 'Activity cannot exceed 200 characters']
  }],
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative'],
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  photos: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: ''
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    activities: [{
      name: {
        type: String,
        required: true
      },
      description: String,
      startTime: String,
      endTime: String,
      location: {
        name: String,
        address: String,
        coordinates: {
          lat: Number,
          lng: Number
        }
      },
      category: {
        type: String,
        enum: ['transport', 'accommodation', 'food', 'activity', 'sightseeing', 'other'],
        default: 'activity'
      },
      notes: String,
      cost: {
        type: Number,
        default: 0
      },
      bookingUrl: String,
      bookingReference: String,
      orderIndex: {
        type: Number,
        required: true
      }
    }]
  }]
}, {
  timestamps: true
});

const TripPlan = mongoose.model('TripPlan', tripPlanSchema);

export default TripPlan;