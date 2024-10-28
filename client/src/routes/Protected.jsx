import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, allowedRoles, noAuthReq }) => {
  const { isAuthenticated, userData } = useSelector((state) => state.auth);

  if (noAuthReq) {
    // If authentication is not required, and isAuthenticated, then move the users to AUTH reoutes, to prevent accessing login/register page
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Component />;
  }

  // If authentication is required then move to login page
  if (!isAuthenticated && !userData) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData.user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
