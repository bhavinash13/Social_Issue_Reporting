import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API running' });
});

// SPA fallback for React frontend
app.get('/', (req, res) => {
  const frontendPath = path.join(__dirname, '../../client/dist/index.html');
  res.sendFile(frontendPath, (err) => {
    if (err) {
      res.status(404).json({ message: 'Frontend not built. Run: npm run build in client folder' });
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Server error' });
});

// MongoDB connection
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<user>')) {
    console.log('⚠️  MongoDB not configured');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.log('⚠️  MongoDB connection failed:', error.message);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
