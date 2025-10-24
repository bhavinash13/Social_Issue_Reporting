import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { reportService } from '../services/reportService';
import { authService } from '../services/authService';
import ReportCard from '../components/ReportCard';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminPanel = () => {
  const { reports, loadReports } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const isAdmin = authService.isAdmin();

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      setLoading(true);
      await reportService.updateReportStatus(reportId, newStatus);
      await loadReports();
      setError(null);
    } catch (err) {
      setError('Failed to update report status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        setLoading(true);
        await reportService.deleteReport(reportId);
        await loadReports();
        setError(null);
      } catch (err) {
        setError('Failed to delete report');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredReports = statusFilter 
    ? reports.filter(r => r.status === statusFilter)
    : reports;

  if (!isAdmin) {
    return (
      <div className="admin-panel-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage all reports and moderate content</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{reports.length}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {reports.filter(r => r.status === 'pending').length}
          </div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {reports.filter(r => r.status === 'in-progress').length}
          </div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {reports.filter(r => r.status === 'resolved').length}
          </div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="admin-filters">
        <h3>Filter by Status</h3>
        <div className="status-filter-buttons">
          <button 
            className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
            onClick={() => setStatusFilter('')}
          >
            All Reports
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'resolved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('resolved')}
          >
            Resolved
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      <div className="admin-reports-section">
        <h2>
          {statusFilter ? 
            `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Reports` : 
            'All Reports'
          } ({filteredReports.length})
        </h2>
        
        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <p>No reports found for the selected filter.</p>
          </div>
        ) : (
          <div className="reports-grid">
            {filteredReports.map(report => (
              <ReportCard 
                key={report._id} 
                report={report}
                showActions={true}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDeleteReport}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;