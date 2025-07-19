import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import collaboratorRoutes from './routes/collaborators.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/uploads.js';
import itineraryRoutes from './routes/itinerary.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL?.split(',') || ['https://trip-planner-prod.netlify.app', 'https://trip-planner-xihe.onrender.com']
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Temporarily allow all netlify and onrender domains for debugging
    if (origin && (origin.includes('netlify.app') || origin.includes('onrender.com'))) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/collaborators', collaboratorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/itinerary', itineraryRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Trip Planner API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});