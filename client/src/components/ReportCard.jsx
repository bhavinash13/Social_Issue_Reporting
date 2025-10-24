import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportCard({ report, showActions = false, onStatusUpdate, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (!e.target.closest('select') && !e.target.closest('button')) {
      navigate(`/report/${report._id}`);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card report-card" onClick={handleCardClick}>
      <div className="card-body">
        <div className="report-id-badge">
          #{report._id}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>{report.title}</h3>
          {getStatusBadge(report.status)}
        </div>
        
        <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: '1.6' }}>
          {report.description}
        </p>

        {(report.images && report.images.length > 0) ? (
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <img 
              src={`http://localhost:5000${report.images[0]}`}
              alt="Report"
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '0.5rem'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {report.images.length > 1 && (
              <div className="image-count-badge">
                +{report.images.length - 1}
              </div>
            )}
          </div>
        ) : report.image && (
          <div style={{ marginBottom: '1rem' }}>
            <img 
              src={`http://localhost:5000${report.image}`}
              alt="Report"
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '0.5rem'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          fontSize: '0.875rem', 
          color: '#6b7280',
          marginBottom: showActions ? '1rem' : 0
        }}>
          <span>
            <strong>Category:</strong> {report.category}
          </span>
          {report.location && (
            <span>
              <strong>Location:</strong> {report.location}
            </span>
          )}
          <span>
            <strong>Reported:</strong> {formatDate(report.createdAt)}
          </span>
          {report.user && (
            <span>
              <strong>By:</strong> {report.user.name}
            </span>
          )}
        </div>

        {showActions && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              value={report.status || 'pending'}
              onChange={(e) => onStatusUpdate(report._id, e.target.value)}
              style={{ 
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem'
              }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <button
              onClick={() => onDelete(report._id)}
              className="btn btn-danger"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}