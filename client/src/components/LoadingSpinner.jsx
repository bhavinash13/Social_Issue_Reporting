import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>{message}</p>
      </div>
    </div>
  );
}