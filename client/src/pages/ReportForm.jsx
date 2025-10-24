import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { reportService } from '../services/reportService';

export default function ReportForm() {
  const { dispatch, loadReports } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    location: ''
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'sanitation', label: 'Sanitation' },
    { value: 'road', label: 'Road & Infrastructure' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'water', label: 'Water Supply' },
    { value: 'safety', label: 'Safety & Security' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setImage(file);
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return 'Title is required';
    }
    
    if (formData.title.length < 5) {
      return 'Title must be at least 5 characters long';
    }
    
    if (!formData.description.trim()) {
      return 'Description is required';
    }
    
    if (formData.description.length < 10) {
      return 'Description must be at least 10 characters long';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const reportData = {
        ...formData,
        image
      };
      
      const newReport = await reportService.createReport(reportData);
      dispatch({ type: 'ADD_REPORT', payload: newReport });
      setSuccess('Report submitted successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/my-reports');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="card-header">
            <h2 style={{ margin: 0, color: '#1f2937' }}>Report an Issue</h2>
            <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
              Help improve your community by reporting issues that need attention
            </p>
          </div>
          
          <div className="card-body">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Issue Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief description of the issue"
                  disabled={loading}
                  required
                />
                <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Minimum 5 characters
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="description">Detailed Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide detailed information about the issue, including when you noticed it and how it affects the community"
                  rows="5"
                  disabled={loading}
                  required
                />
                <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Minimum 10 characters
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Street address, landmark, or area description"
                  disabled={loading}
                />
                <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Optional: Help others locate the issue
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="image">Upload Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Optional: Maximum file size 5MB. Supported formats: JPG, PNG, GIF
                </small>
                
                {image && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ color: '#10b981', fontSize: '0.875rem', margin: 0 }}>
                      ✓ Image selected: {image.name}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}