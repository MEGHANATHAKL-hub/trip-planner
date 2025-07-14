# TripPlanner - Full Stack Application

A comprehensive trip planning application built with React, Node.js, Express, and MongoDB. Users can create accounts, manage trip plans, and organize their travel itineraries.

## Features

- **User Authentication**: Register, login, and logout functionality
- **Trip Management**: Create, read, update, and delete trip plans
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Trip Details**: Add destinations, dates, activities, and budget information
- **Secure API**: JWT-based authentication with password hashing

## Tech Stack

### Frontend
- React 19 with Vite
- React Router DOM for navigation
- Tailwind CSS for styling
- Axios for API calls
- React Hook Form for form handling

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trip-planner
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Configuration**
   
   **Server (.env)**
   ```bash
   cd server
   cp .env.example .env
   ```
   Edit the `.env` file with your MongoDB connection string and JWT secret:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tripplanner?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```

   **Client (.env)**
   ```bash
   cd client
   cp .env.example .env
   ```
   The default API URL should work for local development:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the application**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the frontend (http://localhost:5173) and backend (http://localhost:5000) servers.

## Project Structure

```
trip-planner/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Trip Management
- `GET /api/trips` - Get all trips for user
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get specific trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

## Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run install-all` - Install dependencies for all packages
- `npm run build` - Build the frontend for production
- `npm start` - Start the backend server

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (server/)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## MongoDB Setup

1. Create a free MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get the connection string and add it to your `.env` file
5. Make sure to whitelist your IP address in the Network Access settings

## Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `cd client && npm run build`
2. Deploy the `dist` folder to Netlify or Vercel
3. Set the environment variable: `VITE_API_URL=https://your-backend-url.com/api`

### Backend (Render/Railway)
1. Deploy the `server` folder to Render or Railway
2. Set the environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License.