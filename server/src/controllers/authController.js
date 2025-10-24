import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// Mock users for demo when DB is not connected
const mockUsers = [
  { id: '1', name: 'Demo User', email: 'user@demo.com', password: '$2a$10$demo.hash', role: 'user' },
  { id: '2', name: 'Admin User', email: 'admin@demo.com', password: '$2a$10$demo.hash', role: 'admin' }
];

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (!isDBConnected()) {
      // Mock signup for demo
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user'
      };
      mockUsers.push(newUser);
      
      return res.status(201).json({
        message: 'User created (demo mode)',
        user: newUser
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: 'User created',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    if (!isDBConnected()) {
      // Mock login for demo (password: "demo123")
      const user = mockUsers.find(u => u.email === email);
      if (!user || password !== 'demo123') {
        return res.status(400).json({ message: 'Invalid credentials. Use demo123 as password' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};