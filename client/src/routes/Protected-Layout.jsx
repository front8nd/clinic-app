import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedLayout = ({ children, allowedRoles, noAuthReq }) => {
  const { isAuthenticated, userData } = useSelector((state) => state.auth);

  if (noAuthReq) {
    // If authentication is not required, and isAuthenticated, then move the users to AUTH reoutes, to prevent accessing login/register page

    // for public pages, dont use noAuthReq or even protected route, it only prevent access to login/register page while being logged in
    if (isAuthenticated) {
      return <Navigate to="/users" replace />;
    }
    return <>{children}</>;
  }

  // If authentication is required then move to login page
  if (!isAuthenticated && !userData) {
    return <Navigate to="/login" replace />;
  }

  // if role is not allwed then goes to following page
  if (allowedRoles && !allowedRoles.includes(userData?.user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedLayout;
