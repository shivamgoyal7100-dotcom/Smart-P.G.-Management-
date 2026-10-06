import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
