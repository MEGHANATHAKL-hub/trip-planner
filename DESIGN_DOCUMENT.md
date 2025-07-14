# TripPlanner Application - Design Document

## 1. Project Overview

### 1.1 Purpose
A full-stack web application for managing trip plans with user authentication, CRUD operations, and responsive design.

### 1.2 Key Features
- User authentication (login/logout/registration)
- Trip plan management (create, read, update, delete)
- Responsive design (mobile and web)
- MongoDB data storage
- Free hosting deployment

## 2. Technology Stack

### 2.1 Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3/Tailwind CSS** - Styling and responsive design
- **React Hook Form** - Form management
- **React Context API** - State management

### 2.2 Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### 2.3 Development Tools
- **Vite** - Build tool for React
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Concurrently** - Run multiple commands

## 3. System Architecture

### 3.1 High-Level Architecture
```
Frontend (React) ↔ Backend API (Node.js/Express) ↔ Database (MongoDB)
```

### 3.2 Project Structure
```
trip-planner/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS files
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── package.json
└── package.json           # Root package.json
```

## 4. Database Design

### 4.1 User Schema
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 TripPlan Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  destination: String,
  startDate: Date,
  endDate: Date,
  activities: [String],
  budget: Number,
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 5. API Endpoints

### 5.1 Authentication Routes
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/me          # Get current user
```

### 5.2 Trip Plan Routes
```
GET    /api/trips          # Get all trips for user
POST   /api/trips          # Create new trip
GET    /api/trips/:id      # Get specific trip
PUT    /api/trips/:id      # Update trip
DELETE /api/trips/:id      # Delete trip
```

## 6. Frontend Components

### 6.1 Page Components
- **LoginPage** - User authentication
- **RegisterPage** - User registration
- **Dashboard** - Main trip list view
- **TripForm** - Create/edit trip form
- **TripDetail** - Individual trip view

### 6.2 Reusable Components
- **Navbar** - Navigation with auth status
- **TripCard** - Trip summary card
- **Loading** - Loading spinner
- **Modal** - Modal dialog
- **Form Components** - Input, Button, etc.

### 6.3 Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+

## 7. Security Features

### 7.1 Authentication
- JWT tokens for session management
- Password hashing with bcrypt
- Protected routes middleware
- Token expiration handling

### 7.2 Data Validation
- Input sanitization
- MongoDB injection prevention
- XSS protection
- CORS configuration

## 8. Deployment Strategy

### 8.1 Frontend Deployment
- **Platform**: Netlify or Vercel (free tier)
- **Build**: React production build
- **Environment**: Production environment variables

### 8.2 Backend Deployment
- **Platform**: Render or Railway (free tier)
- **Database**: MongoDB Atlas (free cluster)
- **Environment**: Secure environment variables

### 8.3 Environment Variables
```
# Backend
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=production

# Frontend
VITE_API_URL=https://your-backend-url.com
```

## 9. Development Phases

### Phase 1: Setup & Authentication
- Project initialization
- Database setup
- User authentication system
- Basic UI components

### Phase 2: Core Features
- Trip CRUD operations
- API integration
- Form handling
- State management

### Phase 3: UI/UX Enhancement
- Responsive design
- Loading states
- Error handling
- User feedback

### Phase 4: Testing & Deployment
- Bug fixes
- Performance optimization
- Production deployment
- Documentation

## 10. File Structure Details

### 10.1 Frontend Structure
```
client/src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Loading.jsx
│   │   └── Modal.jsx
│   └── trip/
│       ├── TripCard.jsx
│       ├── TripForm.jsx
│       └── TripList.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── Dashboard.jsx
│   └── TripDetail.jsx
├── context/
│   └── AuthContext.jsx
├── utils/
│   ├── api.js
│   └── helpers.js
└── App.jsx
```

### 10.2 Backend Structure
```
server/
├── controllers/
│   ├── authController.js
│   └── tripController.js
├── models/
│   ├── User.js
│   └── TripPlan.js
├── routes/
│   ├── auth.js
│   └── trips.js
├── middleware/
│   └── auth.js
└── server.js
```

This design document provides a comprehensive overview of the TripPlanner application. Please review and let me know if you'd like any modifications or have questions about any section.