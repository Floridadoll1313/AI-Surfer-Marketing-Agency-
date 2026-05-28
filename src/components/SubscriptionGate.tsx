import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

export const SubscriptionGate: React.FC<{ children: React.ReactNode; requiredTier?: 'technologist' | 'architect' }> = ({ children, requiredTier }) => {
  const { user, isMember, subscriptionTier, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-neon-cyan" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!isMember) {
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  // If architect tier is required for a premium village app, block normal technologist tier users
  if (requiredTier === 'architect' && subscriptionTier !== 'architect') {
    return <Navigate to="/pricing" state={{ from: location, needsUpgrade: true, requiredTier }} replace />;
  }

  return <>{children}</>;
};
