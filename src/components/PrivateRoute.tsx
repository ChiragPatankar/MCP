import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';

interface PrivateRouteProps {
  children: ReactNode;
  role?: 'admin' | 'tenant';
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified and user doesn't have that role, redirect
  if (role && user.role !== role) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has the required role, render the protected route
  return <>{children}</>;
};

export default PrivateRoute;