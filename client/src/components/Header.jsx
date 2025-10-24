import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

export default function Header() {
  const { user, isAuthenticated, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = authService.isAdmin();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 0'
        }}>
          <Link 
            to="/" 
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#3b82f6',
              textDecoration: 'none'
            }}
          >
            CivicReport
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link 
              to="/" 
              style={{
                textDecoration: 'none',
                color: isActive('/') ? '#3b82f6' : '#4b5563',
                fontWeight: isActive('/') ? '600' : '400'
              }}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  style={{
                    textDecoration: 'none',
                    color: isActive('/dashboard') ? '#3b82f6' : '#4b5563',
                    fontWeight: isActive('/dashboard') ? '600' : '400'
                  }}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/report" 
                  style={{
                    textDecoration: 'none',
                    color: isActive('/report') ? '#3b82f6' : '#4b5563',
                    fontWeight: isActive('/report') ? '600' : '400'
                  }}
                >
                  Report Issue
                </Link>
                <Link 
                  to="/my-reports" 
                  style={{
                    textDecoration: 'none',
                    color: isActive('/my-reports') ? '#3b82f6' : '#4b5563',
                    fontWeight: isActive('/my-reports') ? '600' : '400'
                  }}
                >
                  My Reports
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    style={{
                      textDecoration: 'none',
                      color: isActive('/admin') ? '#3b82f6' : '#4b5563',
                      fontWeight: isActive('/admin') ? '600' : '400'
                    }}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {isAuthenticated ? (
                <>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Welcome, {user?.name}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="btn btn-primary"
                    style={{ 
                      padding: '0.5rem 1rem', 
                      fontSize: '0.875rem',
                      textDecoration: 'none'
                    }}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn btn-secondary"
                    style={{ 
                      padding: '0.5rem 1rem', 
                      fontSize: '0.875rem',
                      textDecoration: 'none'
                    }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}