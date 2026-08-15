import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '../../types';
import { PageLoader } from '../../components/Spinner';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ role, children }: { role?: User['role']; children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader label="Checking your access…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
