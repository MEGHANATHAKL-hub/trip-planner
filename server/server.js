import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import collaboratorRoutes from './routes/collaborators.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://trip-planner-prod.netlify.app', 'https://trip-planner-prod.netlify.app/']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/collaborators', collaboratorRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Trip Planner API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});