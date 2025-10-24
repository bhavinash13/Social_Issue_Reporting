import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { reportService } from '../services/reportService';
import ReportCard from '../components/ReportCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyReports = () => {
  const { user, isAuthenticated } = useApp();
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadMyReports();
    }
  }, [isAuthenticated]);

  const loadMyReports = async () => {
    try {
      setLoading(true);
      const reports = await reportService.getMyReports();
      setMyReports(Array.isArray(reports) ? reports : []);
    } catch (err) {
      setError('Failed to load your reports');
      setMyReports([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="my-reports-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to view your reports.</p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="my-reports-container">
      <div className="page-header">
        <h1>My Reports</h1>
        <p>Reports submitted by {user?.name}</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="my-reports-stats">
        <div className="stat-card">
          <div className="stat-number">{myReports.length}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {myReports.filter(r => r.status === 'pending').length}
          </div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {myReports.filter(r => r.status === 'resolved').length}
          </div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="reports-section">
        {myReports.length === 0 ? (
          <div className="no-reports">
            <h3>No Reports Yet</h3>
            <p>You haven't submitted any reports yet.</p>
            <a href="/report" className="btn btn-primary">
              Submit Your First Report
            </a>
          </div>
        ) : (
          <div className="reports-grid">
            {myReports.map(report => (
              <ReportCard 
                key={report._id} 
                report={report}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;