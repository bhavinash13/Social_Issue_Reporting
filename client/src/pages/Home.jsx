import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ReportCard from '../components/ReportCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  { id: '', name: 'All' },
  { id: 'general', name: 'General' },
  { id: 'sanitation', name: 'Sanitation' },
  { id: 'road', name: 'Road' },
  { id: 'electricity', name: 'Electricity' },
  { id: 'water', name: 'Water' },
  { id: 'hospital', name: 'Hospital' },
  { id: 'mosquitos', name: 'Mosquitos' },
  { id: 'other', name: 'Other' }
];

const Home = () => {
  const { reports, loading, error } = useApp();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = useMemo(() => {
    if (!Array.isArray(reports)) return [];
    
    return reports.filter(report => {
      const matchesCategory = !categoryFilter || report.category === categoryFilter;
      const matchesSearch = !searchTerm || 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [reports, categoryFilter, searchTerm]);

  const stats = useMemo(() => ({
    total: reports.length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length
  }), [reports]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Social Issues</h1>
        <p>Community Issue Reporting Platform</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search issues..."
            className="search-input"
          />
        </div>
      </div>

      <div className="filter-section">
        <h3>Filter by Category</h3>
        <div className="category-scroll">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-filter-btn ${categoryFilter === category.id ? 'active' : ''}`}
              onClick={() => setCategoryFilter(categoryFilter === category.id ? '' : category.id)}
            >
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="reports-section">
        <h2>
          {categoryFilter ? 
            `${categories.find(c => c.id === categoryFilter)?.name || 'Filtered'} Reports` : 
            'All Reports'
          } ({filteredReports.length})
        </h2>
        
        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <p>No reports found.</p>
          </div>
        ) : (
          <div className="reports-grid">
            {filteredReports.map(report => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;