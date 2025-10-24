import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { reportService } from '../services/reportService';
import ImageUpload from '../components/ImageUpload';

const categories = [
  { value: 'general', label: 'General Issues' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'road', label: 'Road & Infrastructure' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'water', label: 'Water Supply' },
  { value: 'hospital', label: 'Hospital & Healthcare' },
  { value: 'mosquitos', label: 'Mosquito Control' },
  { value: 'other', label: 'Other' }
];

const CreateReport = () => {
  const { loadReports, isAuthenticated } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    location: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const reportFormData = new FormData();
      reportFormData.append('title', formData.title);
      reportFormData.append('description', formData.description);
      reportFormData.append('category', formData.category);
      reportFormData.append('location', formData.location);
      
      images.forEach(image => {
        reportFormData.append('images', image);
      });

      await reportService.createReport(reportFormData);
      await loadReports();
      
      navigate('/my-reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="create-report-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to create a report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-report-container">
      <div className="page-header">
        <h1>Create New Report</h1>
        <p>Report an issue in your community</p>
      </div>

      <div className="report-form-card">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="title">Issue Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the issue"
              rows="5"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading}
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
          </div>

          <div className="form-group">
            <label>Upload Images (Optional)</label>
            <ImageUpload 
              images={images}
              setImages={setImages}
              maxImages={5}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
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
              {loading ? 'Creating Report...' : 'Create Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;