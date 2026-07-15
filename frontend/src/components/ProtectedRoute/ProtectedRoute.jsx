import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user?.userType || user?.role;

    if (!allowedRoles.includes(userRole)) {
      const fallbackPath = userRole === 'admin'
        ? '/admin-dashboard'
        : userRole === 'recruiter'
          ? '/recruiter-dashboard'
          : '/student-dashboard';

      return <Navigate to={fallbackPath} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
