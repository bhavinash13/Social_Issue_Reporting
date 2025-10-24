import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Home from './Home';

const Dashboard = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="dashboard-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to access your dashboard.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Link to="/report" className="btn btn-primary raise-issue-btn">
          Raise Issue
        </Link>
      </div>
      <Home />
    </div>
  );
};

export default Dashboard;