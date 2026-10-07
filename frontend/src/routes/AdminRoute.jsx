import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AdminRoute() {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="animate-pulse text-xs text-stone-400 font-medium">
          Verifying administrative permissions...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.is_admin || user?.role === 'admin';
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
