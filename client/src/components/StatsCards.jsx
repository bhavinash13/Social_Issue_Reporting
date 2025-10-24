import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-number">{stats.total}</div>
        <div className="stat-label">Total Reports</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.resolved}</div>
        <div className="stat-label">Resolved Reports</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.inProgress}</div>
        <div className="stat-label">In-Progress Reports</div>
      </div>
    </div>
  );
};

export default StatsCards;