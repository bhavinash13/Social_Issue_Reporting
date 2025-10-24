import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import ReportCard from '../components/ReportCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getAllReports();
      setReports(data);
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await reportService.updateReportStatus(reportId, newStatus);
      setReports(reports.map(report => 
        report._id === reportId 
          ? { ...report, status: newStatus }
          : report
      ));
      setSuccess(`Report status updated to ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update report status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      await reportService.deleteReport(reportId);
      setReports(reports.filter(report => report._id !== reportId));
      setSuccess('Report deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete report');
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const getStatusCount = (status) => {
    return reports.filter(report => report.status === status).length;
  };

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Manage and track all community reports
        </p>
      </div>

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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 mb-6">
        <div className="card text-center">
          <div className="card-body">
            <h3 style={{ color: '#3b82f6', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
              {reports.length}
            </h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Total Reports</p>
          </div>
        </div>
        <div className="card text-center">
          <div className="card-body">
            <h3 style={{ color: '#f59e0b', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
              {getStatusCount('pending')}
            </h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Pending</p>
          </div>
        </div>
        <div className="card text-center">
          <div className="card-body">
            <h3 style={{ color: '#3b82f6', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
              {getStatusCount('in-progress')}
            </h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>In Progress</p>
          </div>
        </div>
        <div className="card text-center">
          <div className="card-body">
            <h3 style={{ color: '#10b981', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
              {getStatusCount('resolved')}
            </h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Resolved</p>
          </div>
        </div>
        <div className="card text-center">
          <div className="card-body">
            <h3 style={{ color: '#ef4444', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
              {getStatusCount('rejected')}
            </h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Rejected</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card mb-6">
        <div className="card-body">
          <h3 style={{ marginBottom: '1rem' }}>Filter Reports</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'in-progress', 'resolved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.875rem',
                  textTransform: 'capitalize'
                }}
              >
                {status === 'all' ? 'All' : status.replace('-', ' ')}
                {status !== 'all' && (
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    padding: '0.125rem 0.375rem', 
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    {getStatusCount(status)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Management */}
      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>
          Manage Reports ({filteredReports.length})
        </h2>
        
        {filteredReports.length === 0 ? (
          <div className="card">
            <div className="card-body text-center">
              <p style={{ color: '#6b7280', margin: 0 }}>
                {filter === 'all' ? 'No reports found.' : `No ${filter.replace('-', ' ')} reports found.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map(report => (
              <ReportCard 
                key={report._id} 
                report={report}
                showActions={true}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}