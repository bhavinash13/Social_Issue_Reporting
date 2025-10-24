import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { reportService } from '../services/reportService';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import CommentSection from '../components/CommentSection';

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useApp();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReportById(id);
      setReport(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await reportService.updateReportStatus(id, newStatus);
      setReport(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportService.deleteReport(id);
        navigate('/');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete report');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-badge status-pending',
      'in-progress': 'status-badge status-in-progress',
      resolved: 'status-badge status-resolved',
      rejected: 'status-badge status-rejected'
    };
    
    return (
      <span className={statusClasses[status] || 'status-badge status-pending'}>
        {status || 'pending'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!report) return <div className="error-message">Report not found</div>;

  const isAdmin = authService.isAdmin();
  const isOwner = user && report.user && user.id === report.user._id;

  return (
    <div className="report-details-container">
      <div className="report-details-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        
        {isAdmin && (
          <div className="admin-actions">
            <select
              value={report.status || 'pending'}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={updating}
              className="status-select"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <button
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Delete Report
            </button>
          </div>
        )}
      </div>

      <div className="report-details-content">
        <div className="report-main">
          <div className="report-header">
            <h1>{report.title}</h1>
            {getStatusBadge(report.status)}
          </div>

          <div className="report-meta">
            <div className="meta-item">
              <strong>Category:</strong> {report.category}
            </div>
            {report.location && (
              <div className="meta-item">
                <strong>Location:</strong> {report.location}
              </div>
            )}
            <div className="meta-item">
              <strong>Reported by:</strong> {report.user?.name || 'Anonymous'}
            </div>
            <div className="meta-item">
              <strong>Date:</strong> {formatDate(report.createdAt)}
            </div>
            {report.updatedAt !== report.createdAt && (
              <div className="meta-item">
                <strong>Last updated:</strong> {formatDate(report.updatedAt)}
              </div>
            )}
          </div>

          {(report.images && report.images.length > 0) ? (
            <div className="report-images">
              {report.images.map((image, index) => (
                <div key={index} className="report-image">
                  <img 
                    src={`http://localhost:5000${image}`} 
                    alt={`Report ${index + 1}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          ) : report.image && (
            <div className="report-image">
              <img 
                src={`http://localhost:5000${report.image}`} 
                alt="Report"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="report-description">
            <h3>Description</h3>
            <p>{report.description}</p>
          </div>
        </div>

        <CommentSection 
          reportId={id}
          comments={report.comments || []}
          onCommentsUpdate={loadReport}
        />
      </div>
    </div>
  );
};

export default ReportDetails;