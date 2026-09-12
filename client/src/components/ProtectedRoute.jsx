import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner mb-3" style={{ width: 36, height: 36, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-cyan-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
          <p className="text-muted text-sm">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the user's appropriate portal if unauthorized for this specific role
    const homeRoute = {
      student: '/student/dashboard',
      recruiter: '/recruiter/dashboard',
      admin: '/admin/dashboard'
    }[user.role] || '/';
    return <Navigate to={homeRoute} replace />;
  }

  return children;
}
