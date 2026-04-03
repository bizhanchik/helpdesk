import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

interface ProtectedRouteProps {
  /** If provided, only users with one of these roles can access the route */
  allowedRoles?: Array<'client' | 'agent' | 'admin'>;
}

/**
 * Wraps protected routes. Redirects to /login if unauthenticated,
 * or to / if the user's role is not in allowedRoles.
 */
const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Show spinner while rehydrating session from localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the user's own dashboard instead of a blank page
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'agent') return <Navigate to="/agent" replace />;
    return <Navigate to="/tickets" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
