import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReportForm from './pages/ReportForm';
import CreateReport from './pages/CreateReport';
import ReportDetails from './pages/ReportDetails';
import MyReports from './pages/MyReports';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import { authService } from './services/authService';

function App() {
  return (
    <AppProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={
                authService.isAuthenticated() ? 
                  <Navigate to="/" replace /> : 
                  <Login />
              } 
            />
            <Route 
              path="/signup" 
              element={
                authService.isAuthenticated() ? 
                  <Navigate to="/" replace /> : 
                  <Signup />
              } 
            />
            <Route 
              path="/report" 
              element={
                <ProtectedRoute>
                  <CreateReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/report/:id" element={<ReportDetails />} />
            <Route 
              path="/my-reports" 
              element={
                <ProtectedRoute>
                  <MyReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;