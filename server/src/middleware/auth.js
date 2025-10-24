import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// Mock users for demo mode
const mockUsers = [
  { id: '1', name: 'Demo User', email: 'user@demo.com', role: 'user' },
  { id: '2', name: 'Admin User', email: 'admin@demo.com', role: 'admin' }
];

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');

    if (!isDBConnected()) {
      // Use mock user for demo mode
      const user = mockUsers.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = user;
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminAuth = (req, res, next) => {
  auth(req, res, (err) => {
    if (err) return next(err);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};