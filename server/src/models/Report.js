import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'sanitation', 'road', 'electricity', 'water', 'hospital', 'mosquitos', 'other']
  },
  location: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better search performance
reportSchema.index({ title: 'text', description: 'text' });
reportSchema.index({ category: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ location: 1 });
reportSchema.index({ user: 1 });
reportSchema.index({ createdAt: -1 });

export default mongoose.model('Report', reportSchema);