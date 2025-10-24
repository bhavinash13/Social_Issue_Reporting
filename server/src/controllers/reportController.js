import mongoose from 'mongoose';
import Report from '../models/Report.js';
import Comment from '../models/Comment.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// Mock reports for demo when DB is not connected
let mockReports = [
  {
    _id: '1',
    title: 'Broken Street Light',
    description: 'Street light on Main St has been out for 3 days, creating safety concerns for pedestrians.',
    category: 'electricity',
    location: 'Main Street, Downtown',
    status: 'pending',
    images: [],
    user: { _id: '1', name: 'Demo User', email: 'user@demo.com' },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    title: 'Pothole on Highway',
    description: 'Large pothole causing damage to vehicles. Needs immediate attention.',
    category: 'road',
    location: 'Highway 101, Mile Marker 15',
    status: 'in-progress',
    images: [],
    user: { _id: '2', name: 'Admin User', email: 'admin@demo.com' },
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16')
  },
  {
    _id: '3',
    title: 'Overflowing Garbage Bin',
    description: 'Public garbage bin near the park is overflowing and attracting pests.',
    category: 'sanitation',
    location: 'Central Park, North Entrance',
    status: 'resolved',
    images: [],
    user: { _id: '1', name: 'Demo User', email: 'user@demo.com' },
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-17')
  },
  {
    _id: '4',
    title: 'Hospital Equipment Shortage',
    description: 'Local hospital is facing shortage of basic medical equipment.',
    category: 'hospital',
    location: 'City General Hospital',
    status: 'pending',
    images: [],
    user: { _id: '1', name: 'Demo User', email: 'user@demo.com' },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    _id: '5',
    title: 'Mosquito Breeding in Stagnant Water',
    description: 'Stagnant water in construction site creating mosquito breeding ground.',
    category: 'mosquitos',
    location: 'Construction Site, Oak Avenue',
    status: 'pending',
    images: [],
    user: { _id: '2', name: 'Admin User', email: 'admin@demo.com' },
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  }
];

// Mock comments for demo
let mockComments = [
  {
    _id: 'c1',
    content: 'I reported this issue last week. Still not fixed!',
    report: '1',
    parentComment: null,
    replies: [],
    user: { _id: '1', name: 'Demo User', email: 'user@demo.com' },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    _id: 'c2',
    content: 'Work crew was here yesterday. Should be fixed soon.',
    report: '2',
    parentComment: null,
    replies: ['c3'],
    user: { _id: '2', name: 'Admin User', email: 'admin@demo.com' },
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    _id: 'c3',
    content: 'Thanks for the update!',
    report: '2',
    parentComment: 'c2',
    replies: [],
    user: { _id: '1', name: 'Demo User', email: 'user@demo.com' },
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  }
];

export const createReport = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, category required' });
    }

    if (!isDBConnected()) {
      // Mock report creation for demo
      const newReport = {
        _id: Date.now().toString(),
        title,
        description,
        category,
        location: location || '',
        status: 'pending',
        user: { _id: req.user.id, name: req.user.name, email: req.user.email },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (req.files && req.files.length > 0) {
        newReport.images = req.files.map(file => `/uploads/${file.filename}`);
      } else {
        newReport.images = [];
      }

      mockReports.unshift(newReport);
      return res.status(201).json(newReport);
    }

    const reportData = {
      title,
      description,
      category,
      location: location || '',
      user: req.user._id
    };

    if (req.files && req.files.length > 0) {
      reportData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const report = await Report.create(reportData);
    await report.populate('user', 'name email');
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const { category, status, location, search, page = 1, limit = 10 } = req.query;

    if (!isDBConnected()) {
      // Filter mock reports for demo
      let filtered = [...mockReports];
      
      if (category) filtered = filtered.filter(r => r.category === category);
      if (status) filtered = filtered.filter(r => r.status === status);
      if (location) filtered = filtered.filter(r => r.location.toLowerCase().includes(location.toLowerCase()));
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(r => 
          r.title.toLowerCase().includes(searchLower) || 
          r.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Simple pagination for demo
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedResults = filtered.slice(startIndex, endIndex);
      
      // For demo mode, return simple array for compatibility
      return res.json(filtered);
    }

    let query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const reports = await Report.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const totalReports = await Report.countDocuments(query);
    
    res.json({
      reports,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: parseInt(page),
      totalReports
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      // Get mock report with comments for demo
      const report = mockReports.find(r => r._id === id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      
      const comments = mockComments.filter(c => c.report === id);
      return res.json({ ...report, comments });
    }

    const report = await Report.findById(id)
      .populate('user', 'name email');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const comments = await Comment.find({ report: id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ ...report.toObject(), comments });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid report ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyReports = async (req, res) => {
  try {
    if (!isDBConnected()) {
      // Return user's mock reports for demo
      const userReports = mockReports.filter(report => report.user._id === req.user.id);
      return res.json(userReports);
    }

    const reports = await Report.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'in-progress', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (!isDBConnected()) {
      // Update mock report for demo
      const reportIndex = mockReports.findIndex(r => r._id === id);
      if (reportIndex === -1) {
        return res.status(404).json({ message: 'Report not found' });
      }

      mockReports[reportIndex].status = status;
      mockReports[reportIndex].updatedAt = new Date();
      return res.json(mockReports[reportIndex]);
    }

    const report = await Report.findByIdAndUpdate(id, { status }, { new: true })
      .populate('user', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid report ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      // Delete mock report for demo
      const reportIndex = mockReports.findIndex(r => r._id === id);
      if (reportIndex === -1) {
        return res.status(404).json({ message: 'Report not found' });
      }

      mockReports.splice(reportIndex, 1);
      return res.json({ message: 'Report deleted' });
    }

    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid report ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Comment Controllers
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDBConnected()) {
      const comments = mockComments.filter(c => c.report === id && !c.parentComment);
      const commentsWithReplies = comments.map(comment => ({
        ...comment,
        replies: mockComments.filter(c => c.parentComment === comment._id)
      }));
      return res.json(commentsWithReplies);
    }

    const comments = await Comment.find({ report: id, parentComment: null })
      .populate('user', 'name email')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content required' });
    }

    if (!isDBConnected()) {
      // Add mock comment for demo
      const report = mockReports.find(r => r._id === id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      const newComment = {
        _id: Date.now().toString(),
        content: content.trim(),
        report: id,
        user: { _id: req.user.id, name: req.user.name, email: req.user.email },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockComments.unshift(newComment);
      return res.status(201).json(newComment);
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const comment = await Comment.create({
      content: content.trim(),
      report: id,
      user: req.user._id
    });

    await comment.populate('user', 'name email');
    res.status(201).json(comment);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid report ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content required' });
    }

    if (!isDBConnected()) {
      // Update mock comment for demo
      const commentIndex = mockComments.findIndex(c => c._id === commentId);
      if (commentIndex === -1) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const comment = mockComments[commentIndex];
      if (comment.user._id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      mockComments[commentIndex].content = content.trim();
      mockComments[commentIndex].updatedAt = new Date();
      return res.json(mockComments[commentIndex]);
    }

    const comment = await Comment.findById(commentId).populate('user', 'name email');
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = content.trim();
    await comment.save();
    res.json(comment);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!isDBConnected()) {
      // Delete mock comment for demo
      const commentIndex = mockComments.findIndex(c => c._id === commentId);
      if (commentIndex === -1) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const comment = mockComments[commentIndex];
      if (comment.user._id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      mockComments.splice(commentIndex, 1);
      return res.json({ message: 'Comment deleted' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Reply content required' });
    }

    if (!isDBConnected()) {
      const parentComment = mockComments.find(c => c._id === commentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const newReply = {
        _id: Date.now().toString(),
        content: content.trim(),
        report: parentComment.report,
        parentComment: commentId,
        user: { _id: req.user.id, name: req.user.name, email: req.user.email },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockComments.push(newReply);
      return res.status(201).json(newReply);
    }

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = await Comment.create({
      content: content.trim(),
      report: parentComment.report,
      parentComment: commentId,
      user: req.user._id
    });

    parentComment.replies.push(reply._id);
    await parentComment.save();

    await reply.populate('user', 'name email');
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};