import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { reportService } from '../services/reportService';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      await loadReports();
    } catch (err) {
      console.error('App initialization error:', err);
      setError('Failed to initialize app');
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getAllReports();
      console.log('Loaded reports:', data);
      // Handle both direct array and paginated response
      if (Array.isArray(data)) {
        setReports(data);
      } else if (data.reports && Array.isArray(data.reports)) {
        setReports(data.reports);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error('Load reports error:', err);
      setError('Failed to load reports. Using demo data.');
      // Fallback demo data
      setReports([
        {
          _id: '1',
          title: 'Broken Street Light',
          description: 'Street light not working',
          category: 'electricity',
          status: 'pending',
          location: 'Main Street',
          images: [],
          user: { _id: '1', name: 'Demo User' },
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Road Pothole',
          description: 'Large pothole on highway',
          category: 'road',
          status: 'in-progress',
          location: 'Highway 101',
          images: [],
          user: { _id: '2', name: 'Admin User' },
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    await loadReports();
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    reports,
    loading,
    error,
    login,
    logout,
    loadReports
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};