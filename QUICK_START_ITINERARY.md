# Quick Start: Itinerary Builder Implementation Guide

## Why Start with Itinerary Builder?
- Core feature that adds immediate value
- Builds on existing trip structure
- Natural extension of current functionality
- Moderate complexity with high impact

## Implementation Steps

### 1. Database Schema Updates
```javascript
// Add to TripPlan model
itinerary: [{
  day: Number,
  date: Date,
  activities: [{
    name: String,
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
      enum: ['transport', 'accommodation', 'food', 'activity', 'other']
    },
    notes: String,
    cost: Number,
    bookingUrl: String,
    orderIndex: Number
  }]
}]
```

### 2. API Endpoints Needed
- `POST /api/trips/:id/itinerary` - Add itinerary day
- `PUT /api/trips/:id/itinerary/:dayId` - Update day activities
- `DELETE /api/trips/:id/itinerary/:dayId` - Remove day
- `PUT /api/trips/:id/itinerary/reorder` - Reorder activities

### 3. Frontend Components Structure
```
components/
  itinerary/
    ItineraryBuilder.jsx     // Main container
    DayView.jsx             // Single day display
    ActivityCard.jsx        // Individual activity
    ActivityForm.jsx        // Add/edit activity
    TimelineView.jsx        // Timeline visualization
```

### 4. Key Features to Implement
- Drag & drop to reorder activities
- Time conflict detection
- Auto-calculate travel time (if using maps)
- Copy activities between days
- Activity templates

### 5. Sample UI Layout
```
[Day 1 - Monday, Jan 15]
┌─────────────────────────┐
│ 09:00 - 10:00          │
│ 🏨 Hotel Checkout      │
│ Grand Hotel            │
├─────────────────────────┤
│ 10:30 - 12:00          │
│ 🏛️ Museum Visit        │
│ National Museum        │
├─────────────────────────┤
│ 12:30 - 14:00          │
│ 🍽️ Lunch               │
│ Local Restaurant       │
└─────────────────────────┘
[+ Add Activity]
```

Would you like me to start implementing the Itinerary Builder feature?